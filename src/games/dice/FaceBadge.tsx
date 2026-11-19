// Ô icon nền nhạt theo màu ramp của mặt xí ngầu, dùng chung cho bảng ý nghĩa và lịch sử
import type { DiceFace } from '@/data';
import { cn } from '@/shared/lib/utils';
import { faceStyle } from './face-style';

export default function FaceBadge({ face, className }: { face: DiceFace; className?: string }) {
  const { Icon, color, wash } = faceStyle(face);
  return (
    <span
      className={cn('flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg', className)}
      style={{ background: wash, color }}
    >
      <Icon className="h-4 w-4" />
    </span>
  );
}
