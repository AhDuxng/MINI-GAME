// Tab bar dưới cùng cho điện thoại, nằm trong tầm ngón cái: trang chủ, chọn game, VIP, âm thanh, tài khoản
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { FaCrown, FaGamepad, FaHouse, FaUser, FaVolumeHigh, FaVolumeXmark } from 'react-icons/fa6';
import { useAuth } from '@/features/auth';
import { useSound } from '@/features/settings';
import { cn } from '@/shared/lib/utils';

const GameMenu = dynamic(() => import('@/features/catalog').then((module) => module.GameMenu), {
  loading: () => <div className="h-64 animate-pulse rounded-xl bg-elevated" />,
});

const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

function TabItem({ active, children }: { active?: boolean; children: ReactNode }) {
  return (
    <span className={cn('relative flex h-full flex-col items-center justify-center gap-1', active ? 'text-ink' : 'text-muted')}>
      {active && <span className="rule-ramp absolute inset-x-3 top-0 h-1" />}
      {children}
    </span>
  );
}

const LABEL = 'text-[11px] font-bold';

export default function BottomNav() {
  const pathname = usePathname();
  const { soundEnabled, toggleSound } = useSound();
  const { user } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);
  const onGamePage = pathname.startsWith('/game/');

  useEffect(() => {
    setSheetOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!sheetOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSheetOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sheetOpen]);

  return (
    <>
      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-ink/40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSheetOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Chọn trò chơi"
              className="absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-y-auto border-t border-line bg-canvas px-5 pb-[calc(var(--tabbar-height)+env(safe-area-inset-bottom)+16px)] pt-3"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.4, ease: EASE }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto mb-4 h-1 w-10 bg-line" />
              <p className="mb-4 font-display text-xl font-bold text-ink">Chọn trò chơi</p>
              <GameMenu onNavigate={() => setSheetOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        aria-label="Tab điều hướng"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-canvas pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <div className="grid h-tabbar grid-cols-5">
          <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>
            <TabItem active={pathname === '/' && !sheetOpen}>
              <FaHouse className="h-5 w-5" />
              <span className={LABEL}>Trang chủ</span>
            </TabItem>
          </Link>
          <button type="button" onClick={() => setSheetOpen((open) => !open)} aria-expanded={sheetOpen}>
            <TabItem active={sheetOpen || onGamePage}>
              <FaGamepad className="h-5 w-5" />
              <span className={LABEL}>Trò chơi</span>
            </TabItem>
          </button>
          <Link href="/vip" aria-current={pathname.startsWith('/vip') ? 'page' : undefined}>
            <TabItem active={pathname.startsWith('/vip')}>
              <FaCrown className="h-5 w-5 text-ramp-text-1" />
              <span className={LABEL}>VIP</span>
            </TabItem>
          </Link>
          <button type="button" onClick={toggleSound} aria-pressed={soundEnabled}>
            <TabItem>
              {soundEnabled ? <FaVolumeHigh className="h-5 w-5" /> : <FaVolumeXmark className="h-5 w-5" />}
              <span className={LABEL}>{soundEnabled ? 'Âm thanh' : 'Đã tắt'}</span>
            </TabItem>
          </button>
          <Link href={user ? '/account' : '/login'} aria-current={pathname === '/account' || pathname === '/login' ? 'page' : undefined}>
            <TabItem active={pathname === '/account' || pathname === '/login' || pathname === '/signup'}>
              <FaUser className="h-5 w-5" />
              <span className={LABEL}>{user ? 'Tài khoản' : 'Đăng nhập'}</span>
            </TabItem>
          </Link>
        </div>
      </nav>
    </>
  );
}
