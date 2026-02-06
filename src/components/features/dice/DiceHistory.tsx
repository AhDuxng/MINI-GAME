import { DICE_FACES } from './DiceMeanings';

interface DiceHistoryProps {
    history: { id: number; faceId: number; timestamp: Date }[];
    onClear: () => void;
}

export default function DiceHistory({ history, onClear }: DiceHistoryProps) {
    return (
        <div className="glass rounded-2xl p-6 h-full flex flex-col">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">Lịch sử</h3>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-600 animate-pulse">
                    LIVE
                </span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '500px' }}>
                {history.length === 0 && (
                    <div className="glass-sm flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-orange-200">
                        <p className="text-sm text-gray-400">Chưa có lượt chơi nào...</p>
                    </div>
                )}

                {history.map((turn, index) => {
                    const face = DICE_FACES.find(f => f.id === turn.faceId) || DICE_FACES[0];
                    const diff = new Date().getTime() - turn.timestamp.getTime();
                    const seconds = Math.floor(diff / 1000);
                    let timeAgo = 'Vừa xong';
                    if (seconds > 60) timeAgo = `${Math.floor(seconds / 60)} phút trước`;

                    const turnNumber = history.length - index;

                    return (
                        <div key={turn.id} className="glass-sm flex items-center gap-4 rounded-xl p-3 transition-all hover:bg-orange-50">
                            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${face.bg} ${face.color}`}>
                                <face.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-400">#{turnNumber}</span>
                                    <span className="text-xs text-gray-400">{timeAgo}</span>
                                </div>
                                <p className="font-bold text-gray-800">{face.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {history.length > 0 && (
                <button
                    onClick={onClear}
                    className="mt-6 w-full glass-sm rounded-xl py-3 text-sm font-medium text-gray-500 transition-all hover:bg-red-50 hover:text-red-500"
                >
                    Xóa hết
                </button>
            )}
        </div>
    );
}
