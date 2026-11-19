// Danh mục trò chơi: nguồn dữ liệu duy nhất cho trang chủ, menu, tìm kiếm, phân quyền VIP và metadata từng trang game
import type { Metadata } from 'next';
import { searchKey } from '@/shared/lib/utils';

export const SITE = {
  name: 'VuiChơi',
  tagline: 'Cổng mini game cho mọi cuộc vui',
  description: 'Mini game cho tiệc tùng: vòng quay, xí ngầu, thật hay thách, đua vịt, bầu cua và nhiều trò khác',
};

export type GameSlug =
  | 'wheel'
  | 'dice'
  | 'truth-dare'
  | 'duck-race'
  | 'word-chain'
  | 'lucky-money'
  | 'never-have-i'
  | 'hot-bomb'
  | 'spy-word'
  | 'fish-prawn-crab'
  | 'werewolf'
  | 'spin-bottle'
  | 'number-bomb'
  | 'card-rules'
  | 'most-likely'
  | 'quick-tap'
  | 'forehead'
  | 'draw-guess'
  | 'would-you-rather';

export type CategorySlug = 'online' | 'drinking' | 'group' | 'brain' | 'tet';
export type GameBadge = 'new' | 'hot';

export const CATEGORIES: { slug: CategorySlug; label: string; stop: number }[] = [
  { slug: 'online', label: 'Chơi online', stop: 6 },
  { slug: 'drinking', label: 'Bàn nhậu', stop: 2 },
  { slug: 'group', label: 'Chơi nhóm', stop: 7 },
  { slug: 'brain', label: 'Trí tuệ', stop: 5 },
  { slug: 'tet', label: 'Ngày Tết', stop: 3 },
];

export interface GameInfo {
  slug: GameSlug;
  title: string;
  tagline: string;
  description: string;
  category: CategorySlug;
  players: string;
  duration: string;
  badges: GameBadge[];
  vip: boolean;
  howTo: string[];
}

export const GAMES: GameInfo[] = [
  {
    slug: 'werewolf',
    title: 'Ma Sói Online',
    tagline: 'Đêm xuống sói đi săn, trời sáng cả làng truy tìm kẻ gian!',
    description: 'Mỗi người một điện thoại, máy chủ giữ kín vai. Đêm xuống màn hình tối hết, chỉ ai được gọi mới thức dậy và thấy nhau.',
    category: 'online',
    players: '5–16 người',
    duration: '20 phút',
    badges: ['new', 'hot'],
    vip: false,
    howTo: [
      'Một người tạo phòng rồi gửi mã hoặc đường dẫn cho cả nhóm, ai cũng vào bằng điện thoại của mình.',
      'Mỗi người nhận một vai bí mật: Sói, Tiên tri, Bảo vệ, Phù thủy, Thợ săn hoặc Dân làng.',
      'Đêm xuống, màn hình của cả làng tối đen. Vai nào được gọi mới thức dậy, thấy đồng đội và chọn người.',
      'Trời sáng, cả làng biết ai đã chết, thảo luận rồi bỏ phiếu treo cổ người bị nghi.',
      'Dân làng thắng khi diệt hết sói, sói thắng khi số sói bằng số người còn lại.',
    ],
  },
  {
    slug: 'quick-tap',
    title: 'Nhanh Tay Lẹ Mắt',
    tagline: '2 đến 4 người chung một máy, ai chạm đúng nhanh nhất?',
    description: 'Đặt điện thoại giữa bàn, mỗi người giữ một góc màn hình. Đèn chuyển xanh, vịt hiện ra hay số 7 lóe lên, ai chạm đúng trước được điểm, chạm sai là mất lượt.',
    category: 'group',
    players: '2–4 người',
    duration: '5 phút',
    badges: ['new', 'hot'],
    vip: false,
    howTo: [
      'Đặt điện thoại giữa bàn, mỗi người chọn một góc màn hình quay về phía mình.',
      'Mỗi vòng có một luật: chạm khi đèn xanh, khi thấy con vịt, khi số 7 hiện ra, hoặc khi chữ đúng với màu của nó.',
      'Ai chạm đúng trước được 1 điểm. Chạm sai hoặc chạm sớm thì mất quyền chạm ở vòng đó.',
      'Ai đạt đủ điểm trước thắng, người ít điểm nhất chịu phạt.',
    ],
  },
  {
    slug: 'forehead',
    title: 'Đoán Trên Trán',
    tagline: 'Áp máy lên trán, cả nhóm gợi ý, bạn đoán thật nhanh!',
    description: 'Người đoán áp điện thoại lên trán, cả nhóm nhìn từ trên màn hình rồi gợi ý bằng lời hoặc bằng hành động. Đoán được càng nhiều từ trước khi hết giờ càng tốt.',
    category: 'group',
    players: '3+ người',
    duration: '5 phút',
    badges: ['new'],
    vip: false,
    howTo: [
      'Chọn chủ đề và thời gian, người đoán bấm Bắt đầu rồi áp máy lên trán, màn hình quay ra ngoài.',
      'Cả nhóm gợi ý bằng lời hoặc diễn tả bằng hành động, không được nói thẳng từ đó.',
      'Đoán đúng thì chạm nửa phải màn hình hoặc cúi máy xuống, muốn bỏ qua thì chạm nửa trái hoặc ngửa máy lên.',
      'Hết giờ, máy đếm điểm rồi chuyền cho người tiếp theo. Chủ đề Gen Z và Bàn nhậu dành cho VIP.',
    ],
  },
  {
    slug: 'draw-guess',
    title: 'Vẽ Nhanh Đoán Lẹ',
    tagline: 'Một người vẽ, cả nhóm đoán, chậm tay là hết giờ!',
    description: 'Người vẽ xem lén một từ rồi vẽ lên màn hình trước khi hết giờ, ai đoán ra trước thì cả người vẽ lẫn người đoán cùng được điểm.',
    category: 'group',
    players: '3+ người',
    duration: '15 phút',
    badges: ['new'],
    vip: false,
    howTo: [
      'Đến lượt ai, người đó bấm giữ để xem lén từ khoá, không cho ai nhìn thấy.',
      'Bấm Bắt đầu vẽ rồi vẽ lên màn hình, không được viết chữ hay nói gợi ý.',
      'Ai đoán đúng trước thì chạm tên người đó: người vẽ và người đoán cùng được 1 điểm.',
      'Hết giờ mà chưa ai đoán ra thì lộ đáp án và chuyển lượt. Bộ Thành ngữ dành cho VIP.',
    ],
  },
  {
    slug: 'would-you-rather',
    title: 'Này Hay Kia',
    tagline: 'Chọn một trong hai, phe ít người hơn phải uống!',
    description: 'Mỗi lá là một câu hỏi khó chọn giữa hai phương án. Đếm 3 giây rồi cả bàn cùng chọn phe, phe ít người hơn uống, hoà thì cả bàn cùng cạn.',
    category: 'drinking',
    players: '3+ người',
    duration: '15 phút',
    badges: ['new'],
    vip: false,
    howTo: [
      'Lật một lá và đọc to hai lựa chọn cho cả bàn.',
      'Đếm 3, 2, 1 rồi mọi người cùng giơ tay chọn phe bên trái hoặc bên phải, không được đổi.',
      'Chạm tên từng người vào phe họ đã chọn, phe ít người hơn uống. Hai phe bằng nhau thì cả bàn cùng uống.',
      'Mức độ Cháy dành cho thành viên VIP.',
    ],
  },
  {
    slug: 'spin-bottle',
    title: 'Xoay Chai',
    tagline: 'Chai dừng trước mặt ai, người đó chơi!',
    description: 'Chai 3D xoay tít giữa bàn, dừng ở ai thì người đó chọn Thật, Thách hoặc cạn ly.',
    category: 'drinking',
    players: '3–12 người',
    duration: '10 phút',
    badges: ['new'],
    vip: false,
    howTo: [
      'Nhập tên mọi người, game xếp cả nhóm ngồi quanh bàn.',
      'Bấm Xoay, chai quay rồi dừng ngẫu nhiên trước mặt một người.',
      'Người bị chai chỉ chọn Thật, Thách hoặc uống một ly để qua lượt.',
    ],
  },
  {
    slug: 'number-bomb',
    title: 'Bom Số',
    tagline: 'Đoán số né bom, trúng số bí mật là cạn ly!',
    description: 'Máy giấu một con số bom, mỗi lượt đoán thu hẹp khoảng an toàn. Ai đoán trúng con số bom thì uống.',
    category: 'drinking',
    players: '2–12 người',
    duration: '5 phút',
    badges: ['new'],
    vip: false,
    howTo: [
      'Máy giấu một con số bom trong khoảng đã chọn, không ai biết trước.',
      'Lần lượt từng người đoán một số nằm trong khoảng an toàn hiện tại.',
      'Đoán trượt thì khoảng bị thu hẹp, đoán trúng con số bom thì bom nổ và người đó uống.',
    ],
  },
  {
    slug: 'card-rules',
    title: 'Luật Bài',
    tagline: 'Rút một lá, làm đúng luật của lá đó!',
    description: 'Bộ 52 lá, mỗi lá một luật uống riêng. Ai rút lá K thứ tư phải cạn ly chung giữa bàn.',
    category: 'drinking',
    players: '3–10 người',
    duration: '20 phút',
    badges: ['new'],
    vip: false,
    howTo: [
      'Lần lượt từng người rút một lá từ bộ bài.',
      'Cả bàn làm theo luật gắn với lá vừa rút, ví dụ 2 là chỉ định một người uống.',
      'Ai rút trúng lá K thứ tư thì cạn ly chung giữa bàn, hết bài thì xào lại.',
    ],
  },
  {
    slug: 'most-likely',
    title: 'Chỉ Mặt Đặt Tên',
    tagline: 'Ai dễ say nhất? Đếm 3 giây, cả bàn cùng chỉ!',
    description: 'Lật câu hỏi "Ai dễ... nhất?", đếm ngược ba giây rồi cả nhóm cùng chỉ tay. Ai bị chỉ nhiều nhất thì uống.',
    category: 'group',
    players: '4+ người',
    duration: '15 phút',
    badges: ['new'],
    vip: false,
    howTo: [
      'Lật một lá câu hỏi "Ai dễ... nhất?" và đọc to cho cả bàn.',
      'Đếm ngược 3 giây, tất cả cùng chỉ tay vào một người, không được đổi ý.',
      'Ai bị chỉ nhiều nhất thì uống. Mức độ Cháy dành cho thành viên VIP.',
    ],
  },
  {
    slug: 'fish-prawn-crab',
    title: 'Bầu Cua',
    tagline: 'Đặt cược điểm, lắc bát, ai đoán trúng thì ăn!',
    description: 'Trò lắc bầu cua tôm cá ngày Tết, cược bằng điểm ảo cho cả nhóm.',
    category: 'tet',
    players: '2–10 người',
    duration: '10 phút',
    badges: ['new', 'hot'],
    vip: true,
    howTo: [
      'Mỗi người nhận 1.000 điểm ảo khi bắt đầu.',
      'Đặt cược vào một hoặc nhiều ô linh vật rồi bấm Lắc.',
      'Mỗi xúc xắc ra đúng ô bạn cược được trả bằng số điểm cược; không trúng thì mất cược.',
    ],
  },
  {
    slug: 'spy-word',
    title: 'Gián Điệp',
    tagline: 'Ai cầm từ khác? Mô tả khéo, đoán nhanh, tìm ra gián điệp!',
    description: 'Mỗi người nhận một từ bí mật, riêng gián điệp nhận từ khác. Mô tả, nghi ngờ và bỏ phiếu.',
    category: 'brain',
    players: '4–12 người',
    duration: '10 phút',
    badges: ['new'],
    vip: true,
    howTo: [
      'Lần lượt chuyền máy để từng người xem từ bí mật của mình.',
      'Mỗi người mô tả từ của mình bằng một câu, không được nói thẳng.',
      'Bỏ phiếu loại người bị nghi; dân thắng nếu loại được gián điệp.',
    ],
  },
  {
    slug: 'hot-bomb',
    title: 'Bom Nổ Chậm',
    tagline: 'Nói nhanh rồi chuyền máy, bom nổ trên tay ai người đó thua!',
    description: 'Quả bom hẹn giờ ngẫu nhiên, trả lời theo chủ đề rồi chuyền cho người bên cạnh.',
    category: 'group',
    players: '3–12 người',
    duration: '5 phút',
    badges: ['new', 'hot'],
    vip: true,
    howTo: [
      'Bấm châm ngòi, game ra một chủ đề và hẹn giờ ngẫu nhiên không ai biết trước.',
      'Người cầm máy nói một đáp án theo chủ đề rồi chuyền máy cho người kế bên.',
      'Bom nổ trên tay ai thì người đó nhận hình phạt.',
    ],
  },
  {
    slug: 'never-have-i',
    title: 'Tôi Chưa Từng',
    tagline: 'Ai đã từng làm điều đó thì uống!',
    description: 'Lật từng câu "Tôi chưa từng...", ai đã từng làm thì phải uống một ngụm.',
    category: 'drinking',
    players: '3+ người',
    duration: '15 phút',
    badges: ['new'],
    vip: false,
    howTo: [
      'Lật một lá bài "Tôi chưa từng...".',
      'Ai đã từng làm điều đó thì uống một ngụm và kể nhanh câu chuyện.',
      'Mức độ Cháy dành cho thành viên VIP.',
    ],
  },
  {
    slug: 'truth-dare',
    title: 'Thật hay Thách',
    tagline: 'Nói thật hoặc làm liều. Bạn dám không?',
    description: 'Trò chơi nhóm kinh điển với 90 câu hỏi và thử thách chia 3 mức độ.',
    category: 'group',
    players: '2+ người',
    duration: '15 phút',
    badges: ['hot'],
    vip: false,
    howTo: [
      'Đến lượt ai, người đó chọn Thật hoặc Thách.',
      'Trả lời thật lòng hoặc thực hiện thử thách, không dám thì uống một ngụm để đổi câu.',
      'Mức độ Cháy dành cho thành viên VIP.',
    ],
  },
  {
    slug: 'duck-race',
    title: 'Đua Vịt',
    tagline: 'Vịt ai về chót, người đó chịu phạt!',
    description: 'Cuộc đua 3D kịch tính giữa những chú vịt cao su trên mặt hồ.',
    category: 'group',
    players: '2–8 người',
    duration: '1 phút',
    badges: ['hot'],
    vip: false,
    howTo: [
      'Mỗi người chơi là một chú vịt.',
      'Bấm Bắt đầu đua và cổ vũ chú vịt của mình.',
      'Vịt về chót nhận hình phạt. Bản miễn phí đua tối đa 6 vịt, VIP tới 8 vịt.',
    ],
  },
  {
    slug: 'wheel',
    title: 'Vòng Quay May Mắn',
    tagline: 'Thử vận may, nhận quà! (Hoặc hình phạt)',
    description: 'Vòng quay 3D tuỳ chỉnh: chọn người, chọn quà hay chọn hình phạt đều được.',
    category: 'drinking',
    players: '1+ người',
    duration: '1 phút',
    badges: [],
    vip: false,
    howTo: ['Nhập danh sách ô hoặc nạp nhanh người chơi, hình phạt.', 'Bấm Quay và chờ kim dừng.', 'Có thể loại ô vừa trúng để quay tiếp.'],
  },
  {
    slug: 'dice',
    title: 'Xí Ngầu Cạn Ly',
    tagline: 'Lắc xí ngầu, định mức uống!',
    description: 'Xúc xắc 3D quyết định ai uống bao nhiêu. Lắc điện thoại để tung.',
    category: 'drinking',
    players: '2+ người',
    duration: '10 phút',
    badges: [],
    vip: false,
    howTo: ['Lần lượt từng người lắc xí ngầu.', 'Làm theo ý nghĩa mặt xí ngầu hiện ra.', 'Trên điện thoại có thể lắc máy thay cho bấm nút.'],
  },
  {
    slug: 'word-chain',
    title: 'Nối Từ',
    tagline: 'Nhanh tay, nhanh trí, ai bí là thua!',
    description: 'Thử thách vốn từ và phản xạ ngôn ngữ với đồng hồ đếm ngược từng lượt.',
    category: 'brain',
    players: '2+ người',
    duration: '10 phút',
    badges: [],
    vip: false,
    howTo: [
      'Nói một từ 2 tiếng bắt đầu bằng tiếng cuối của từ trước.',
      'Hết giờ, chịu thua hoặc bị cả bàn bác bỏ từ thì bị loại.',
      'Người trụ lại cuối cùng thắng.',
    ],
  },
  {
    slug: 'lucky-money',
    title: 'Rút Bao Lì Xì',
    tagline: 'Lộc về tay ai? Bốc một bao là biết!',
    description: 'Chủ xị nhập ngân sách, game chia ngẫu nhiên vào từng bao lì xì.',
    category: 'tet',
    players: '2+ người',
    duration: '5 phút',
    badges: [],
    vip: false,
    howTo: ['Nhập tổng ngân sách và số bao.', 'Lần lượt từng người bốc một bao.', 'Bảng lộc cộng dồn số tiền mỗi người nhận được.'],
  },
];

export const FEATURED_GAMES: GameSlug[] = ['werewolf', 'fish-prawn-crab', 'duck-race'];

export function gameHref(slug: GameSlug) {
  return `/game/${slug}`;
}

export function getGame(slug: GameSlug) {
  const game = GAMES.find((item) => item.slug === slug);
  if (!game) throw new Error(`Không tìm thấy game "${slug}"`);
  return game;
}

export function getCategory(slug: CategorySlug) {
  return CATEGORIES.find((category) => category.slug === slug) ?? CATEGORIES[0];
}

export function searchGames(query: string) {
  const key = searchKey(query);
  if (!key) return [];
  return GAMES.filter((game) =>
    searchKey(`${game.title} ${game.description} ${getCategory(game.category).label}`).includes(key),
  );
}

export function gameMetadata(slug: GameSlug): Metadata {
  const game = getGame(slug);
  return { title: game.title, description: game.description };
}
