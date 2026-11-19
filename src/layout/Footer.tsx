// Chân trang: thương hiệu, liên kết thể loại và trò chơi, gói VIP và lời nhắc chơi có trách nhiệm
import Link from 'next/link';
import { CATEGORIES, GAMES, SITE, gameHref } from '@/features/catalog';
import Logo from './Logo';

const HEADING = 'mb-3 font-display text-base font-bold text-ink';
const LINK = 'inline-flex min-h-10 items-center text-sm font-semibold text-muted transition-colors hover:text-ink [@media(pointer:fine)]:min-h-0';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-elevated">
      <div className="rule-ramp h-1 w-full" />
      <div className="page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.6fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted">{SITE.description}.</p>
        </div>
        <nav aria-label="Thể loại">
          <p className={HEADING}>Thể loại</p>
          <ul className="[@media(pointer:fine)]:space-y-2">
            {CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link href={`/?category=${category.slug}#games`} className={LINK}>
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Trò chơi">
          <p className={HEADING}>Trò chơi</p>
          <ul className="grid grid-cols-2 gap-x-6 [@media(pointer:fine)]:gap-y-2">
            {GAMES.map((game) => (
              <li key={game.slug}>
                <Link href={gameHref(game.slug)} className={LINK}>
                  {game.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className={HEADING}>Thành viên</p>
          <ul className="[@media(pointer:fine)]:space-y-2">
            <li>
              <Link href="/vip" className={LINK}>
                Gói VIP
              </Link>
            </li>
            <li>
              <Link href="/vip#faq" className={LINK}>
                Câu hỏi thường gặp
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="page flex flex-wrap justify-between gap-2 py-5 text-xs font-semibold text-muted">
          <span>
            © {new Date().getFullYear()} {SITE.name}
          </span>
          <span>Chơi có trách nhiệm · Đã uống rượu bia, không lái xe · Nội dung có rượu bia dành cho người từ 18 tuổi</span>
        </p>
      </div>
    </footer>
  );
}
