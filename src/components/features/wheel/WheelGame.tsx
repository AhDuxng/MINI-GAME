import { useEffect } from 'react';
import Wheel from './Wheel';
import PlayerInput from './PlayerInput';
import WinnerModal from '@/components/ui/WinnerModal';
import { FaLightbulb } from 'react-icons/fa6';
import useWheelGame from '@/hooks/useWheelGame';
import WheelMobile from './WheelMobile';

export default function WheelGame() {
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
            {/* Cột trái: Vòng quay */}
            <div className="flex flex-col items-center justify-center lg:col-span-7 xl:col-span-8">
                {/* Desktop UI */}
                <div className="hidden lg:block relative mb-8 transform transition-transform hover:scale-[1.02]">
                    <Wheel
                        segments={players}
                        isSpinning={isSpinning}
                        onSpinEnd={spinEnd}
                        rotation={rotation}
                        onSpinTrigger={spin}
                    />
                </div>

                {/* Mobile UI */}
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
                {/* Tip box */}
                <div className="mb-6 glass-sm flex items-start gap-3 rounded-xl p-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-button shadow-glow">
                        <FaLightbulb className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-sm text-gray-600">
                        Đừng quên cập nhật danh sách người chơi trước khi quay vòng quay nhé!
                    </p>
                </div>

                <PlayerInput
                    players={players}
                    onUpdatePlayers={updatePlayers}
                />
            </div>

            <WinnerModal
                winner={winner}
                onClose={resetWinner}
            />
        </div>
    );
}
