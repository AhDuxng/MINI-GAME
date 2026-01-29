import { DICE_FACES } from './DiceMeanings';

interface DiceHistoryProps {
    history: { id: number; faceId: number; timestamp: Date }[];
    onClear: () => void;
}

export default function DiceHistory({ history, onClear }: DiceHistoryProps) {
    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 h-full flex flex-col">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    Lịch sử lượt chơi
                </h3>
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                    ĐANG CHƠI
                </span>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                {history.length === 0 && (
                    <p className="text-center text-sm text-gray-400 italic py-10">Chưa có lượt chơi nào...</p>
                )}

                {history.map((turn, index) => {
                    // Logic tính "Vừa xong", "1 phút trước" đơn giản
                    const face = DICE_FACES.find(f => f.id === turn.faceId) || DICE_FACES[0];
                    const diff = new Date().getTime() - turn.timestamp.getTime();
                    const seconds = Math.floor(diff / 1000);
                    let timeAgo = 'Vừa xong';
                    if (seconds > 60) timeAgo = `${Math.floor(seconds / 60)} phút trước`;

                    // Index đếm ngược: Tổng - index
                    const turnNumber = history.length - index;

                    return (
                        <div key={turn.id} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${face.bg} ${face.color}`}>
                                <face.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-400">LƯỢT #{turnNumber}</span>
                                    <span className="text-xs text-gray-400">{timeAgo}</span>
                                </div>
                                <p className="font-bold text-gray-900">{face.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {history.length > 0 && (
                <button
                    onClick={onClear}
                    className="mt-6 w-full rounded-xl py-3 text-sm font-bold text-orange-500 hover:bg-orange-50 transition-colors uppercase tracking-wide"
                >
                    Xóa lịch sử
                </button>
            )}
        </div>
    );
}
