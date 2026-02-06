import Link from 'next/link';
import { FaGlobe, FaEnvelope } from 'react-icons/fa6';
import { FaGamepad } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-black bg-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-orange-400 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <FaGamepad className="h-5 w-5" />
              </div>
              <span className="text-xl font-black text-black uppercase tracking-tight">VuiChoi</span>
            </div>
            <p className="text-sm font-bold text-gray-600">N?n t?ng mini-game gi?i tr� s? 1.</p>
          </div>

          <div className="flex gap-4 text-black">
            <div className="cursor-pointer rounded-lg border-2 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
              <FaGlobe className="h-5 w-5" />
            </div>
            <div className="cursor-pointer rounded-lg border-2 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
              <FaEnvelope className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm font-bold text-gray-500">
          � 2026 VuiChoi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

