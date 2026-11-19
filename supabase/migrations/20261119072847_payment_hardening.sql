-- Siết chặt kích hoạt gói: mỗi vé 9k chỉ được trừ vào một đơn đã trả, đơn quá 2 ngày hoặc dùng lại ưu đãi thì không tự kích hoạt (để hoàn tiền thủ công), khoá theo người dùng để hai giao dịch cùng lúc không ghi đè gói, xoá tài khoản vẫn giữ lịch sử đơn
create unique index if not exists orders_credit_paid_once_idx
  on public.orders (credit_order_id)
  where credit_order_id is not null and status = 'paid';

alter table public.orders alter column user_id drop not null;
alter table public.orders drop constraint if exists orders_user_id_fkey;
alter table public.orders
  add constraint orders_user_id_fkey foreign key (user_id) references auth.users (id) on delete set null;

create index if not exists orders_pending_expiry_idx on public.orders (expires_at) where status = 'pending';

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
  elsif v_order.user_id is null then
    v_result := 'orphan_order';
  elsif v_order.expires_at < now() - interval '2 days' then
    v_result := 'expired';
  elsif p_amount < v_order.amount then
    v_result := 'amount_mismatch';
  else
    perform pg_advisory_xact_lock(hashtextextended(v_order.user_id::text, 0));

    if v_order.credit_order_id is not null and exists (
      select 1 from public.orders
      where credit_order_id = v_order.credit_order_id and status = 'paid' and id <> v_order.id
    ) then
      if p_amount >= v_order.amount + v_order.credit_amount then
        update public.orders set credit_order_id = null, credit_amount = 0 where id = v_order.id;
      else
        v_result := 'credit_used';
      end if;
    end if;

    if v_result is null then
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
  end if;

  update public.payment_events
  set result = v_result
  where provider = 'sepay' and provider_transaction_id = p_transaction_id;

  return v_result;
end;
$$;

revoke all on function public.settle_payment(bigint, text, integer, jsonb) from public, anon, authenticated;
grant execute on function public.settle_payment(bigint, text, integer, jsonb) to service_role;
