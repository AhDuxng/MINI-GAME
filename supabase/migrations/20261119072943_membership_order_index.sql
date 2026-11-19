-- Chỉ mục cho khoá ngoại memberships.last_order_id để việc xoá đơn chờ quá hạn (pg_cron) không phải quét toàn bảng thành viên
create index if not exists memberships_last_order_idx on public.memberships (last_order_id);
