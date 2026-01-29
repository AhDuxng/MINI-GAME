import { useState, useRef, useEffect, useCallback } from 'react';

// Định nghĩa kiểu dữ liệu cho lịch sử lượt chơi
interface DiceRoll {
    id: number;      // Timestamp dùng làm key
    faceId: number;  // Kết quả mặt xí ngầu (1-6)
    timestamp: Date; // Thời gian thực
}

export default function useDiceGame() {
    // State quản lý trạng thái game
    const [result, setResult] = useState(1);
    const [isRolling, setIsRolling] = useState(false);
    const [history, setHistory] = useState<DiceRoll[]>([]);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Ref để debouncing sự kiện lắc thiết bị
    const lastShakeRef = useRef<number>(0);

    // Hàm tạo âm thanh lắc bằng Web Audio API (Không cần tải file mp3)
    const playSound = useCallback(() => {
        if (!soundEnabled) return;

        try {
            // Hỗ trợ cả Webkit browser cũ
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;


            const ctx = new AudioContext();

            // Hàm tạo nốt nhạc vui nhộn (Sine/Triangle wave)
            const playNote = (freq: number, startTime: number, duration: number) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'triangle'; // Âm thanh sáng, giống game 8-bit/Nintendo
                osc.frequency.value = freq;

                osc.connect(gain);
                gain.connect(ctx.destination);

                // Envelope: Ping ngắn gọn
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

                osc.start(startTime);
                osc.stop(startTime + duration + 0.1);
            };

            // Chơi dải hợp âm C Major (Đô Trưởng) đi lên: C5, E5, G5, C6
            // Tạo cảm giác tích cực, vui vẻ
            const now = ctx.currentTime;
            playNote(523.25, now + 0, 0.2);       // C5
            playNote(659.25, now + 0.1, 0.2);     // E5
            playNote(783.99, now + 0.2, 0.2);     // G5
            playNote(1046.50, now + 0.3, 0.4);    // C6

            // Thêm một chút effect "lung linh" (tùy chọn)

        } catch (e) {
            console.error('Lỗi phát âm thanh:', e);
        }
    }, [soundEnabled]);

    // Hàm thực hiện lắc xí ngầu
    const roll = useCallback(() => {
        if (isRolling) return;

        setIsRolling(true);
        playSound();

        // Animation kéo dài 1.5s
        setTimeout(() => {
            const newResult = Math.floor(Math.random() * 6) + 1;
            setResult(newResult);
            setIsRolling(false);

            // Thêm vào đầu danh sách lịch sử
            setHistory((prev) => [
                { id: Date.now(), faceId: newResult, timestamp: new Date() },
                ...prev,
            ]);
        }, 1500);
    }, [isRolling, playSound]);

    // Xóa lịch sử
    const clearHistory = useCallback(() => {
        setHistory([]);
    }, []);

    // Bật/Tắt âm thanh
    const toggleSound = useCallback(() => {
        setSoundEnabled((prev) => !prev);
    }, []);

    // Xử lý sự kiện lắc điện thoại (Device Motion)
    useEffect(() => {
        const handleMotion = (event: DeviceMotionEvent) => {
            if (isRolling) return;

            const now = Date.now();
            // Debounce: Chỉ nhận lắc mỗi 1.5 giây để tránh kích hoạt liên tục
            if (now - lastShakeRef.current < 1500) return;

            const { x, y, z } = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };

            if (!x || !y || !z) return;

            // Tính tổng gia tốc (bỏ qua trọng lực)
            const acceleration = Math.sqrt(x * x + y * y + z * z);

            // Ngưỡng lắc (Threshold > 20 m/s2 là đủ mạnh)
            if (acceleration > 20) {
                lastShakeRef.current = now;
                roll();
            }
        };

        // Đăng ký sự kiện
        if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
            window.addEventListener('devicemotion', handleMotion);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('devicemotion', handleMotion);
            }
        };
    }, [isRolling, roll]);

    return {
        result,
        isRolling,
        history,
        soundEnabled,
        roll,
        clearHistory,
        toggleSound,
    };
}
