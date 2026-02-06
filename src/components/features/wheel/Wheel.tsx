'use client';

import { motion } from 'framer-motion';

interface WheelProps {
    segments: string[];
    isSpinning: boolean;
    onSpinEnd: () => void;
    rotation: number;
    onSpinTrigger: () => void;
}

// Bảng màu vàng/cam chủ đạo
const COLORS = [
    '#F97316',
    '#FB923C',
    '#F59E0B',
    '#FCD34D',
];

export default function Wheel({ segments, isSpinning, onSpinEnd, rotation, onSpinTrigger }: WheelProps) {
    const size = 480;
    const center = size / 2;
    const radius = size / 2 - 24;

    // Tính tọa độ điểm trên đường tròn dựa trên phần trăm góc
    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            {/* Mũi tên chỉ kết quả (Tam giác) - Vị trí cố định phía trên */}
            <div className="absolute -top-8 z-20 text-[#C2410C] drop-shadow-lg filter">
                <svg
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="rotate-180"
                >
                    <path d="M12 2L2 22H22L12 2Z" />
                </svg>
            </div>

            {/* Viền ngoài trang trí (Golden Rim) */}
            <div
                className="absolute inset-0 rounded-full border-[12px] border-[#F59E0B] shadow-2xl"
                style={{ width: size, height: size }}
            ></div>
            <div
                className="absolute inset-2 rounded-full border-[4px] border-[#FFF7ED] opacity-30"
                style={{ width: size - 16, height: size - 16 }}
            ></div>

            {/* Container vòng quay có animation xoay */}
            <motion.div
                className="relative overflow-hidden rounded-full font-bold uppercase text-white shadow-inner"
                style={{ width: size - 24, height: size - 24 }} // Nhỏ hơn container outer rim
                animate={{ rotate: rotation }}
                transition={{
                    duration: isSpinning ? 5 : 0, // Quay lâu hơn chút
                    ease: isSpinning ? [0.25, 0.1, 0.25, 1] : 'linear', // Cubic bezier mượt
                    type: 'tween',
                }}
                onAnimationComplete={() => {
                    // Giao tiếp lại với component cha khi quay xong
                    if (isSpinning) onSpinEnd();
                }}
            >
                <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
                    {segments.map((segment, index) => {
                        const count = segments.length;
                        const sliceAngle = 1 / count;
                        const startAngle = index * sliceAngle;
                        const endAngle = (index + 1) * sliceAngle;

                        // Tọa độ vẽ cung tròn (Pie slice)
                        const [startX, startY] = getCoordinatesForPercent(startAngle);
                        const [endX, endY] = getCoordinatesForPercent(endAngle);

                        // Flag xác định cung lớn hay nhỏ (SVG requirment)
                        const largeArcFlag = sliceAngle > 0.5 ? 1 : 0;

                        const r = size / 2; // Full radius trong coordinate system này

                        const pathData = [
                            `M ${r} ${r}`,
                            `L ${r + r * startX} ${r + r * startY}`,
                            `A ${r} ${r} 0 ${largeArcFlag} 1 ${r + r * endX} ${r + r * endY}`,
                            'Z',
                        ].join(' ');

                        // Tính toán góc xoay chữ để chữ luôn hướng tâm
                        const textAngle = startAngle + sliceAngle / 2;
                        const textRotationDeg = textAngle * 360;

                        return (
                            <g key={index}>
                                <path
                                    d={pathData}
                                    fill={COLORS[index % COLORS.length]}
                                    stroke="#FFF7ED"
                                    strokeWidth="2"
                                />
                                <text
                                    x={r + (r * 0.65) * Math.cos(2 * Math.PI * textAngle)}
                                    y={r + (r * 0.65) * Math.sin(2 * Math.PI * textAngle)}
                                    fill="white"
                                    fillOpacity="0.9"
                                    fontSize="14"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    transform={`rotate(${textRotationDeg + 90}, ${r + (r * 0.65) * Math.cos(2 * Math.PI * textAngle)}, ${r + (r * 0.65) * Math.sin(2 * Math.PI * textAngle)})`}
                                    style={{
                                        pointerEvents: 'none',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {segment.length > 15 ? segment.substring(0, 15) + '...' : segment}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </motion.div>

            {/* Nút Quay ở giữa (Center Spin Button) */}
            <div className="absolute inset-0 flex items-center justify-center z-30">
                <button
                    onClick={onSpinTrigger}
                    disabled={isSpinning}
                    className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-[#EA580C] text-sm font-extrabold text-white shadow-xl transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-80"
                >
                    <div className="absolute inset-0 rounded-full border border-white/20"></div>
                    QUAY
                </button>
            </div>
        </div>
    );
}

