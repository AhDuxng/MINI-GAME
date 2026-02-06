'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BiSearch, BiMenu, BiX } from 'react-icons/bi';
import { FaGamepad } from 'react-icons/fa6';

const NAV_LINKS = [
  { name: 'Games Bàn Nhậu', href: '/game/dice' },
  { name: 'Vòng Quay', href: '/game/wheel' },
  { name: 'Trang chủ', href: '/' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-orange-200/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-button shadow-glow transition-all group-hover:scale-110 group-hover:shadow-glow-orange">
              <FaGamepad className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-orange-600">VuiChơi</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="hidden md:block relative">
            <BiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="input-glass pl-10 pr-4 py-2 w-64 text-sm rounded-lg"
              placeholder="Tìm game..."
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="glass-sm p-2 rounded-lg lg:hidden hover:bg-orange-100 transition-colors"
          >
            {isMenuOpen ? <BiX className="h-6 w-6 text-orange-600" /> : <BiMenu className="h-6 w-6 text-orange-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="glass border-t border-orange-200/50 lg:hidden">
          <nav className="flex flex-col p-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-3 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
