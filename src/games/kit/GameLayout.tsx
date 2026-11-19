// Bố cục trang game: vùng chơi chính và cột bên; điện thoại và iPad dọc dùng một cột để bàn chơi rộng hết màn hình (iPad dọc xếp các bảng bên thành hai cột phía dưới), từ 1024px trở lên mới chia hai cột
import type { ReactNode } from 'react';

export default function GameLayout({ main, aside }: { main: ReactNode; aside: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 space-y-6">{main}</div>
      <aside className="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-start lg:flex lg:flex-col">{aside}</aside>
    </div>
  );
}
