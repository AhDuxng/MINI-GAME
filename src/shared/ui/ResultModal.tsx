// Hộp thoại công bố kết quả dùng chung cho mọi game: tiêu đề, kết quả tô dải màu, chi tiết và các hành động
'use client';

import type { ReactNode } from 'react';
import Button from './Button';
import Modal from './Modal';

interface ResultAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface ResultModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  result: ReactNode;
  detail?: ReactNode;
  actions?: ResultAction[];
}

export default function ResultModal({ open, onClose, title, subtitle, result, detail, actions }: ResultModalProps) {
  const buttons = actions ?? [{ label: 'Tiếp tục chơi', onClick: onClose }];

  return (
    <Modal open={open} onClose={onClose} label={title}>
      <p className="font-display text-2xl font-bold text-ink">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      <p className="text-ramp mt-4 break-words font-display text-title font-extrabold">{result}</p>
      {detail && <div className="mt-5 border-t border-line pt-5 text-sm text-ink">{detail}</div>}
      <div className="mt-7 flex flex-col gap-2">
        {buttons.map(({ label, onClick, variant = 'primary' }) => (
          <Button key={label} variant={variant} size="lg" className="w-full" onClick={onClick}>
            {label}
          </Button>
        ))}
      </div>
    </Modal>
  );
}
