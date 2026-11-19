// Kiểm soát quyền chơi: game VIP gọi requestRound trước mỗi ván (chưa tải xong gói thì chưa cho chơi để không trừ oan lượt thử, sau đó trừ lượt thử hoặc mở hộp thoại nâng cấp), game thường dùng requireVip cho nội dung nâng cao
import { useCallback } from 'react';
import { usePremium } from './PremiumContext';
import { getGame, type GameSlug } from '@/features/catalog';
import { FREE_LIMITS } from './plans';

export default function useVipAccess(slug: GameSlug) {
  const { isVip, ready, trialsLeft, consumeTrial, openPaywall } = usePremium();
  const game = getGame(slug);
  const locked = game.vip && !isVip;

  const requestRound = useCallback(() => {
    if (!locked) return true;
    if (!ready) return false;
    if (consumeTrial(slug)) return true;
    openPaywall(`Bạn đã dùng hết ${FREE_LIMITS.trialRoundsPerDay} lượt chơi thử hôm nay của ${game.title}. Nâng cấp VIP để chơi không giới hạn.`);
    return false;
  }, [locked, ready, consumeTrial, slug, openPaywall, game.title]);

  const requireVip = useCallback(
    (feature: string) => {
      if (isVip) return true;
      openPaywall(`${feature} dành cho thành viên VIP.`);
      return false;
    },
    [isVip, openPaywall],
  );

  return { isVip, ready, locked, trialsLeft: locked ? trialsLeft(slug) : null, requestRound, requireVip };
}
