import GameCard from './GameCard';

const GAMES = [
    {
        id: 1,
        title: 'Vòng quay may mắn',
        description: 'Thử vận may của bạn xem hôm nay thế nào!',
        image: '/assets/images/vongquay.webp',
        tagName: 'May mắn',
        tagColor: 'bg-green-500',
        href: '/game/wheel',
    },
    {
        id: 2,
        title: 'Xí ngầu cạn ly',
        description: 'Uống hay bị phạt? Hãy để xí ngầu quyết định.',
        image: '/assets/images/xucxac.webp',
        tagName: 'Party 18+',
        tagColor: 'bg-red-500',
        href: '/game/dice',
    },
    {
        id: 3,
        title: 'Thật hay Thách',
        description: 'Nói thật hoặc làm liều. Bạn dám không?',
        image: '/assets/images/suthatthuthach.webp',
        tagName: 'Kinh điển',
        tagColor: 'bg-purple-500',
        href: '/game/truth-dare',
    },
    {
        id: 4,
        title: 'Đua Vịt',
        description: 'Cuộc đua kịch tính giữa những chú vịt vàng.',
        image: '/assets/images/duavit.webp',
        tagName: 'Vui nhộn',
        tagColor: 'bg-yellow-500',
        href: '/game/duck-race',
    },
    {
        id: 5,
        title: 'Nối từ / Vua Tiếng Việt',
        description: 'Thử thách vốn từ và phản xạ ngôn ngữ của bạn.',
        image: '/assets/images/tiengviet.webp',
        tagName: 'Trí tuệ',
        tagColor: 'bg-blue-500',
        href: '/game/word-chain',
    },
    {
        id: 6,
        title: 'Rút bao lì xì',
        description: 'Lộc về tay ai? Thử vận may đầu năm.',
        image: '/assets/images/lixi.webp',
        tagName: 'Tết',
        tagColor: 'bg-red-600',
        href: '/game/lucky-money',
    },
];

export default function GameList() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Danh sách trò chơi</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {GAMES.map((game) => (
                    <GameCard key={game.id} {...game} />
                ))}
            </div>
        </section>
    );
}
