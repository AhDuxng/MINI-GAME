-- Thu hẹp quyền mặc định của Data API: trình duyệt chỉ được đọc đơn hàng và gói VIP của chính mình (RLS lọc theo người dùng), mọi thao tác ghi và nhật ký thanh toán chỉ dành cho máy chủ dùng service role
revoke all on public.orders, public.memberships, public.payment_events from anon, authenticated;
grant select on public.orders, public.memberships to authenticated;
revoke all on sequence public.payment_events_id_seq from anon, authenticated;
