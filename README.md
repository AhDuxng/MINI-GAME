# VuiChơi — Mini game cho tiệc tùng

Bộ sưu tập mini game cho các buổi tụ tập. Phần lớn game chơi chung trên một máy và không cần backend: nội dung nằm trong các file JSON tĩnh, trạng thái người chơi và tuỳ chọn lưu trong `localStorage`. Ma Sói online, tài khoản và gói VIP dùng Supabase.

## Trò chơi

| Game | Thể loại | Gói | Điểm chính |
| --- | --- | --- | --- |
| Ma Sói Online | Chơi online | Miễn phí | Mỗi người một điện thoại, máy chủ giữ kín vai, đêm xuống màn hình tối hết, chỉ vai được gọi mới thức dậy và thấy nhau |
| Nhanh Tay Lẹ Mắt | Chơi nhóm | Miễn phí 2–3 người, VIP 4 người | 2 đến 4 người chung một máy, mỗi người một góc màn hình, chạm đúng lúc đèn xanh, thấy con vịt, số 7 hay chữ đúng màu |
| Đoán Trên Trán | Chơi nhóm | Miễn phí (chủ đề Gen Z, Bàn nhậu cho VIP) | Áp máy lên trán, cả nhóm gợi ý, chạm hoặc cúi/ngửa máy để chấm đúng hay bỏ qua |
| Vẽ Nhanh Đoán Lẹ | Chơi nhóm | Miễn phí (bộ Thành ngữ cho VIP) | Xem lén từ khoá, vẽ trên màn hình có hộp màu, tẩy, hoàn tác, ai đoán đúng thì cả hai được điểm |
| Này Hay Kia | Bàn nhậu | Miễn phí (mức Cháy cho VIP) | Câu hỏi hai lựa chọn, đếm 3 giây cùng chọn phe, phe ít người hơn uống |
| Xoay Chai | Bàn nhậu | Miễn phí 10 người, VIP 16 người | Chai 3D xoay giữa bàn, dừng trước ai thì người đó chọn Thật, Thách hoặc uống |
| Bom Số | Bàn nhậu | Miễn phí | Đoán số né bom, khoảng an toàn hẹp dần, trúng số bom thì nổ |
| Luật Bài | Bàn nhậu | Miễn phí | Bộ 52 lá lật 3D, mỗi lá một luật uống, lá K thứ tư cạn ly chung |
| Chỉ Mặt Đặt Tên | Chơi nhóm | Miễn phí (mức Cháy cho VIP) | Câu "Ai dễ... nhất?", đếm ngược 3 giây rồi cả bàn cùng chỉ |
| Bầu Cua | Ngày Tết | VIP | Lắc bát 3 xúc xắc 3D, cược điểm ảo cho cả nhóm, bảng điểm |
| Gián Điệp | Trí tuệ | VIP | Chuyền máy xem từ bí mật, thảo luận có giờ, bỏ phiếu tìm gián điệp |
| Bom Nổ Chậm | Chơi nhóm | VIP | Bom hẹn giờ ngẫu nhiên không ai biết trước, trả lời theo chủ đề rồi chuyền |
| Tôi Chưa Từng | Bàn nhậu | Miễn phí (mức Cháy cho VIP) | Lật lá bài, chạm tên ai đã từng để tính ngụm, bảng "từng trải" |
| Thật hay Thách | Chơi nhóm | Miễn phí (mức Cháy cho VIP) | Chồng bài 3D, 90 lá chia 3 mức độ, không lặp lá vừa rút |
| Đua Vịt | Chơi nhóm | Miễn phí 6 vịt, VIP 8 vịt | Hồ nước 3D, vịt cao su, camera bám đoàn đua, người về chót chịu phạt |
| Vòng Quay May Mắn | Bàn nhậu | Miễn phí | Bánh xe 3D, nạp nhanh người chơi hoặc hình phạt, loại ô vừa trúng |
| Xí Ngầu Cạn Ly | Bàn nhậu | Miễn phí | Xúc xắc 3D, xoay lượt người chơi, lắc điện thoại để tung |
| Nối Từ | Trí tuệ | Miễn phí | Nối từ 2 tiếng hoặc kể theo chủ đề, đồng hồ mỗi lượt, cả bàn bác bỏ từ vô nghĩa |
| Rút Bao Lì Xì | Ngày Tết | Miễn phí | Chủ xị nhập ngân sách, chia ngẫu nhiên đúng tổng vào các bao 3D |

Dùng chung cho mọi game: danh sách người chơi nhập một lần, game yêu thích và chơi gần đây, tìm game không phân biệt dấu, bật/tắt âm thanh, giao diện sáng/tối, cài lên màn hình chính nhờ Web App Manifest.

## Giao diện

Trình bày theo kiểu cổng game:
- **Trang chủ:** banner trình chiếu game nổi bật, hàng "Chơi gần đây"/"Yêu thích", kho trò chơi lọc theo thể loại (đồng bộ với `?category=` trên URL), dải quảng bá VIP.
- **Thẻ game:** minh hoạ hoạt hình, nhãn MỚI/HOT/VIP, nút chơi hiện khi rê chuột, thông tin thể loại, số người, thời lượng.
- **Trang game:** đường dẫn, ảnh thu nhỏ, nút yêu thích, mục "Cách chơi" thu gọn được, cổng VIP.

Quy tắc hình ảnh:
- **Bảng màu giữ nguyên:** bề mặt sáng/tối và dải ramp 9 stop trong `globals.css`. Mọi thứ có màu lấy theo chỉ số trên dải (`src/shared/lib/ramp.ts`).
- **Kiểu chữ:** Baloo 2 cho tiêu đề, nút và số lớn (`font-display`); Nunito cho chữ thường. Cả hai đều có đủ bộ ký tự tiếng Việt. Không dùng font mono.
- **Bo góc mềm, bóng nhẹ:** thẻ, khối và ô nhập bo `rounded-xl` (14px), khối lớn như banner, hộp thoại `rounded-2xl`, nút nhỏ `rounded-lg`, nhãn và tab thể loại bo tròn. Bóng đổ dùng token `shadow-card`, rê chuột lên thẻ game thì nổi lên `shadow-lift`. Hover không đổi màu viền.
- **Không viền đen:** viền thường dùng `border-line`; khối cần nhấn (thẻ nổi bật, gói được chọn, ô đang chọn, mặt xúc xắc) dùng viền cam `border-edge` (token `--edge`).
- **Minh hoạ hoạt hình** (`src/features/catalog/illustrations`): SVG vẽ tay, màu lấy từ token nên tự đổi theo theme.
- **Sân khấu theo chủ đề** (`GameStage` trong `src/games/kit`): vùng chơi của mỗi game nằm trên một nền hợp với trò đó. Có các kiểu bàn nỉ xanh, quầy bar ánh đèn, nền đỏ vàng ngày Tết, hồ nước, sân khấu đèn rọi, vùng nguy hiểm sọc vàng đen, thành phố đêm, bảng phấn, tiệc neon và đêm trăng. Cảnh 3D để nền trong suốt nên nền hiện ra phía sau vật thể. Nền tối gắn `data-theme="dark"` để chữ bên trong tự sáng lên; vật thể cần giữ màu trắng như lá bài thì gắn `data-theme="light"`.
- **Responsive ba tầng:**
  - Điện thoại có tab bar dưới cùng (Trang chủ, Trò chơi, VIP, Âm thanh, Giao diện) và nút hành động chính dính ngay trên tab bar.
  - Tablet 768–1024px có bố cục hai cột.
  - Desktop có thanh thể loại trên header.
- Chuyển động dùng một đường cong `cubic-bezier(0.2, 0.8, 0.2, 1)` và tắt khi bật `prefers-reduced-motion`.

## Thu phí

Freemium với mức phí nhỏ, trả một lần, không tự gia hạn:
- Vé Đêm Tiệc 9.000đ / 24 giờ.
- Gói Tháng 29.000đ / 30 ngày.
- Trọn Đời 99.000đ.

Game VIP cho thử 3 lượt mỗi ngày.

Muốn mua gói thì phải đăng nhập, bằng email + mật khẩu hoặc Google qua Supabase Auth. Thanh toán bằng chuyển khoản VietQR:
1. Khách quét mã, chuyển khoản với nội dung là mã đơn.
2. SePay gửi webhook về `/api/webhooks/sepay`.
3. Máy chủ xác thực chữ ký, rồi gọi hàm `settle_payment` trong database để kích hoạt gói theo tài khoản.

Kiến trúc chi tiết, hướng dẫn cài đặt Supabase/SePay, biến môi trường và các lưu ý pháp lý: [docs/payments.md](docs/payments.md).

Chạy trên máy với đầy đủ tài khoản/thanh toán: chép `.env.example` thành `.env.local` và điền giá trị. Thiếu cấu hình thì app vẫn chạy các game miễn phí.

## Công nghệ

Next.js 14 (App Router) · React 18 · TypeScript (strict) · Tailwind CSS 3 · three.js + React Three Fiber 8 · Framer Motion · React Icons.

React Three Fiber dùng nhánh 8 vì nhánh 9 bắt buộc React 19.

## Cài đặt & chạy

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build production
npm start          # chạy bản build
npm run lint       # ESLint (next/core-web-vitals)
npm run typecheck  # kiểm tra kiểu TypeScript
```

## Cấu trúc thư mục

Mã nguồn chia theo nghiệp vụ. Ranh giới giữa các phần được ESLint kiểm tra tự động. Chi tiết các tầng, quy tắc import và cách thêm game/feature: [docs/architecture.md](docs/architecture.md).

```
src/
├── app/            Route: trang, API (đơn hàng, webhook SePay), xác thực; phần riêng của trang nằm cạnh route
├── layout/         Khung app: Header, Footer, tab bar, GameShell, logo
├── games/          15 game, mỗi game một thư mục độc lập + games/kit (bố cục, lá bài 3D, cảnh WebGL, bộ bài, cảm biến lắc); werewolf có thêm engine/ và server/
├── features/
│   ├── auth/       Đăng nhập, đăng ký, quên/đổi mật khẩu, phiên Supabase
│   ├── billing/    Bảng giá VIP, quyền VIP, lượt thử, thanh toán; billing/server cho phần chỉ chạy ở máy chủ
│   ├── catalog/    Danh mục game, minh hoạ, trang chủ, tìm game, yêu thích và chơi gần đây
│   ├── players/    Danh sách người chơi dùng chung
│   └── settings/   Âm thanh và giao diện sáng/tối
├── shared/         ui/, hooks/, lib/, supabase/: thư viện dùng chung, không biết gì về nghiệp vụ
├── data/           Nội dung JSON và index.ts gắn kiểu
└── middleware.ts   Làm mới phiên đăng nhập trên các route cần đọc phiên ở máy chủ
supabase/migrations/  Bảng đơn hàng, gói VIP, nhật ký thanh toán, hàm settle_payment và bảng phòng Ma Sói (đều bật RLS)
```

## Dữ liệu

| File | Nội dung |
| --- | --- |
| `truth.json`, `dare.json` | Thẻ Thật / Thách, mỗi thẻ có `level` 1 (nhẹ nhàng) đến 3 (cháy) |
| `punishments.json` | Hình phạt dùng cho vòng quay, đua vịt, nối từ |
| `dice-faces.json` | 6 mặt xí ngầu; `icon` là khoá ánh xạ sang icon trong `src/games/dice/face-style.ts`, `ramp` là chỉ số màu trên dải |
| `duck-names.json` | Tên vịt mặc định khi chưa đủ người chơi |
| `word-topics.json` | `chainSeeds`: từ khởi đầu (đúng 2 tiếng); `topics`: chủ đề cho chế độ kể tên |
| `lucky-money.json` | `funPrizes`: bao vui không có tiền (`extraTurn` cho rút thêm); `wishes`: câu chúc |
| `never-have-i.json` | Lá "Tôi chưa từng..." chia 3 mức độ |
| `spy-words.json` | Cặp từ của dân và từ gần giống cho gián điệp |
| `bomb-topics.json` | Chủ đề cho Bom Nổ Chậm |
| `themes.json` | Các dải màu cho vòng quay, mỗi dải là danh sách chỉ số stop trên ramp |

Thêm nội dung chỉ cần sửa JSON, không phải động vào code. Màu trong JSON luôn là chỉ số trên dải ramp chứ không phải mã màu hay class Tailwind, để mọi thứ vẫn nằm trên cùng một phổ màu và đổi đúng theo giao diện sáng/tối.

## Giải thích các logic khó

### Vòng quay chọn kết quả trước rồi mới quay

Thay vì quay ngẫu nhiên rồi đoán ô dừng, `useWheelGame` chọn ô thắng ngay khi bấm, sau đó `targetRotation` tính góc cần quay:

- Ô thứ `i` chiếm cung `[i·s, (i+1)·s)` với `s = 360 / số ô`, đo theo chiều kim đồng hồ từ hướng 3 giờ (quy ước của SVG).
- Kim nằm ở 12 giờ, tức góc 270°. Muốn điểm `θ` trên bánh xe nằm dưới kim thì góc xoay `R` phải thoả `(θ + R) mod 360 = 270`.
- `θ` được chọn ngẫu nhiên trong ô nhưng chừa 10% mỗi mép để kim không dừng sát vạch.
- Luôn cộng thêm 5 vòng và chỉ quay tiến, nên góc xoay tăng dần qua các lần quay.

Kết quả được công bố khi animation kết thúc, nên chữ trên modal luôn khớp với ô dưới kim.

### Xí ngầu luôn dừng đúng mặt

Mỗi mặt có một hướng đích (ví dụ mặt 2 là `rotateY(-90deg)`). Mỗi lần lắc, hook cộng thêm một số vòng nguyên (360°) vào từng trục, rồi CSS transition nội suy từ góc cũ tới `số vòng × 360 + hướng đích`. Vì bội số của 360° không đổi hướng, khối lập phương quay nhiều vòng nhưng dừng chính xác ở mặt đích, không cần animation hai pha hay giá trị ngẫu nhiên lúc render.

### Đua vịt

`race-engine.ts` là hàm thuần `advanceRace(state) → state` chạy mỗi 120 ms: mỗi vịt tiến một bước ngẫu nhiên đều (0,35–2), có 1,5% khả năng tăng tốc hoặc trượt chân. Khi nhiều vịt cán đích trong cùng một nhịp, vịt vượt vạch xa hơn được xếp trước. Cuộc đua kết thúc khi tất cả về đích để xác định người về chót. Với 8 vịt, một trận kéo dài khoảng 11–13 giây.

Vòng lặp gọi `tickRef.current()` thay vì giữ closure cũ, nên bật/tắt âm thanh giữa trận vẫn có hiệu lực ngay.

### Nối từ: reducer thuần và đồng hồ theo hạn chót

- Toàn bộ chuyển trạng thái (bắt đầu, nhận từ, loại người, tạm dừng) nằm trong `wordChainReducer`. Giá trị ngẫu nhiên (từ khởi đầu, hình phạt) được truyền vào qua action nên reducer luôn tất định.
- Khi một người bị loại, người kế tiếp dồn vào đúng vị trí đó: `turn = turn % số người còn lại`.
- Đồng hồ không đếm lùi từng tick mà tính `hạn chót − bây giờ`, nên không bị trôi khi tab chạy chậm. Tạm dừng lưu lại thời gian còn lại, tiếp tục thì đặt hạn chót mới. `turnId` tăng mỗi lượt để reset đồng hồ.
- Từ nhập vào được chuẩn hoá Unicode NFC (bàn phím macOS có thể gửi dạng NFD), bỏ dấu câu, gộp khoảng trắng và đưa về chữ thường trước khi so sánh.

### Rút lì xì theo ngân sách

`lucky-rules.ts` chia đúng tổng ngân sách thành các bao, theo bước 1.000đ:
- Mỗi bao tiền nhận trước 1 đơn vị.
- Phần dư được cắt ở `n − 1` điểm ngẫu nhiên rồi lấy độ dài các đoạn, giống cách bẻ một cây gậy.
- Tổng luôn đúng bằng ngân sách và mỗi bao ít nhất 1.000đ.
- Khoảng 20% số bao là bao vui không có tiền (có thể tắt).
- Ngân sách nhỏ hơn mức tối thiểu được nâng lên cho đủ.

Nội dung bao chỉ render sau khi mở, nên không ai xem mã trang để biết trước bao nào trúng.

### Nối từ: bác bỏ từ vô nghĩa

App không có từ điển nên không thể tự biết từ có nghĩa hay không. Thay vào đó, cả bàn làm trọng tài. Nút "Bác bỏ" (action `veto` của reducer):
- xoá từ vừa được chấp nhận và loại người đã nói từ đó;
- giữ nguyên lượt của người đang trả lời, nhưng giờ họ phải nối vào từ trước đó.

Từ khởi đầu không bác bỏ được.

### Ma Sói online

- **Máy chủ giữ bí mật:** toàn bộ ván (vai của từng người, phiếu sói, kết quả soi) nằm trong một cột `jsonb` của bảng `werewolf_rooms`. Bảng bật RLS và không có policy nào, nên chỉ Route Handler dùng service role mới đọc được. Mỗi người chỉ nhận bản nhìn riêng do `viewFor` dựng: vai của mình, đồng bọn nếu là sói, vai người đã chết nếu bật lộ vai.
- **Engine thuần:** `games/werewolf/engine` không phụ thuộc React hay Supabase. Mỗi hành động đi qua `applyAction`, còn việc hết giờ thì `tick` xử lý. Phòng tự chuyển pha khi có người hỏi sau hạn chót, nên không cần tiến trình chạy nền.
- **Ghi đồng thời:** mỗi lần ghi kèm điều kiện `version` cũ. Xung đột thì đọc lại và thử lại với độ trễ ngẫu nhiên, nên nhiều người bấm cùng lúc không ghi đè nhau.
- **Đêm không lộ thông tin:** bước đêm của vai đã chết (hoặc phù thủy hết bình) vẫn diễn ra với thời lượng ngẫu nhiên 5–9 giây. Người ngủ không nhận đồng hồ của bước đêm. Nhờ vậy không ai đoán được vai nào còn sống qua nhịp đêm.
- **Đồng bộ:** Supabase Realtime chỉ phát tín hiệu "có thay đổi" (không mang dữ liệu), trình duyệt tự tải lại bản nhìn của mình. Thêm vào đó trình duyệt hỏi lại mỗi 3 giây và đúng lúc hết pha. Màn hình được giữ sáng bằng Wake Lock để điện thoại úp xuống ban đêm không tự khoá.

Cài đặt và chi tiết luật: [docs/werewolf.md](docs/werewolf.md).

### Bộ bài không lặp

`games/kit/deck.ts` lọc lá theo mức độ được phép (bản miễn phí chọn "Tất cả" chỉ gồm mức 1–2) và rút hết mới xáo lại. Nếu lá đầu bộ mới trùng lá vừa rút, nó được đẩy xuống cuối bộ.

### Lượt thử và gói VIP

`PremiumContext` lấy gói VIP từ bảng `memberships` theo tài khoản đang đăng nhập (RLS chỉ cho đọc dòng của chính mình). Lượt thử vẫn lưu trên máy, theo từng game và từng ngày. Game VIP gọi `requestRound()` trước mỗi ván: còn lượt thì trừ, hết lượt thì mở hộp thoại nâng cấp.

### Thanh toán an toàn với webhook

- **Không tin trình duyệt:** số tiền của đơn do máy chủ đặt theo bảng giá. Trình duyệt chỉ chọn gói.
- **Xác thực webhook:** SePay ký từng webhook bằng HMAC-SHA256 trên chuỗi `timestamp.body`. Máy chủ tính lại chữ ký, so bằng `timingSafeEqual`, và từ chối timestamp lệch quá 5 phút để chống gửi lại.
- **Khử trùng lặp:** mã giao dịch SePay là khoá duy nhất trong `payment_events`. Webhook gửi lại nhiều lần cũng chỉ kích hoạt một lần.
- **Một giao dịch database:** ghi nhận, khoá dòng đơn, kiểm tra số tiền, gia hạn gói và đánh dấu đơn đã trả đều nằm trong hàm `settle_payment`, nên không có trạng thái nửa vời.

### localStorage và hydration

`useLocalStorage` khởi tạo bằng giá trị mặc định, chỉ đọc `localStorage` sau khi mount, và chỉ ghi lại sau khi đã đọc xong. Cách này tránh lệch HTML giữa server và client, đồng thời không ghi đè dữ liệu đã lưu bằng giá trị mặc định ở lần render đầu.

### Cảnh 3D

- **WebGL hay dự phòng:** `Stage3D` kiểm tra WebGL; nếu không có hoặc cảnh gặp lỗi (error boundary) thì hiển thị bản 2D của chính game đó (SVG vòng quay, xúc xắc CSS, đường đua 2D), nên trang không bao giờ trắng. Cảnh 3D được tải động (`next/dynamic`, `ssr: false`) để three.js chỉ tải ở trang cần.
- **Màu:** cảnh 3D đọc màu trực tiếp từ CSS custom properties (`useSceneColors`) và theo dõi thuộc tính `data-theme`, nên `globals.css` vẫn là nguồn màu duy nhất. Canvas bật `flat` (tắt tone mapping) để giữ đúng màu dải.
- **Chữ trên vật thể** được vẽ lên canvas 2D bằng chính font của trang (`usePageFont` chờ web font tải xong rồi vẽ lại), nên tiếng Việt có dấu hiển thị đúng. Tên trên đầu vịt là nhãn DOM bám theo vị trí chiếu của vịt, được ghi `transform` trực tiếp trong vòng lặp khung hình.
- **Vòng quay 3D** vẽ mặt bánh xe theo đúng hình học của bản SVG rồi dán lên mặt tròn, và quay theo `-rotation` (SVG quay theo chiều kim đồng hồ với trục y hướng xuống). Vì vậy logic chọn trước ô thắng vẫn dùng chung, kim vẫn dừng đúng ô. Mỗi khi `floor((góc − 270) / độ_rộng_ô)` đổi giá trị là có một chốt vừa đi qua kim: kim gảy và phát tiếng tách.
- **Xúc xắc 3D:** `restingEuler` tính quaternion đưa mặt kết quả lên trên, rồi xoay thêm quanh trục đứng sao cho mép trên của texture quay ra xa camera, để chữ trên mặt luôn đọc xuôi. Khi tung, góc Euler được nội suy từ hướng hiện tại tới hướng đích cộng thêm vài vòng 2π trên mỗi trục. Bội số của 2π không đổi hướng nên xúc xắc lộn nhiều vòng mà vẫn dừng đúng mặt. Bàn đổi sang gần vuông trên màn dọc để xúc xắc không bị nhỏ.
- **Camera đua vịt** tự căn khung mỗi khung hình. Màn ngang nhìn từ bên hông, khoảng cách đủ để chứa từ vịt cuối đến vịt đầu và toàn bộ các làn. Màn dọc chuyển sang góc đuổi phía sau để các làn trải theo chiều ngang. Vị trí vịt được nội suy mượt giữa các nhịp mô phỏng 120 ms. Mặt hồ dùng `flatShading` nên pháp tuyến được tính trong shader, không phải tính lại mỗi khung.
- **3D bằng CSS** (lá bài, ô chữ, bao lì xì) dùng `preserve-3d` và không đặt `overflow`, `opacity` hay `clip-path` trên phần tử cha đang dựng 3D, vì những thuộc tính đó làm phẳng cảnh. Nắp bao lì xì khi mở được đẩy ra sau tờ lì xì (giống bao thật: tờ tiền nằm trước nắp đã mở). Hộp thoại kết quả chờ 1.1 giây để người chơi kịp xem hiệu ứng mở bao.

### Giao diện tối không nháy

Theme được lưu trong `localStorage`. Một đoạn script nhỏ nội tuyến trong `<head>` đọc và gắn `data-theme` lên `<html>` trước khi trình duyệt vẽ, nên tải lại trang ở chế độ tối không bị chớp trắng. Lần đầu luôn là giao diện sáng, kể cả khi hệ điều hành đang để tối; lựa chọn của người dùng mới được ghi nhớ.

### Âm thanh và cảm biến

- `features/settings/sound.ts` dùng chung một `AudioContext` cho cả app, vì trình duyệt giới hạn số context được tạo.
- `useShake` so sánh độ thay đổi gia tốc giữa hai lần đọc liên tiếp (không dùng độ lớn tuyệt đối vốn luôn chứa trọng lực ~9,8 m/s²), có thời gian nghỉ 1,2 giây. Trên iOS 13+ cần người dùng bấm "Bật lắc điện thoại" để cấp quyền; trên máy tính tính năng này tự ẩn.

## Thêm một game mới

Xem mục "Thêm một game" trong [docs/architecture.md](docs/architecture.md). Trang chủ, thể loại, menu, footer và ô tìm kiếm tự cập nhật theo danh mục.

## Quy ước code

Xem [skills.md](skills.md). Tóm tắt: mỗi file có một dòng comment tiếng Việt ở đầu nêu mục đích, không comment rải rác trong code; logic khó được giải thích ở README này.

---

🍺 Đã uống rượu bia, không lái xe.
