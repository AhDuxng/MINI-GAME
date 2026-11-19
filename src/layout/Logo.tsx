// Logo thương hiệu: khối vuông isometric nhiều màu kèm tên tô dải màu
import Link from 'next/link';
import CubeMark from './CubeMark';
import { SITE } from '@/features/catalog';

export default function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label={`${SITE.name} — trang chủ`}>
      <CubeMark className="h-8 w-8 transition-transform duration-500 ease-house group-hover:rotate-[60deg]" />
      <span className="text-ramp font-display text-2xl font-extrabold leading-none">{SITE.name}</span>
    </Link>
  );
}
