# Ma Sói online

Mỗi người chơi trên điện thoại của mình. Máy chủ giữ toàn bộ bí mật của ván. Đêm xuống, màn hình của cả làng tối hết; chỉ vai đang được gọi mới thức dậy, thấy đồng đội và chọn người.

## Bật tính năng

Ma Sói dùng chung dự án Supabase với phần tài khoản và thanh toán (xem [payments.md](payments.md)).

1. **Tạo bảng:** chạy migration `supabase/migrations/20261119072827_werewolf_rooms.sql` (SQL Editor, hoặc `supabase db push`). Migration `20261119072908_housekeeping.sql` lên lịch `pg_cron` xoá phòng không hoạt động quá 24 giờ, nên cần bật extension `pg_cron` (Database → Extensions).
2. **Cho khách vào nhanh:** vào Authentication → Sign In / Providers và bật **Allow anonymous sign-ins**. Người chưa có tài khoản chỉ cần nhập tên là vào chơi. Nếu tắt mục này, người chơi phải đăng nhập trước. Supabase khuyên bật thêm CAPTCHA để chặn tạo phiên ảo hàng loạt.
3. **Realtime:** dùng kênh broadcast công khai, mặc định đã bật. Không cần tạo bảng hay policy nào cho Realtime.
4. **Biến môi trường:** dùng lại `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` và `SUPABASE_SERVICE_ROLE_KEY`, không cần thêm biến mới.

Thiếu cấu hình Supabase thì trang Ma Sói hiện thông báo "Làng Ma Sói chưa mở cửa", các game khác vẫn chạy bình thường.

## Luật trong app

| Vai | Phe | Năng lực |
| --- | --- | --- |
| Ma Sói | Sói | Mỗi đêm cả bầy chọn một người để cắn. Các sói biết mặt nhau. |
| Tiên Tri | Dân | Mỗi đêm soi một người, biết người đó có phải sói không. |
| Bảo Vệ | Dân | Mỗi đêm che chở một người khỏi sói, không được giữ cùng một người hai đêm liền. Được tự bảo vệ. |
| Phù Thủy | Dân | Thấy ai bị sói cắn. Có một bình cứu và một bình độc, mỗi bình dùng một lần cả ván. |
| Thợ Săn | Dân | Khi bị cắn hoặc bị treo cổ thì được bắn theo một người. Chết vì bình độc thì không được bắn. |
| Dân Làng | Dân | Không có năng lực, chỉ có lý lẽ và lá phiếu. |

**Chia vai tự động theo số người (5–16):**
- Sói: 1 con (5–6 người), 2 (7–10), 3 (11–14), 4 (15–16).
- Luôn có Tiên Tri.
- Thêm Bảo Vệ từ 6 người, Phù Thủy từ 7, Thợ Săn từ 8.

Chủ phòng có thể tắt chia tự động để tự chọn, miễn số sói ít hơn một nửa số người.

**Một vòng chơi:**
1. **Nhận vai** (20 giây): nhấn giữ lá bài để xem, ai xem xong bấm "Đã xem vai".
2. **Đêm:** gọi lần lượt Bảo Vệ (25 giây), bầy sói (45 giây), Tiên Tri (25 giây), Phù Thủy (30 giây).
   - Ai xong việc thì bước đó kết thúc sớm.
   - Sói chọn khác nhau thì lấy người nhiều phiếu nhất, hoà thì chọn ngẫu nhiên giữa những người hoà.
3. **Trời sáng:** báo ai đã chết nhưng không nói chết vì sao.
   - Người bị cắn sống sót nếu được Bảo Vệ giữ hoặc Phù Thủy cứu.
   - Người bị đầu độc thì chết dù có Bảo Vệ.
4. **Thảo luận** (1–5 phút, chủ phòng chọn): quá nửa người còn sống bấm "Sẵn sàng" thì bỏ phiếu sớm. Chủ phòng cũng có thể chuyển ngay sang bỏ phiếu.
5. **Bỏ phiếu** (60 giây, công khai):
   - Người nhiều phiếu nhất bị treo cổ.
   - Hoà phiếu, hoặc số phiếu "bỏ qua" không ít hơn số phiếu cao nhất, thì không ai bị treo.

**Thắng thua:** dân thắng khi không còn sói. Sói thắng khi số sói bằng hoặc nhiều hơn số người còn lại.

## Giữ bí mật như thế nào

- **Chỉ máy chủ đọc được trạng thái:** bảng `werewolf_rooms` bật RLS, thu hồi mọi quyền của `anon` và `authenticated`, nên trình duyệt không đọc thẳng được.
- **Mỗi người một bản nhìn riêng:** API chỉ trả về bản nhìn của người hỏi, gồm:
  - vai của mình;
  - đồng bọn, nếu mình là sói;
  - vai người đã chết, nếu bật lộ vai;
  - vai của tất cả khi ván kết thúc.
- **Thông tin đêm chỉ gửi cho người đang thức:**
  - Phù Thủy thấy người bị cắn.
  - Sói thấy phiếu của nhau.
  - Tiên Tri thấy kết quả soi.
  - Người ngủ không nhận cả đồng hồ của bước đêm.
- **Bước đêm giả:** vai đã chết (hoặc Phù Thủy hết bình) vẫn được "gọi" với thời lượng ngẫu nhiên 5–9 giây, nên không ai suy ra vai nào còn sống qua nhịp đêm.
- **Chat theo kênh:**
  - Chat sói chỉ mở cho sói trong bước của bầy.
  - Người chết chỉ nói chuyện với nhau ở kênh hồn ma.
  - Ban đêm dân làng không được chat.
  - Ván kết thúc thì mọi kênh được mở cho cả làng xem lại.
- **Lá vai úp sẵn:** phải nhấn giữ mới lật, để người ngồi cạnh không nhìn trộm.

## Giới hạn

- Phòng tự xoá sau 24 giờ không hoạt động (pg_cron chạy mỗi giờ).
- **Chống quá tải:**
  - mỗi người tạo tối đa 5 phòng mỗi 10 phút;
  - mỗi người gửi tối đa 20 hành động mỗi 10 giây;
  - mỗi IP chỉ được hỏi 30 mã phòng không tồn tại mỗi phút, để không dò được mã.
- **Đồng bộ nhẹ:**
  - tín hiệu realtime mang số phiên bản; tín hiệu cũ bị bỏ qua, tín hiệu dồn dập được gộp thành một lần tải;
  - khi realtime đang chạy, máy chỉ hỏi định kỳ 12 giây một lần và dừng hỏi khi ẩn tab;
  - lúc hết pha, các máy hỏi lệch nhau một chút để không cùng lúc ghi một bước chuyển pha.
- Người bị chủ phòng mời ra không vào lại được phòng đó.
- **Việc nên làm tiếp khi phòng đông:** chuyển kênh realtime sang private kèm policy trên `realtime.messages`, để chỉ máy chủ được phát tín hiệu đồng bộ; tách chat ra khỏi cột `state`.
- Khách ẩn danh gắn với trình duyệt đang dùng. Đổi máy hoặc xoá dữ liệu trình duyệt giữa ván thì không vào lại được ghế cũ. Người dùng tài khoản thì vào lại được trên máy khác.
- Pha chỉ chuyển khi có người đang mở phòng hỏi máy chủ. Nếu cả làng thoát hết, ván dừng ở pha đó và tiếp tục khi có người quay lại, với đủ thời gian cho pha mới.
