import Link from 'next/link';
import { Mail, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-100 bg-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gamepad-2"><line x1="6" x2="10" y1="12" y2="12" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="15" x2="15.01" y1="13" y2="13" /><line x1="18" x2="18.01" y1="11" y2="11" /><rect width="20" height="12" x="2" y="6" rx="2" /></svg>
              </div>
              <span className="text-lg font-bold text-gray-900">VuiChơi</span>
            </div>
            <p className="text-xs text-gray-500">Nền tảng mini-game giải trí.</p>
          </div>

          <div className="flex gap-4 text-gray-400">
            <Globe className="h-5 w-5 hover:text-gray-600 cursor-pointer" />
            <Mail className="h-5 w-5 hover:text-gray-600 cursor-pointer" />
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-400">
          © 2026 VuiChoi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
