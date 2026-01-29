import { useState, useCallback } from 'react';

const DEFAULT_PLAYERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function useWheelGame() {
    const [players, setPlayers] = useState<string[]>(DEFAULT_PLAYERS);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);

    // Cập nhật danh sách người chơi
    const updatePlayers = useCallback((newPlayers: string[]) => {
        setPlayers(newPlayers);
    }, []);

    // Xử lý quay vòng quay
    const spin = useCallback(() => {
        if (players.length < 2 || isSpinning) return;

        setIsSpinning(true);
        setWinner(null);

        // 1. Chọn ngẫu nhiên index người thắng ngay từ đầu
        const randomIndex = Math.floor(Math.random() * players.length);

        // 2. Tính toán góc để ô đó dừng lại ở vị trí mũi tên (270 độ / 12h)
        const sliceAngle = 360 / players.length;

        // Góc bắt đầu của ô thắng (trên vòng tròn 0-360)
        const segmentStartAngle = randomIndex * sliceAngle;

        // Random một vị trí nằm trong ô đó (trừ đi một chút lề để không sát vạch)
        // Lề an toàn: 10% mỗi bên
        const padding = sliceAngle * 0.1;
        const randomOffset = padding + Math.random() * (sliceAngle - 2 * padding);
        const targetSpotOnWheel = segmentStartAngle + randomOffset;

        // Vị trí mũi tên là cố định ở 270 độ.
        // Ta cần: (targetSpotOnWheel + R) % 360 = 270 => R = 270 - targetSpotOnWheel
        let targetRotation = 270 - targetSpotOnWheel;

        // Đảm bảo quay đúng hướng (tăng dần)
        const currentRotationMod = rotation % 360;
        let degreesNeeded = targetRotation - currentRotationMod;

        if (degreesNeeded < 0) degreesNeeded += 360;

        // Quay tối thiểu 5 vòng
        const spinCount = 5;
        const totalRotationToAdd = (spinCount * 360) + degreesNeeded;

        const newRotation = rotation + totalRotationToAdd;

        setRotation(newRotation);
    }, [players.length, isSpinning, rotation]);

    // Xử lý khi quay xong
    const spinEnd = useCallback(() => {
        setIsSpinning(false);

        // Tính lại winner dựa trên rotation cuối cùng để đảm bảo đồng bộ
        const currentRot = rotation % 360;
        const count = players.length;
        const sliceAngle = 360 / count;

        let effectiveAngle = (270 - currentRot) % 360;
        if (effectiveAngle < 0) effectiveAngle += 360;

        const winningIndex = Math.floor(effectiveAngle / sliceAngle);
        const safeIndex = Math.min(Math.max(winningIndex, 0), count - 1);

        setWinner(players[safeIndex]);
    }, [rotation, players]);

    // Reset winner
    const resetWinner = useCallback(() => {
        setWinner(null);
    }, []);

    return {
        players,
        isSpinning,
        rotation,
        winner,
        updatePlayers,
        spin,
        spinEnd,
        resetWinner
    };
}
