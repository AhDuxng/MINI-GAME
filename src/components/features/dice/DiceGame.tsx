'use client';

import DiceMeanings from './DiceMeanings';
import Die from './Die';
import DiceHistory from './DiceHistory';
import { Volume2, VolumeX } from 'lucide-react';
import useDiceGame from '@/hooks/useDiceGame';

export default function DiceGame() {
    // Sử dụng custom hook cho logic chính
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
            {/* Cột trái: Ý nghĩa (Desktop only, Mobile nằm dưới cùng hoặc popup?) -> User guide shows left. */}
            <div className="hidden lg:block lg:col-span-3">
                <DiceMeanings />
            </div>

            {/* Cột giữa: Bàn chơi */}
            <div className="lg:col-span-6 flex flex-col items-center">
                {/* Bàn xanh Felt Green */}
                <div className="relative flex w-full aspect-square max-w-[500px] flex-col items-center justify-center rounded-full border-[16px] border-[#3E2723] bg-[#004D40] shadow-2xl">
                    {/* Shadow bên trong bàn */}
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(0,0,0,0.5)] pointer-events-none"></div>

                    {/* Xí ngầu 3D */}
                    <div className="z-10 -mt-10">
                        <Die result={result} isRolling={isRolling} />
                    </div>
                </div>

                {/* Nút Shake */}
                <div className="mt-8 w-full max-w-xs px-4">
                    <button
                        onClick={roll}
                        disabled={isRolling}
                        className="group relative w-full overflow-hidden rounded-2xl bg-orange-500 py-4 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-80"
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex flex-col items-center justify-center gap-1">
                            <span className="text-2xl font-semibold uppercase tracking-widest flex items-center gap-2">
                                LẮC NGAY
                            </span>
                        </div>
                    </button>
                </div>

                {/* Footer Controls */}
                <div className="mt-8 flex items-center gap-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-6 py-2">
                        <span className="text-lg">🍺</span>
                        <div>
                            <p className="text-lg text-orange-600 italic">"Đã uống rượu bia, không lái xe."</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex gap-4">
                    <button
                        onClick={toggleSound}
                        className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:text-orange-600"
                    >
                        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        Âm thanh
                    </button>
                </div>

                {/* Mobile: Ý nghĩa (Hiển thị dưới cùng ở mobile) */}
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
