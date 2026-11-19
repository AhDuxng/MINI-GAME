// Khối nội dung có thanh tiêu đề vạch màu, dùng cho cấu hình, lịch sử, bảng xếp hạng
import type { ReactNode } from 'react';
import { rampFill } from '../lib/ramp';
import { cn } from '../lib/utils';

interface PanelProps {
  title: string;
  stop?: number;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export default function Panel({ title, stop = 2, action, className, children }: PanelProps) {
  return (
    <section className={cn('surface', className)}>
      <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-ink">
          <span className="h-5 w-1.5 flex-shrink-0 rounded-full" style={{ background: rampFill(stop) }} />
          {title}
        </h2>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}
