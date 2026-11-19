// Tiêu đề mục kiểu cổng game: vạch màu theo dải, tên mục và phần phụ bên phải tuỳ chọn
import type { ReactNode } from 'react';
import { rampFill } from '../lib/ramp';
import { cn } from '../lib/utils';

interface SectionTitleProps {
  title: string;
  stop?: number;
  action?: ReactNode;
  className?: string;
}

export default function SectionTitle({ title, stop = 2, action, className }: SectionTitleProps) {
  return (
    <div className={cn('mb-5 flex items-end justify-between gap-4', className)}>
      <h2 className="flex items-center gap-3 font-display text-2xl font-bold leading-none text-ink md:text-3xl">
        <span className="h-7 w-2 flex-shrink-0" style={{ background: rampFill(stop) }} />
        {title}
      </h2>
      {action}
    </div>
  );
}
