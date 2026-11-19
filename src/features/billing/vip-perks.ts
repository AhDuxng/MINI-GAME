// Quyền lợi VIP kèm con số đếm thật từ dữ liệu game (số lá Cháy, số bộ từ VIP); tách khỏi bảng giá để trang không có hộp thoại mua không phải tải dữ liệu câu hỏi
import { DARE_CARDS, DILEMMAS, DRAW_DECKS, FOREHEAD_DECKS, HOT_LEVEL, MOST_LIKELY_CARDS, NEVER_CARDS, TRUTH_CARDS } from '@/data';
import { VIP_LIMITS } from './plans';

const hotCards = [TRUTH_CARDS, DARE_CARDS, NEVER_CARDS, MOST_LIKELY_CARDS, DILEMMAS].reduce((sum, cards) => sum + cards.filter((card) => card.level === HOT_LEVEL).length, 0);
const vipDecks = [...FOREHEAD_DECKS, ...DRAW_DECKS].filter((deck) => deck.vip);

export const VIP_PERKS = [
  'Chơi không giới hạn Bầu Cua, Gián Điệp, Bom Nổ Chậm',
  `${hotCards} lá mức "Cháy" ở 5 game bàn nhậu`,
  `${vipDecks.length} bộ từ VIP: ${vipDecks.map((deck) => deck.name).join(', ')}`,
  `Nhóm đông: đua ${VIP_LIMITS.duckRacers} vịt, xoay chai ${VIP_LIMITS.bottleSeats} người, phản xạ ${VIP_LIMITS.reflexPlayers} người`,
];
