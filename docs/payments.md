# Phương án thu phí VuiChơi

## 1. Nguyên tắc

- **Bán cho cả bàn, không bán cho một người:** game chơi chung một máy, một người trả thì cả nhóm hưởng. Mọi lời mời đều nói "cả bàn" và chia giá theo số người đang chơi.
- **Vé 9k là sản phẩm chính:** người mua đang ở giữa cuộc vui, quyết định trong vài giây. Mọi điểm chạm trong game đặt Vé Đêm Tiệc lên đầu; Gói Tháng và Trọn Đời đứng sau làm mốc so sánh và đường nâng cấp.
- **Khoá phần "leo thang", không khoá phần khởi động:** bản miễn phí đủ để bắt đầu buổi tiệc. Thứ bị khoá là thứ người chơi muốn khi cuộc vui đã nóng: câu Cháy, nhóm đông, chơi tiếp không giới hạn.
- **Thuyết phục bằng sự thật:** không đồng hồ giảm giá giả, không "X người vừa mua" bịa, không tự gia hạn, không câu từ chối kiểu bêu xấu người không mua. Luật Bảo vệ quyền lợi người tiêu dùng 2023 cấm thông tin gây nhầm lẫn; mất lòng tin thì nhóm bạn cũng không quay lại.
- **Không biến game thành cờ bạc:** Bầu Cua chỉ dùng điểm ảo, không bán điểm, không đổi điểm ra tiền hay quà.

## 2. Gói và giá

| Gói | Giá | Thời hạn | Nhãn hiển thị | Vai trò |
| --- | --- | --- | --- | --- |
| Vé Đêm Tiệc | 9.000đ | 24 giờ | Chơi ngay tối nay | Sản phẩm chính, mua ngay tại bàn, **không cần tài khoản** |
| Gói Tháng | 29.000đ | 30 ngày | Rẻ hơn từ buổi thứ 4 | Đường nâng cấp cho nhóm hay tụ tập (4 vé = 36.000đ) |
| Trọn Đời | 99.000đ | Mãi mãi | Giá trị nhất | Mốc neo giá: "bằng 11 vé", làm vé 9k trông nhẹ nhàng |

**Ưu đãi nâng cấp:** trong 7 ngày sau khi mua Vé Đêm Tiệc bằng tài khoản, tiền vé được trừ vào Gói Tháng (còn 20.000đ) hoặc Trọn Đời (còn 90.000đ), mỗi vé trừ một lần. Nhờ vậy mua vé 9k trước "không bao giờ phí tiền", và người vừa vui một tối có lý do lên gói lớn.

Nhãn chỉ ghi điều đúng. Khi số liệu thật cho thấy vé 9k bán chạy nhất thì mới đổi nhãn thành "Được mua nhiều nhất".

Giá, thời hạn, nhãn, giới hạn và ưu đãi khai báo một chỗ trong `src/features/billing/plans.ts`; máy chủ dùng chung bảng này khi tạo đơn.

## 3. Bản đồ khoá VIP

| Game | Miễn phí | VIP | Vì sao khoá chỗ này |
| --- | --- | --- | --- |
| Bầu Cua, Gián Điệp, Bom Nổ Chậm | 3 lượt thử/ngày mỗi game | Không giới hạn | Cho nếm đủ để thấy vui, hết lượt đúng lúc đang hăng |
| Thật hay Thách, Tôi Chưa Từng, Chỉ Mặt Đặt Tên, Này Hay Kia | Mức Nhẹ nhàng, Sôi động | Thêm mức Cháy | Mức Cháy là "leo thang" khi bàn đã nóng; lá Cháy lấp ló gợi tò mò |
| Đoán Trên Trán | 6 chủ đề | Thêm Gen Z, Bàn nhậu | Hai chủ đề hợp bàn nhậu nhất |
| Vẽ Nhanh Đoán Lẹ | Dễ, Vừa | Thêm Thành ngữ | Bộ khó và vui nhất cho nhóm đã quen luật |
| Đua Vịt | 6 vịt | 8 vịt | Nhóm đông thì chia tiền rẻ hơn, dễ chịu chi |
| Xoay Chai | 10 người | 16 người | Như trên |
| Nhanh Tay Lẹ Mắt | 2–3 người | 4 người | Chế độ đông vui nhất |
| Ma Sói Online, các game còn lại | Miễn phí | Miễn phí | Ma Sói cần cả nhóm vào phòng, khoá sẽ chặn đường lan truyền |

## 4. Điểm chạm và đòn bẩy tâm lý

| Điểm chạm | Đòn bẩy | Cách làm |
| --- | --- | --- |
| Hộp thoại nâng cấp (mở khi chạm thứ bị khoá) | Đúng lúc, đúng lý do | Nêu chính thứ vừa chạm, vé 9k nằm đầu với nút "Mở khoá cả bàn tối nay" |
| Giá chia đầu người | Chia nhỏ cảm giác chi tiêu | "9.000đ · chia 6 người ≈ 1.500đ/người", lấy số người từ danh sách người chơi |
| Giờ hết hạn cụ thể | Cụ thể hoá giá trị | "Dùng tới 21:30 ngày mai" thay vì chỉ ghi "24 giờ" |
| Mua không cần tài khoản | Bỏ ma sát | Vé 9k mua bằng phiên khách ẩn danh, quét mã là chạy |
| Thử VIP 10 phút (1 lần mỗi máy) | Hiệu ứng sở hữu | Có trong tay rồi mới mất thì tiếc hơn chưa từng có; hết giờ thì mở hộp thoại "Giữ VIP cả tối" |
| Dải đếm ngược khi đang thử | Nhắc trung thực | Thời gian thử thật còn lại và nút giữ VIP |
| Lá Cháy lấp ló (cứ 4 lá một lần, chỉ ở mức Sôi động/Tất cả) | Khoảng trống tò mò | Hé 3 chữ đầu của một lá Cháy thật, phần còn lại làm mờ |
| Dải lượt thử trên game VIP | Mất mát sắp tới | "còn 1/3 lượt thử · cả bàn chơi thả ga 9.000đ (≈ 1.500đ/người)" |
| Màn khoá khi hết lượt | Đang hăng thì không muốn dừng | "Cả bàn đang vui thì đừng dừng lại" kèm vé 9k và nút thử 10 phút |
| Nhóm đông vượt giới hạn | Nhóm đông, chia tiền rẻ | "Còn 3 người chưa được ngồi · Mở bàn 16 chỗ" |
| Bảng giá ba gói | Neo giá | Trọn Đời "bằng 11 vé" làm mốc; Gói Tháng "rẻ hơn từ buổi thứ 4" |
| Vé còn dưới 2 giờ | Nhắc gia hạn, lên gói | Dải trạng thái "Vé VIP còn 1:42:10 · Lên Gói Tháng 20.000đ" |
| Sau khi trả tiền | Thoả mãn ngay | Nút "Quay lại chơi tiếp" đưa về đúng game đang chơi dở |
| Trang chủ | Nhận diện | Dải VIP "Cả bàn mở khoá tối nay chỉ 9.000đ" và nút thử 10 phút |

## 5. Kiến trúc đã triển khai

- **Đăng nhập:** Supabase Auth, dùng email + mật khẩu (có xác nhận email, quên/đổi mật khẩu) hoặc Google. Game miễn phí không cần đăng nhập. Vé Đêm Tiệc mua bằng phiên khách ẩn danh của Supabase (cần bật "Allow anonymous sign-ins", Ma Sói cũng dùng); Gói Tháng và Trọn Đời bắt buộc tài khoản.
- **Cơ sở dữ liệu** (`supabase/migrations/20261119072812_vip_payments.sql`):
  - `orders`: đơn hàng, số tiền do máy chủ đặt theo `src/features/billing/plans.ts`.
  - `memberships`: gói VIP theo tài khoản.
  - `payment_events`: nhật ký mọi giao dịch SePay gửi về, khử trùng lặp theo mã giao dịch.
  - RLS: người dùng chỉ đọc được đơn và gói của mình, không ghi được gì từ trình duyệt.
- **Siết chặt thanh toán** (`20261119072847_payment_hardening.sql`):
  - mỗi vé 9k chỉ được trừ vào một đơn đã trả;
  - đơn quá hạn 2 ngày hoặc dùng lại ưu đãi đã dùng thì không tự kích hoạt mà ghi kết quả `expired`, `credit_used` trong `payment_events` để hoàn tiền thủ công;
  - khoá theo người dùng để hai khoản tiền về cùng lúc không ghi đè gói;
  - xoá tài khoản vẫn giữ lịch sử đơn.
- **Dọn dẹp** (`20261119072908_housekeeping.sql`): pg_cron xoá đơn chờ quá 2 ngày và khách ẩn danh hơn 30 ngày không có đơn.
- **Ảnh VietQR** lấy từ `qr.sepay.vn` (dịch vụ của SePay), không gửi kèm Referer. Webhook chỉ nhận tiền vào đúng `BANK_ACCOUNT_NUMBER` đã cấu hình.
- **Chống spam:** mỗi người tạo tối đa 10 đơn mỗi giờ, mỗi IP 30 đơn; thân yêu cầu có giới hạn kích thước.
- **Kích hoạt gói:** hàm `settle_payment` chạy trong một giao dịch database:
  - ghi nhận giao dịch, bỏ qua nếu trùng mã giao dịch;
  - khoá đơn rồi kiểm tra số tiền (chuyển thiếu thì không kích hoạt, chuyển dư vẫn kích hoạt);
  - cộng dồn thời hạn vào gói đang dùng; đã có gói Trọn đời thì giữ nguyên.
- **API** (`src/app/api`):
  - `POST /api/orders`: tạo đơn. Vé Đêm Tiệc nhận cả phiên khách, gói khác bắt buộc tài khoản. Tự trừ tiền vé 9k đã mua trong 7 ngày (migration `20261119072831_upgrade_credit.sql` thêm `credit_order_id`, `credit_amount`). Dùng lại đơn đang chờ cùng gói, cùng giá nếu còn hạn. Trả về thông tin chuyển khoản và ảnh VietQR.
  - `GET /api/orders/:code`: trang thanh toán gọi 3 giây một lần để biết khi nào tiền về.
  - `POST /api/webhooks/sepay`:
    - xác thực HMAC-SHA256 (hoặc API Key);
    - chỉ xử lý giao dịch tiền vào có mã đơn;
    - trả `{"success": true}` để SePay không gửi lại.
  - `POST /api/dev/simulate-payment`: giả lập tiền về khi phát triển. Chỉ chạy khi `PAYMENT_DEV_SIMULATION=true` và không phải môi trường production.
- **Trình duyệt:** `PremiumContext` đọc gói từ bảng `memberships` theo phiên hiện tại (tài khoản hoặc khách đã mua vé), tính ưu đãi nâng cấp từ bảng `orders`. Lượt chơi thử 3 lần/ngày và 10 phút thử VIP lưu trên máy.

**Giới hạn còn lại:**
- Mã nguồn các game VIP và bộ câu mức Cháy vẫn nằm trong JavaScript gửi xuống trình duyệt, nên người rành kỹ thuật vẫn có thể vượt lượt thử hay kéo dài 10 phút thử. Việc trả tiền, kích hoạt và thời hạn gói thì đã do máy chủ kiểm soát. Nếu cần chặn chặt hơn, chuyển nội dung VIP sang API có kiểm tra gói.
- Vé mua bằng phiên khách gắn với trình duyệt đó; xoá dữ liệu trang hoặc đăng nhập tài khoản khác thì mất vé. Ưu đãi nâng cấp chỉ áp dụng cho vé mua khi đã đăng nhập.

## 6. Hướng dẫn cài đặt

### 6.1 Chọn ngân hàng

Mở hoặc dùng sẵn một tài khoản ngân hàng **đứng tên bạn** ở ngân hàng mà SePay kết nối trực tiếp, ví dụ MBBank, ACB, TPBank, VietinBank, VPBank. Danh sách cập nhật xem trên my.sepay.vn.
- **VietinBank** (tài khoản cá nhân/hộ gia đình): nội dung chuyển khoản phải có chữ `SEVQR`, nên đặt `PAYMENT_NOTE_PREFIX=SEVQR`.
- **BIDV, OCB, MSB:** cần dùng tài khoản ảo (VA) của SePay.
- MoMo/VNPay chưa cần thiết: khách quét VietQR được bằng mọi app ngân hàng. Khi đã có hộ kinh doanh thì có thể thêm sau.

### 6.2 Supabase

**Đã làm sẵn** (project `vuichoi`, mã `hfmmoqjitnvnwlsugray`, region Singapore):
- đã chạy toàn bộ migration trong `supabase/migrations/` (tên file trùng phiên bản đã ghi trên Supabase, nên `supabase db push` về sau không chạy lại);
- đã bật `pg_cron` với 3 job dọn dẹp, thu hẹp quyền Data API (trình duyệt chỉ đọc đơn và gói của chính mình);
- `.env.local` đã có `NEXT_PUBLIC_SUPABASE_URL` và khoá publishable.

**Còn phải bấm trên dashboard** (MCP không chỉnh được phần cấu hình Auth):
1. **Authentication → Sign In / Providers → Allow anonymous sign-ins:** bật. Đây là đường mua vé 9k không cần tài khoản và vào phòng Ma Sói. Khi chưa bật, web tự chuyển sang yêu cầu đăng nhập. Không bật CAPTCHA, vì app chưa gửi mã CAPTCHA nên mọi lượt đăng nhập sẽ bị từ chối.
2. **Authentication → URL Configuration:**
   - Site URL đặt là tên miền thật (lúc chạy máy là `http://localhost:3000`);
   - thêm `http://localhost:3000/auth/callback` và `https://<tên-miền>/auth/callback` vào Redirect URLs.
3. **Email xác nhận:** SMTP mặc định của Supabase chỉ gửi tới email thành viên trong team Supabase, và vài email mỗi giờ. Trước khi mở cho người ngoài, chọn một cách:
   - cấu hình SMTP riêng ở **Authentication → Emails → SMTP Settings** (ví dụ Resend, cần tên miền);
   - hoặc tạm tắt "Confirm email" ở **Sign In / Providers → Email**: đăng ký là vào luôn, nhưng "Quên mật khẩu" vẫn cần SMTP.
4. **Google** (không bắt buộc, nút Google tự ẩn khi chưa bật):
   - tạo OAuth Client loại Web application trong Google Cloud Console, với Authorized redirect URI là `https://hfmmoqjitnvnwlsugray.supabase.co/auth/v1/callback`;
   - dán Client ID/Secret vào **Sign In / Providers → Google**.
5. **Project Settings → API Keys:** chép khoá bí mật vào `SUPABASE_SERVICE_ROLE_KEY` trong `.env.local`. Dùng secret key `sb_secret_...` hoặc khoá legacy `service_role` đều được. Thiếu khoá này thì tạo đơn và Ma Sói online trả về "chưa cấu hình".

Sau khi sửa `.env.local`, tắt rồi chạy lại `npm run dev`: header bảo mật (CSP) chỉ đọc địa chỉ Supabase lúc khởi động.

### 6.3 SePay

1. Đăng ký my.sepay.vn và liên kết tài khoản ngân hàng ở bước 6.1.
2. **Cấu hình công ty → Cấu trúc mã thanh toán:** tiền tố `VC`, theo sau là 8 ký tự chữ và số (khớp `PAYMENT_CODE_PREFIX`). Nhờ vậy SePay tự tách mã đơn vào trường `code`.
3. **Webhooks → Thêm webhook:**
   - URL: `https://<tên-miền>/api/webhooks/sepay`;
   - sự kiện: **Có tiền vào**;
   - bật "Bỏ qua giao dịch không có mã thanh toán";
   - kiểu xác thực: **HMAC-SHA256**, lưu Secret Key vào `SEPAY_WEBHOOK_SECRET`;
   - bật tự gửi lại khi server lỗi.
4. Thử trước ở **Test mode → Mô phỏng giao dịch**: tạo một đơn trên web, rồi mô phỏng tiền vào đúng số tiền với nội dung là mã đơn.

### 6.4 Biến môi trường

Chép `.env.example` thành `.env.local` khi chạy máy, hoặc khai báo trên nơi deploy.

| Biến | Ý nghĩa |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Tên miền của web |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Kết nối Supabase phía trình duyệt |
| `SUPABASE_SERVICE_ROLE_KEY` | Khoá quản trị, **chỉ đặt trên máy chủ**, không bao giờ có tiền tố `NEXT_PUBLIC_` |
| `BANK_CODE`, `BANK_ACCOUNT_NUMBER`, `BANK_ACCOUNT_NAME` | Tài khoản nhận tiền hiển thị trên mã VietQR |
| `PAYMENT_CODE_PREFIX` | Tiền tố mã đơn, phải khớp cấu hình SePay (mặc định `VC`) |
| `PAYMENT_NOTE_PREFIX` | Chữ thêm trước mã đơn nếu ngân hàng yêu cầu (VietinBank: `SEVQR`) |
| `SEPAY_WEBHOOK_SECRET` hoặc `SEPAY_WEBHOOK_API_KEY` | Khoá xác thực webhook; nếu không đặt, mọi webhook đều bị từ chối |
| `PAYMENT_DEV_SIMULATION`, `NEXT_PUBLIC_PAYMENT_DEV_SIMULATION` | `true` để hiện nút giả lập tiền về khi phát triển; luôn để `false` trên production |

Thiếu cấu hình Supabase thì app vẫn chạy các game miễn phí, còn phần tài khoản và thanh toán hiển thị thông báo "chưa cấu hình".

### 6.5 Deploy

Webhook cần một địa chỉ HTTPS công khai, nên phải deploy lên nền tảng chạy được Next.js server như Vercel, Render hoặc VPS, không thể xuất trang tĩnh. Sau khi deploy, cập nhật lại URL webhook trên SePay và Redirect URL trên Supabase theo tên miền thật.

### 6.6 Kiểm tra trước khi nhận tiền thật

1. Đăng ký tài khoản email, xác nhận email, đăng nhập và đăng xuất. Đăng nhập bằng Google.
2. Chưa đăng nhập, tạo đơn Vé Đêm Tiệc, mô phỏng tiền vào trên SePay Test mode: trang thanh toán phải tự chuyển sang "Thanh toán thành công" và game VIP mở khoá.
3. Đăng nhập, mua vé rồi mở Gói Tháng: giá phải còn 20.000đ; trả xong, mở lại thì giá về 29.000đ.
4. Gửi lại cùng webhook: gói không được cộng thêm. Mô phỏng chuyển thiếu tiền: đơn vẫn chờ.
5. Chuyển thật 9.000đ từ một tài khoản khác để thử luồng cuối cùng.

## 7. Pháp lý và rủi ro cần kiểm tra

Đây là các điểm cần làm rõ, không phải tư vấn pháp lý. Nên hỏi người có chuyên môn trước khi thu tiền thật.

- **Thương mại điện tử:** website bán dịch vụ trực tuyến thường phải thông báo hoặc đăng ký với Bộ Công Thương, đồng thời công bố điều khoản sử dụng, chính sách hoàn tiền và thông tin người bán.
- **Thuế và chứng từ:** doanh thu từ gói VIP cần được kê khai theo quy định với cá nhân hoặc hộ kinh doanh, hoặc doanh nghiệp.
- **Nội dung có rượu bia:** giữ cảnh báo 18+ và lời nhắc "Đã uống rượu bia, không lái xe". Nên hỏi tuổi trước khi vào nhóm game Bàn nhậu.
- **Bầu Cua:** chỉ điểm ảo; không bán điểm, không cho đổi thưởng, không xếp hạng có giải. Như vậy để không bị xem là tổ chức đánh bạc.
- **Dữ liệu cá nhân:** khi có tài khoản thì chỉ thu tối thiểu (tên hiển thị, email hoặc số điện thoại) và có chính sách quyền riêng tư.

## 8. Chỉ số theo dõi

- Tỉ lệ mở hộp thoại nâng cấp → bấm mua → trả tiền, tách theo lý do mở (lá Cháy, hết lượt, nhóm đông, hết 10 phút thử).
- Tỉ lệ người thử VIP 10 phút rồi mua trong cùng buổi.
- Tỉ lệ chọn từng gói, doanh thu trung bình trên người trả tiền; tỉ lệ vé 9k mua bằng phiên khách.
- Tỉ lệ người mua Vé Đêm Tiệc dùng ưu đãi lên Gói Tháng trong 7 ngày.
- Game nào dẫn tới nhiều lượt mua nhất, để biết nên làm thêm game loại nào.

Việc đo lường cần có thông báo và sự đồng ý của người dùng nếu dùng công cụ phân tích bên ngoài.

## 9. Lộ trình

1. **Đã xong:** chia gói, lượt thử, màn khoá, trang giá; tài khoản (email/Google); API đơn hàng; webhook SePay; kích hoạt gói trên máy chủ; lịch sử đơn trong trang Tài khoản.
2. **Tiếp theo:** tạo project Supabase và tài khoản SePay thật (mục 6), cấu hình SMTP riêng, deploy.
3. **Sau đó:** chuyển phiên khách thành tài khoản khi đăng ký (giữ vé và ưu đãi nâng cấp); chuyển nội dung VIP sang API; trang quản trị đơn hàng để kích hoạt thủ công khi khách ghi sai nội dung; mã quà tặng gói VIP.
