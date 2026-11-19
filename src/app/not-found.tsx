// Trang 404 khi đường dẫn không tồn tại
import Link from 'next/link';
import { buttonStyles } from '@/shared/ui/Button';

export default function NotFound() {
  return (
    <div className="page flex flex-col items-start gap-5 py-24">
      <p className="text-ramp font-display text-8xl font-extrabold leading-none">404</p>
      <h1 className="font-display text-3xl font-bold text-ink">Không tìm thấy trang</h1>
      <p className="max-w-md text-muted">Trò chơi này không tồn tại hoặc đã bị dời đi chỗ khác.</p>
      <Link href="/" className={buttonStyles({ size: 'lg' })}>
        Về trang chủ
      </Link>
    </div>
  );
}
