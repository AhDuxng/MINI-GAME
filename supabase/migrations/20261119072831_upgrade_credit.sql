-- Ưu đãi nâng cấp: đơn gói tháng hoặc trọn đời được trừ tiền một vé 9k đã mua trong 7 ngày; ghi lại vé đã dùng để mỗi vé chỉ được trừ một lần
alter table public.orders
  add column if not exists credit_order_id uuid references public.orders (id),
  add column if not exists credit_amount integer not null default 0 check (credit_amount >= 0);

create index if not exists orders_credit_order_idx on public.orders (credit_order_id) where credit_order_id is not null;
