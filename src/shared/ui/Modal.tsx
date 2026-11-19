// Hộp thoại nổi viền hairline có vạch dải màu, hiệu ứng vào/ra, đóng bằng Esc hoặc bấm ra ngoài
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';
import { FaXmark } from 'react-icons/fa6';

const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

interface ModalProps {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, label, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/45 p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="relative max-h-[90dvh] w-full max-w-sm overflow-y-auto border border-line bg-canvas text-center rounded-2xl"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="rule-ramp h-1 w-full" />
            <button
              type="button"
              aria-label="Đóng"
              onClick={onClose}
              className="absolute right-3 top-4 p-2 text-muted transition-colors hover:bg-elevated hover:text-ink"
            >
              <FaXmark className="h-4 w-4" />
            </button>
            <div className="p-7">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
