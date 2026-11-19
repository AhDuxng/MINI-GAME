// Thanh hành động chính của game: trên điện thoại dính ngay trên tab bar trong tầm ngón cái, từ tablet trở lên nằm trong luồng nội dung
import type { ReactNode } from 'react';

export default function ActionBar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-[calc(var(--tabbar-height)+env(safe-area-inset-bottom))] z-30 border-t border-line bg-canvas px-4 py-3 md:static md:z-auto md:border-0 md:bg-transparent md:p-0">
      <div className="flex gap-2 [&>*]:min-w-0 [&>*]:flex-1">{children}</div>
    </div>
  );
}
