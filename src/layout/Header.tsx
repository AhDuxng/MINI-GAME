// Thanh điều hướng trên cùng: logo, liên kết thể loại, ô tìm game, nút VIP, âm thanh/giao diện và tài khoản (điện thoại dùng tab bar dưới)
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { FaMoon, FaSun, FaVolumeHigh, FaVolumeXmark } from 'react-icons/fa6';
import { AccountMenu } from '@/features/auth';
import { VipButton } from '@/features/billing';
import { useSound, useTheme } from '@/features/settings';
import { CATEGORIES, GameSearch } from '@/features/catalog';
import { rampFill } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';
import Logo from './Logo';

const ICON_BUTTON = 'flex h-9 w-9 items-center justify-center border border-line text-muted transition-colors duration-200 hover:bg-elevated hover:text-ink rounded-lg';

function CategoryLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === '/' ? searchParams.get('category') : null;

  return (
    <nav aria-label="Thể loại" className="hidden items-center gap-1 lg:flex">
      {CATEGORIES.map((category) => (
        <Link
          key={category.slug}
          href={`/?category=${category.slug}#games`}
          className={cn(
            'relative whitespace-nowrap px-2 py-2 font-display text-[15px] font-bold transition-colors hover:text-ink',
            active === category.slug ? 'text-ink' : 'text-muted',
          )}
        >
          {category.label}
          <span
            className={cn('absolute inset-x-2 -bottom-px h-1 transition-opacity', active === category.slug ? 'opacity-100' : 'opacity-0')}
            style={{ background: rampFill(category.stop) }}
          />
        </Link>
      ))}
    </nav>
  );
}

export default function Header() {
  const { soundEnabled, toggleSound } = useSound();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 h-header border-b border-line bg-canvas md:bg-canvas/90 md:backdrop-blur-md">
      <div className="page flex h-full items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Logo />
          <Suspense>
            <CategoryLinks />
          </Suspense>
        </div>

        <div className="flex items-center gap-2">
          <GameSearch className="hidden w-52 md:block lg:hidden xl:block xl:w-44" />
          <VipButton className="hidden md:flex" />
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            aria-pressed={soundEnabled}
            className={cn(ICON_BUTTON, 'hidden md:flex')}
          >
            {soundEnabled ? <FaVolumeHigh className="h-4 w-4" /> : <FaVolumeXmark className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Chuyển giao diện sáng' : 'Chuyển giao diện tối'}
            className={cn(ICON_BUTTON, 'hidden md:flex')}
          >
            {theme === 'dark' ? <FaSun className="h-4 w-4" /> : <FaMoon className="h-4 w-4" />}
          </button>
          <VipButton className="md:hidden" />
          <AccountMenu compact className="md:hidden" />
          <AccountMenu className="hidden md:flex" />
        </div>
      </div>
    </header>
  );
}
