// Ô nhập có nhãn dùng trong các form tài khoản
import type { InputHTMLAttributes } from 'react';

export default function FormField({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-bold text-ink">{label}</span>
      <input className="field h-12 text-base" {...props} />
    </label>
  );
}
