// Layout gốc: font tiêu đề/nội dung, metadata, áp theme đã lưu trước khi vẽ, provider trạng thái và khung điều hướng
import type { Metadata, Viewport } from 'next';
import { Baloo_2, Nunito } from 'next/font/google';
import type { ReactNode } from 'react';
import BottomNav from '@/layout/BottomNav';
import Footer from '@/layout/Footer';
import Header from '@/layout/Header';
import { PaywallModal, PremiumProvider, VipStatusBar } from '@/features/billing';
import { PlayersProvider } from '@/features/players';
import { SettingsProvider } from '@/features/settings';
import { AuthProvider } from '@/features/auth';
import { SITE } from '@/features/catalog';
import './globals.css';

const sans = Nunito({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-sans',
});

const display = Baloo_2({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-display',
});

const THEME_BOOT_SCRIPT = `try{var t=JSON.parse(localStorage.getItem('vuichoi:theme'));if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}`;

export const metadata: Metadata = {
  title: { default: `${SITE.name} · ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" data-theme="light" className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body>
        <SettingsProvider>
          <PlayersProvider>
            <AuthProvider>
              <PremiumProvider>
                <div className="flex min-h-screen flex-col pb-[calc(var(--tabbar-height)+env(safe-area-inset-bottom))] md:pb-0">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <BottomNav />
                <VipStatusBar />
                <PaywallModal />
              </PremiumProvider>
            </AuthProvider>
          </PlayersProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
