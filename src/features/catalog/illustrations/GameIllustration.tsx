// Chọn minh hoạ hoạt hình tương ứng với từng game theo slug; bảng ARTS bắt buộc đủ mọi game nên thêm game mà quên vẽ minh hoạ sẽ báo lỗi lúc biên dịch
import type { ComponentType } from 'react';
import type { GameSlug } from '../games';
import FishPrawnCrabArt from './FishPrawnCrabArt';
import NumberBombArt from './NumberBombArt';
import MostLikelyArt from './MostLikelyArt';
import DiceArt from './DiceArt';
import ForeheadArt from './ForeheadArt';
import DuckRaceArt from './DuckRaceArt';
import HotBombArt from './HotBombArt';
import CardRulesArt from './CardRulesArt';
import LuckyMoneyArt from './LuckyMoneyArt';
import WerewolfArt from './WerewolfArt';
import WouldYouRatherArt from './WouldYouRatherArt';
import NeverHaveIArt from './NeverHaveIArt';
import QuickTapArt from './QuickTapArt';
import SpyWordArt from './SpyWordArt';
import TruthDareArt from './TruthDareArt';
import DrawGuessArt from './DrawGuessArt';
import WheelArt from './WheelArt';
import WordChainArt from './WordChainArt';
import SpinBottleArt from './SpinBottleArt';

const ARTS = {
  wheel: WheelArt,
  dice: DiceArt,
  'truth-dare': TruthDareArt,
  'duck-race': DuckRaceArt,
  'word-chain': WordChainArt,
  'lucky-money': LuckyMoneyArt,
  'fish-prawn-crab': FishPrawnCrabArt,
  'spy-word': SpyWordArt,
  'hot-bomb': HotBombArt,
  'never-have-i': NeverHaveIArt,
  'werewolf': WerewolfArt,
  'spin-bottle': SpinBottleArt,
  'number-bomb': NumberBombArt,
  'card-rules': CardRulesArt,
  'most-likely': MostLikelyArt,
  'quick-tap': QuickTapArt,
  'forehead': ForeheadArt,
  'draw-guess': DrawGuessArt,
  'would-you-rather': WouldYouRatherArt,
} satisfies Record<GameSlug, ComponentType<{ className?: string }>>;

export default function GameIllustration({ slug, className }: { slug: GameSlug; className?: string }) {
  const Art = ARTS[slug];
  return <Art className={className} />;
}
