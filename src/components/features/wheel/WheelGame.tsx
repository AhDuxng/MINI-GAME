'use client';

import { useEffect } from 'react';
import Wheel from './Wheel';
import PlayerInput from './PlayerInput';
import WinnerModal from '@/components/ui/WinnerModal';
import { Lightbulb } from 'lucide-react';
import useWheelGame from '@/hooks/useWheelGame';

import Link from 'next/link';
import Image from 'next/image'; // Remove if unused, but keeping just in case
import WheelMobile from './WheelMobile';

export default function WheelGame() {
    // Sử dụng custom hook để tách biệt logic và giao diện
    const {
        players,
        isSpinning,
        rotation,
        winner,
        updatePlayers,
        spin,
        spinEnd,
        resetWinner
    } = useWheelGame();

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Cột trái: Vòng quay + Tiêu đề */}
            <div className="flex flex-col items-center justify-center lg:col-span-7 xl:col-span-8">

                {/* --- DESKTOP UI (>= 1024px) --- */}
                <div className="hidden lg:block relative mb-8 transform transition-transform hover:scale-[1.02]">
                    <Wheel
                        segments={players}
                        isSpinning={isSpinning}
                        onSpinEnd={spinEnd}
                        rotation={rotation}
                        onSpinTrigger={spin}
                    />
                </div>

                {/* --- MOBILE UI (< 1024px) --- */}
                <div className="block lg:hidden w-full px-2 mb-6">
                    <WheelMobile
                        segments={players}
                        isSpinning={isSpinning}
                        onSpinEnd={spinEnd}
                        rotation={rotation}
                        onSpinTrigger={spin}
                    />
                </div>

            </div>

            {/* Cột phải: Cấu hình */}
            <div className="lg:col-span-5 xl:col-span-4">
                <PlayerInput
                    players={players}
                    onUpdatePlayers={updatePlayers}
                />

                {/* Mẹo chuyên nghiệp */}
                <div className="mt-6 flex items-start gap-3 rounded-xl bg-orange-50/50 p-4">
                    <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500" />
                    <p>Đừng quên cập nhật danh sách người chơi trước khi quay vòng quay nhé!</p>
                </div>
            </div>

            <WinnerModal
                winner={winner}
                onClose={resetWinner}
            />
        </div>
    );
}
