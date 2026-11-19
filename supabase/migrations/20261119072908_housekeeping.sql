-- Dọn dẹp định kỳ bằng pg_cron thay vì dọn trong từng yêu cầu: phòng Ma Sói không hoạt động quá 24 giờ, đơn chờ đã quá hạn 2 ngày, khách ẩn danh hơn 30 ngày không có đơn hàng nào
create extension if not exists pg_cron;

select cron.schedule(
  'purge-idle-werewolf-rooms',
  '17 * * * *',
  $$delete from public.werewolf_rooms where updated_at < now() - interval '24 hours'$$
);

select cron.schedule(
  'purge-stale-pending-orders',
  '27 3 * * *',
  $$delete from public.orders where status = 'pending' and expires_at < now() - interval '2 days'$$
);

select cron.schedule(
  'purge-old-anonymous-users',
  '37 3 * * *',
  $$delete from auth.users u
    where u.is_anonymous
      and u.created_at < now() - interval '30 days'
      and not exists (select 1 from public.orders o where o.user_id = u.id)$$
);
