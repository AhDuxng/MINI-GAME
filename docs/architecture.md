# Kiến trúc mã nguồn

Mã nguồn chia theo **nghiệp vụ** (feature) thay vì theo loại file. Mỗi phần có một ranh giới rõ ràng, và ESLint (`.eslintrc.json`) chặn mọi import vượt ranh giới ngay khi chạy `npm run lint`.

## Các tầng

Tầng trên được import tầng dưới, không bao giờ ngược lại.

```
app/        Route của Next.js: chỉ ghép trang; phần riêng của một trang nằm cạnh route (ví dụ app/account/AccountView.tsx)
  │
layout/     Khung app ghép nhiều feature: Header, Footer, tab bar, GameShell (khung trang game), logo
  │
games/      Mỗi game một module độc lập: games/<slug>/ + bộ dùng chung games/kit/
  │
features/   Tính năng nền tảng, mỗi feature có một cửa public index.ts
  │
shared/     Thư viện dùng chung không biết gì về nghiệp vụ: ui/, hooks/, lib/, supabase/
data/       Nội dung JSON (câu hỏi, hình phạt, chủ đề...) và index.ts gắn kiểu
```

## Các feature

| Feature | Trách nhiệm | Được phụ thuộc |
| --- | --- | --- |
| `auth` | Phiên đăng nhập Supabase, form đăng nhập/đăng ký/quên/đổi mật khẩu, nút tài khoản | `shared` |
| `billing` | Bảng giá VIP, quyền VIP, lượt thử và 10 phút thử VIP, ưu đãi nâng cấp, hộp thoại nâng cấp, luồng thanh toán; `billing/server` chứa phần chỉ chạy ở máy chủ (SePay, kiểm tra webhook) | `auth`, `catalog`, `players`, `shared`, `data` |
| `catalog` | Danh mục game (`games.ts`), minh hoạ hoạt hình, các khối trang chủ, tìm game, yêu thích/chơi gần đây | `shared` |
| `players` | Danh sách người chơi dùng chung và khối chỉnh sửa | `shared` |
| `settings` | Âm thanh và giao diện sáng/tối | `shared` |

`auth`, `catalog`, `players`, `settings` là **feature lá**: không phụ thuộc feature nào khác. Chỉ `billing` được dùng `auth`, `catalog` và `players` (để tính giá chia theo số người đang chơi), nên giữa các feature không có vòng phụ thuộc.

## Quy tắc import

1. **Ngoài một feature chỉ import qua cửa public:** `@/features/billing`, không được viết `@/features/billing/components/Checkout`. Cửa public liệt kê đúng những gì bên ngoài được dùng. Muốn mở thêm thì sửa `index.ts`, và đó là lúc cân nhắc có nên mở không.
2. **Bên trong cùng một feature hay một game dùng đường dẫn tương đối** (`./`, `../`).
3. **Phần `server` chỉ dùng trong Route Handler** (`app/api/**/route.ts`): `@/features/billing/server` và `@/games/werewolf/server` chứa khoá bí mật, quyền service role và `node:crypto`, không bao giờ được lọt xuống trình duyệt. Trang và component (`.tsx`) import phần này sẽ bị ESLint chặn.
4. **Game không import game khác.** Thứ gì nhiều game cần thì đưa vào `@/games/kit`; route chỉ import `@/games/<slug>` (và `@/games/<slug>/server` nếu là Route Handler).
5. **Phần 3D của kit có cửa riêng `@/games/kit/three`** (khung `SceneCanvas`, texture canvas, màu cảnh, font cho texture). Chỉ cảnh WebGL được tải động (`next/dynamic`) mới import từ đây, để trang game không có 3D không phải tải three.js và React Three Fiber. Cảnh 3D mới luôn dựng trong `SceneCanvas`: nó tự hạ độ phân giải khi máy không giữ nổi 50 khung/giây và ngừng vẽ khi cảnh trôi khỏi màn hình.
6. **`shared` không import gì phía trên.** Nếu một tiện ích cần biết về nghiệp vụ thì nó thuộc về feature, không thuộc `shared`.

Vi phạm bất kỳ quy tắc nào, `npm run lint` sẽ báo lỗi kèm lời giải thích.

## Thêm một game

1. Thêm thông tin game vào `GAMES` trong `src/features/catalog/games.ts` và một minh hoạ trong `src/features/catalog/illustrations/` (gắn vào `ARTS` của `GameIllustration`; bảng này bắt buộc đủ mọi game nên quên vẽ minh hoạ sẽ báo lỗi lúc biên dịch).
2. Tạo `src/games/<slug>/`:
   - component gốc `XGame.tsx` (`'use client'`) dựng trên `GameLayout` của `@/games/kit`;
   - hook điều khiển và logic thuần nếu có. Dùng lại khối có sẵn trong kit trước khi tự viết: `useLeveledDeck` (bộ bài theo mức độ, khoá mức Cháy), `useTally` + `RankingPanel` (đếm và xếp hạng theo người), `PlayerToggleList` (chạm tên để đánh dấu), `useCountdown` (đếm 3-2-1), `useFullscreenLock` (màn chơi toàn màn hình), `SceneCanvas` (cảnh 3D, truyền `active` và `idleFps`);
   - `index.ts` export component gốc.
3. Tạo route `src/app/game/<slug>/page.tsx` bọc `GameShell` từ `@/layout/GameShell`.
4. Game VIP gọi `requestRound()` của `useVipAccess` (từ `@/features/billing`) trước mỗi ván. Nội dung VIP trong game miễn phí (mức Cháy, bộ từ, nhóm đông) gọi `requireVip(lý do)` để mở hộp thoại mua; game bài có mức Cháy gắn thêm `LockedTeaser` của kit. Danh sách nội dung khoá ghi ở docs/payments.md.
5. Game chơi online (như Ma Sói) tách thêm `engine/` thuần (luật, bản nhìn từng người) và `server/` (lưu trữ, có `index.ts` riêng), API nằm ở `src/app/api/<slug>/`.

## Thêm một feature

1. Tạo `src/features/<tên>/` với `index.ts` ở gốc, chỉ export những gì nơi khác cần.
2. Nếu là feature lá, thêm đường dẫn vào nhóm feature lá trong `.eslintrc.json`.
3. Nếu có phần chỉ chạy ở máy chủ, tách vào `src/features/<tên>/server/` có `index.ts` riêng. Luật ESLint đã cho phép mọi `@/features/*/server` trong Route Handler, không cần sửa thêm.

## Hiệu năng

- **Barrel không kéo theo thứ không dùng:** `package.json` khai báo `"sideEffects": ["**/*.css"]` để webpack bỏ các module không được dùng trong `index.ts`. Vì vậy module của dự án không được có tác dụng phụ lúc import (ghi biến toàn cục, đăng ký sự kiện ở cấp module).
- **Phần nặng tải khi cần:** cảnh 3D, menu game ở thanh dưới, nội dung hộp thoại mua và danh sách quyền lợi VIP đều dùng `next/dynamic`. Thư viện Supabase chỉ được tải trong context khi máy chủ đã cấu hình.
- **Cảnh 3D chỉ vẽ khi cần:** `SceneCanvas` vẽ đủ khung khi `active`, lúc nghỉ vẽ thưa theo `idleFps` (0 là đứng yên), tự hạ độ phân giải khi dưới 50 khung/giây và ngừng vẽ khi trôi khỏi màn hình.
- **Không làm mờ nền đè lên nội dung chuyển động:** tránh `backdrop-blur` trên thanh cố định, hộp thoại và lớp phủ trên điện thoại.
- `tsconfig.json` bật `noUnusedLocals`: import hay biến thừa là lỗi biên dịch.

## Bảo mật và chịu tải

- **Route Handler:**
  - đọc thân yêu cầu qua `readJsonBody`/`readTextBody` (`src/shared/lib/request-body.ts`), luôn có giới hạn kích thước;
  - chặn gọi quá dày bằng `allowRequest` (`src/shared/lib/rate-limit.ts`), khoá theo người dùng và IP. Bộ đếm này nằm trong bộ nhớ của từng tiến trình; chạy nhiều máy chủ thì thay bằng bộ đếm dùng chung (Upstash, WAF) mà giữ nguyên giao diện hàm.
- **Đường dẫn quay về** (`?next=`, `?from=`) luôn đi qua `safeInternalPath` (`src/shared/lib/safe-path.ts`) để không bị chuyển hướng ra trang ngoài.
- **Code chỉ chạy ở máy chủ** (`shared/supabase/admin.ts`, `features/billing/server/*`, `games/werewolf/server/room-store.ts`) có `import 'server-only'`: lỡ import từ trình duyệt thì bản build báo lỗi.
- **Client quản trị:** client service role được tạo một lần cho mỗi tiến trình.
- **Middleware** chỉ chạy ở `/auth` và `/account`; API tự đọc và làm mới phiên để không gọi máy chủ xác thực hai lần mỗi yêu cầu.
- **Header bảo mật** (CSP, HSTS, chặn nhúng khung, Referrer-Policy, Permissions-Policy) khai báo trong `next.config.mjs`. Thêm dịch vụ ngoài (ảnh, API) thì phải thêm tên miền vào CSP ở đó.
- **Dọn dữ liệu cũ** chạy bằng `pg_cron` trong database (migration `20261119072908_housekeeping.sql`), không chạy trong yêu cầu của người dùng.
