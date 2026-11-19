-- Phòng Ma Sói online: toàn bộ trạng thái ván (gồm vai bí mật) nằm trong một cột jsonb, chỉ máy chủ đọc/ghi bằng service role, cột version chống ghi chồng
create table public.werewolf_rooms (
  code text primary key check (code ~ '^[A-HJKMNP-Z2-9]{5}$'),
  state jsonb not null,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index werewolf_rooms_updated_at_idx on public.werewolf_rooms (updated_at);

alter table public.werewolf_rooms enable row level security;

revoke all on public.werewolf_rooms from public, anon, authenticated;
grant all on public.werewolf_rooms to service_role;
