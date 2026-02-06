import DiceMeanings from './DiceMeanings';
import Die from './Die';
import DiceHistory from './DiceHistory';
import { FaVolumeHigh, FaVolumeXmark } from 'react-icons/fa6';
import { BsDice5Fill } from 'react-icons/bs';
import useDiceGame from '@/hooks/useDiceGame';

export default function DiceGame() {
    const {
        result,
        isRolling,
        history,
        soundEnabled,
        roll,
        clearHistory,
        toggleSound
    } = useDiceGame();

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 max-w-8xl justify-between mx-auto h-full">
            {/* Cột trái: Ý nghĩa */}
            <div className="hidden lg:block lg:col-span-3">
                <DiceMeanings />
            </div>

            {/* Cột giữa: Bàn chơi */}
            <div className="lg:col-span-6 flex flex-col items-center">
                {/* Bàn chơi */}
                <div className="relative flex w-full aspect-square max-w-[500px] flex-col items-center justify-center rounded-full glass-lg border-2 border-orange-200 bg-emerald-600/90">
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(16,185,129,0.3)] pointer-events-none"></div>
                    <div className="z-10 -mt-10">
                        <Die result={result} isRolling={isRolling} />
                    </div>
                </div>

                {/* Nút Lắc */}
                <div className="mt-8 w-full max-w-xs px-4">
                    <button
                        onClick={roll}
                        disabled={isRolling}
                        className="group relative w-full overflow-hidden rounded-xl bg-gradient-button py-4 text-white shadow-glow transition-all duration-300 hover:scale-105 hover:shadow-glow-orange disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="text-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                            LẮC NGAY <BsDice5Fill className="h-6 w-6" />
                        </span>
                    </button>
                </div>

                {/* Footer Controls */}
                <div className="mt-8 flex items-center gap-4">
                    <div className="glass-sm inline-flex items-center gap-3 rounded-xl px-6 py-3">
                        <span className="text-lg">🍺</span>
                        <p className="text-sm font-medium text-gray-600 italic">"Đã uống không lái xe"</p>
                    </div>
                </div>

                <div className="mt-4 flex gap-4">
                    <button
                        onClick={toggleSound}
                        className="glass-sm flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-orange-50 hover:text-orange-600"
                    >
                        {soundEnabled ? <FaVolumeHigh className="h-4 w-4" /> : <FaVolumeXmark className="h-4 w-4" />}
                        Âm thanh
                    </button>
                </div>

                {/* Mobile: Ý nghĩa */}
                <div className="lg:hidden w-full mt-8">
                    <DiceMeanings />
                </div>
            </div>

            {/* Cột phải: Lịch sử */}
            <div className="lg:col-span-3">
                <DiceHistory history={history} onClear={clearHistory} />
            </div>
        </div>
    );
}
