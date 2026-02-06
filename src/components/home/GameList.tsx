import GameCard from './GameCard';
import { BsGrid3X3GapFill } from 'react-icons/bs';

const GAMES = [
    {
        id: 1,
        title: 'Vòng quay may mắn',
        description: 'Thử vận may của bạn xem hôm nay thế nào!',
        image: '/assets/images/vongquay.webp',
        tagName: 'May mắn',
        tagColor: 'bg-green-500/80',
        href: '/game/wheel',
    },
    {
        id: 2,
        title: 'Xí ngầu cạn ly',
        description: 'Uống hay bị phạt? Hãy để xí ngầu quyết định.',
        image: '/assets/images/xucxac.webp',
        tagName: 'Party 18+',
        tagColor: 'bg-red-500/80',
        href: '/game/dice',
    },
    {
        id: 3,
        title: 'Thật hay Thách',
        description: 'Nói thật hoặc làm liều. Bạn dám không?',
        image: '/assets/images/suthatthuthach.webp',
        tagName: 'Kinh điển',
        tagColor: 'bg-orange-500/80',
        href: '/game/truth-dare',
    },
    {
        id: 4,
        title: 'Đua Vịt',
        description: 'Cuộc đua kịch tính giữa những chú vịt vàng.',
        image: '/assets/images/duavit.webp',
        tagName: 'Vui nhộn',
        tagColor: 'bg-yellow-500/80',
        href: '/game/duck-race',
    },
    {
        id: 5,
        title: 'Nối từ / Vua Tiếng Việt',
        description: 'Thử thách vốn từ và phản xạ ngôn ngữ của bạn.',
        image: '/assets/images/tiengviet.webp',
        tagName: 'Trí tuệ',
        tagColor: 'bg-blue-500/80',
        href: '/game/word-chain',
    },
    {
        id: 6,
        title: 'Rút bao lì xì',
        description: 'Lộc về tay ai? Thử vận may đầu năm.',
        image: '/assets/images/lixi.webp',
        tagName: 'Tết',
        tagColor: 'bg-red-600/80',
        href: '/game/lucky-money',
    },
];

export default function GameList() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Tiêu đề section */}
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-accent shadow-glow">
                    <BsGrid3X3GapFill className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Danh sách trò chơi</h2>
            </div>

            {/* Grid games */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {GAMES.map((game) => (
                    <GameCard key={game.id} {...game} />
                ))}
            </div>
        </section>
    );
}
