// Nút bấm dùng chung; buttonStyles cho phép Link mang cùng giao diện với button
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'fill-ramp',
  secondary: 'border border-line bg-canvas text-ink hover:bg-elevated rounded-xl',
  ghost: 'text-muted hover:bg-elevated hover:text-ink',
  danger: 'border border-line bg-canvas text-ink hover:bg-elevated hover:text-ramp-text-3 rounded-xl',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-10 rounded-lg px-3 text-xs sm:h-8',
  md: 'h-11 rounded-xl px-4 text-sm sm:h-10',
  lg: 'h-12 rounded-xl px-6 text-base',
};

interface StyleOptions {
  variant?: Variant;
  size?: Size;
  className?: string;
}

export function buttonStyles({ variant = 'primary', size = 'md', className }: StyleOptions = {}) {
  return cn(
    'inline-flex select-none items-center justify-center gap-2 font-display font-bold tracking-wide transition-[background-color,background-position,border-color,color,transform] duration-300 ease-house active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleOptions;

export default function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}
