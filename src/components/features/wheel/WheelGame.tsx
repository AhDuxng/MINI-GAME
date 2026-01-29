'use client';

import { useState } from 'react';
import Wheel from './Wheel';
import PlayerInput from './PlayerInput';
import WinnerModal from '@/components/ui/WinnerModal';
import { Play } from 'lucide-react';

// Danh sách người chơi mặc định để demo tính năng
const DEFAULT_PLAYERS = ['Bạn A', 'Bạn B', 'Bạn C', 'Bạn D', 'Bạn E', 'Bạn F'];

export default function WheelGame() {
    const [players, setPlayers] = useState<string[]>(DEFAULT_PLAYERS);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);

    const handleAddPlayer = (name: string) => {
        setPlayers([...players, name]);
    };

    const handleRemovePlayer = (index: number) => {
        setPlayers(players.filter((_, i) => i !== index));
    };

    const handleSpin = () => {
        if (players.length < 2 || isSpinning) return;

        setIsSpinning(true);
        setWinner(null);

        // Tính toán góc quay mới:
        // Quay tối thiểu 5 vòng (1800 độ) + thêm 1 khoảng ngẫu nhiên (0-360 độ)
        // Giúp tạo cảm giác hồi hộp và ngẫu nhiên cho mỗi lượt chơi
        const spinCount = 5;
        const extraDegrees = Math.random() * 360;
        const newRotation = rotation + spinCount * 360 + extraDegrees;

        setRotation(newRotation);
    };

    const handleSpinEnd = () => {
        setIsSpinning(false);

        // Tính toán người thắng sau khi quay xong
        // Logic: Vòng quay theo kim đồng hồ. Mũi tên chỉ ở góc 270 độ (đỉnh trên).
        // Ta tính toán xem segment nào đang nằm ở vị trí 270 độ đó.

        const currentRot = rotation % 360; // Góc quay dư hiện tại
        const count = players.length;
        const sliceAngle = 360 / count; // Góc của mỗi miếng

        // Công thức tìm góc hiệu dụng khớp với mũi tên (vị trí 270 độ)
        // Cần chuẩn hóa về dương để tính index mảng dễ dàng
        let effectiveAngle = (270 - currentRot) % 360;
        if (effectiveAngle < 0) effectiveAngle += 360;

        // Tìm index dựa trên góc hiệu dụng
        const winningIndex = Math.floor(effectiveAngle / sliceAngle);

        // Đảm bảo index hợp lệ để tránh crash
        const safeIndex = Math.min(Math.max(winningIndex, 0), count - 1);

        setWinner(players[safeIndex]);
    };

    return (
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-center">
            <div className="flex flex-1 flex-col items-center justify-center gap-8">
                <div className="relative">
                    <Wheel
                        segments={players}
                        isSpinning={isSpinning}
                        onSpinEnd={handleSpinEnd}
                        rotation={rotation}
                    />
                </div>

                <button
                    onClick={handleSpin}
                    disabled={isSpinning || players.length < 2}
                    className="flex items-center gap-2 rounded-full bg-orange-500 px-12 py-4 text-xl font-bold text-white shadow-xl shadow-orange-200 transition-all hover:scale-105 hover:bg-orange-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSpinning ? 'Đang quay...' : (
                        <>
                            <Play className="fill-current" />
                            QUAY NGAY
                        </>
                    )}
                </button>
            </div>

            {/* Right: Inputs */}
            <div className="flex w-full max-w-md flex-col gap-4">
                <PlayerInput
                    players={players}
                    onAddPlayer={handleAddPlayer}
                    onRemovePlayer={handleRemovePlayer}
                />

                <div className="rounded-2xl bg-orange-50 p-4 text-center text-sm text-orange-800">
                    💡 Mẹo: Nhập tên bạn bè hoặc các lựa chọn để quay!
                </div>
            </div>

            <WinnerModal
                winner={winner}
                onClose={() => setWinner(null)}
            />
        </div>
    );
}
