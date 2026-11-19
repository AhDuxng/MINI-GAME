// Màn báo lỗi cuối cùng khi chính khung ứng dụng gặp sự cố: tự dựng trang tối giản (không phụ thuộc layout gốc) và cho tải lại
'use client';

import './globals.css';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="vi">
      <body className="flex min-h-screen items-center justify-center bg-canvas p-6 text-ink">
        <main className="flex max-w-sm flex-col items-center gap-4 text-center">
          <p className="text-ramp font-display text-6xl font-extrabold">Ối!</p>
          <h1 className="text-2xl font-bold">VuiChơi đang gặp sự cố</h1>
          <p className="text-muted">Bạn tải lại trang giúp mình nhé. Danh sách người chơi và cài đặt vẫn được giữ trên máy.</p>
          <button type="button" onClick={reset} className="fill-ramp h-12 rounded-xl px-6 font-bold">
            Tải lại
          </button>
        </main>
      </body>
    </html>
  );
}
