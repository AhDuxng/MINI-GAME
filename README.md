#  Party Nhậu

Bộ sưu tập mini game offline-first cho tiệc tùng, được xây dựng với **Next.js 14 (App Router)**.

##  Cấu Trúc Thư Mục

```
party-nhau/
 public/
    assets/
       images/          # Hình ảnh tĩnh
       sounds/          # File âm thanh
    manifest.json        # PWA manifest
 src/
    app/
       (home)/          # Route Group cho trang chủ
          page.jsx
       game/
          [id]/        # Dynamic Route cho các game
              page.jsx
       api/             # API routes (placeholder)
       globals.css      # Tailwind imports
       layout.jsx       # Root Layout
    components/
       ui/              # Button, Card, Input, Modal
       layout/          # Header, Footer, Container
       features/        # Logic game (Dice, Wheel, Truth...)
    context/
       GameContext.jsx  # Quản lý state người chơi
    data/                #  FILE JSON - Dữ liệu offline
       truth.json
       dare.json
       punishments.json
       dice-faces.json
       duck-names.json
       word-topics.json
       lucky-money.json
       themes.json
    hooks/               # Custom hooks (useSound, useVibration)
    lib/                 # Utility functions (cn helper)
    services/            # Game services (đọc JSON)
 .env.local
 .gitignore
 next.config.mjs
 package.json
 postcss.config.js
 tailwind.config.js
 jsconfig.json
 README.md
```

##  Giải Thích Thư Mục

- **`src/app/`**: Route structure của Next.js 14 App Router
- **`src/components/`**: Các component UI và logic game
- **`src/context/`**: React Context để quản lý state toàn cục
- **`src/data/`**:  **QUAN TRỌNG** - Chứa tất cả dữ liệu JSON offline (câu hỏi, thử thách, hình phạt...)
- **`src/hooks/`**: Custom hooks cho âm thanh, rung, animation
- **`src/lib/`**: Utility functions (cn helper cho Tailwind)
- **`src/services/`**: Logic đọc và xử lý dữ liệu từ file JSON

##  Thiết Kế

- **Dark Mode**: Tone màu tối (#121212)
- **Màu chính**: Cam (#FF6B00)
- **Font chữ**: Inter / Roboto

##  Cài Đặt & Chạy

```bash
# Cài dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Chạy production server
npm start
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

##  Tính Năng

-  Offline-first (không cần database)
-  Dark Mode với tone màu Cam/Trắng
-  Responsive design
-  PWA ready (manifest.json)

---

**Created with  by Senior Next.js Developer**
