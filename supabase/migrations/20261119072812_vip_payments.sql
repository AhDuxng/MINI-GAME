-- Đơn hàng, thành viên VIP, nhật ký thanh toán và hàm settle_payment kích hoạt gói trong một giao dịch (khử trùng lặp theo mã giao dịch SePay)
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id text not null check (plan_id in ('party-pass', 'monthly', 'lifetime')),
  amount integer not null check (amount > 0),
  duration_days integer check (duration_days > 0),
  status text not null default 'pending' check (status in ('pending', 'paid')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '30 minutes',
  paid_at timestamptz
);

create index orders_user_created_idx on public.orders (user_id, created_at desc);

create table public.memberships (
  user_id uuid primary key references auth.users (id) on delete cascade,
  plan_id text not null,
  expires_at timestamptz,
  last_order_id uuid references public.orders (id),
  updated_at timestamptz not null default now()
);

create table public.payment_events (
  id bigserial primary key,
  provider text not null default 'sepay',
  provider_transaction_id bigint not null,
  order_code text,
  amount integer not null,
  result text not null,
  payload jsonb not null,
  received_at timestamptz not null default now(),
  unique (provider, provider_transaction_id)
);

alter table public.orders enable row level security;
alter table public.memberships enable row level security;
alter table public.payment_events enable row level security;

create policy "orders_select_own" on public.orders
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "memberships_select_own" on public.memberships
  for select to authenticated using ((select auth.uid()) = user_id);

create or replace function public.settle_payment(
  p_transaction_id bigint,
  p_order_code text,
  p_amount integer,
  p_payload jsonb
) returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_current_expiry timestamptz;
  v_has_membership boolean;
  v_expires timestamptz;
  v_plan text;
  v_result text;
begin
  insert into public.payment_events (provider_transaction_id, order_code, amount, result, payload)
  values (p_transaction_id, p_order_code, p_amount, 'received', p_payload)
  on conflict (provider, provider_transaction_id) do nothing;

  if not found then
    return 'duplicate';
  end if;

  select * into v_order from public.orders where code = p_order_code for update;

  if not found then
    v_result := 'unknown_order';
  elsif v_order.status = 'paid' then
    v_result := 'already_paid';
  elsif p_amount < v_order.amount then
    v_result := 'amount_mismatch';
  else
    select expires_at, true into v_current_expiry, v_has_membership
    from public.memberships where user_id = v_order.user_id for update;

    if v_order.duration_days is null or (coalesce(v_has_membership, false) and v_current_expiry is null) then
      v_expires := null;
      v_plan := 'lifetime';
    else
      v_expires := greatest(now(), coalesce(v_current_expiry, now())) + make_interval(days => v_order.duration_days);
      v_plan := v_order.plan_id;
    end if;

    insert into public.memberships (user_id, plan_id, expires_at, last_order_id, updated_at)
    values (v_order.user_id, v_plan, v_expires, v_order.id, now())
    on conflict (user_id) do update
      set plan_id = excluded.plan_id,
          expires_at = excluded.expires_at,
          last_order_id = excluded.last_order_id,
          updated_at = now();

    update public.orders set status = 'paid', paid_at = now() where id = v_order.id;
    v_result := 'paid';
  end if;

  update public.payment_events
  set result = v_result
  where provider = 'sepay' and provider_transaction_id = p_transaction_id;

  return v_result;
end;
$$;

revoke all on function public.settle_payment(bigint, text, integer, jsonb) from public, anon, authenticated;
grant execute on function public.settle_payment(bigint, text, integer, jsonb) to service_role;
