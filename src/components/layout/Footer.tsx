import { FaGlobe, FaEnvelope, FaGamepad } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="mt-auto glass border-t border-orange-200/50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-button shadow-glow">
              <FaGamepad className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-orange-600">VuiChơi</p>
              <p className="text-xs text-gray-500">Nền tảng mini game giải trí số 1</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-3">
            <div className="glass-sm p-3 rounded-xl cursor-pointer hover:bg-orange-50 transition-all hover:scale-110">
              <FaGlobe className="h-5 w-5 text-orange-500 hover:text-orange-600" />
            </div>
            <div className="glass-sm p-3 rounded-xl cursor-pointer hover:bg-orange-50 transition-all hover:scale-110">
              <FaEnvelope className="h-5 w-5 text-orange-500 hover:text-orange-600" />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          © 2026 VuiChơi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
