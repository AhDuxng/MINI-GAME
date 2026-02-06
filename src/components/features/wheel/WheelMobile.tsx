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

export default function WheelMobile({ segments, isSpinning, onSpinEnd, rotation, onSpinTrigger }: WheelProps) {
    // Dùng size cố định cho hệ tọa độ SVG, nhưng hiển thị sẽ scale theo width 100%
    const size = 480;
    const center = size / 2;
    // Tinh chỉnh bán kính cho mobile để nhìn thoáng hơn chút
    const radius = size / 2 - 20;

    // Tính tọa độ điểm trên đường tròn
    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div className="relative w-full aspect-square max-w-[400px] mx-auto">
            {/* 1. Mũi tên chỉ kết quả (Đặt tuyệt đối bên trên) */}
            <div className="absolute -top-[6%] left-1/2 z-20 w-[12%] -translate-x-1/2 text-[#C2410C] drop-shadow-md filter">
                <svg viewBox="0 0 24 24" fill="currentColor" className="rotate-180 w-full h-full">
                    <path d="M12 2L2 22H22L12 2Z" />
                </svg>
            </div>

            {/* 2. SVG chứa toàn bộ vòng quay (Scale responsive 100%) */}
            <div className="relative w-full h-full">
                {/* Viền tĩnh (Outer Rims) */}
                <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 w-full h-full drop-shadow-xl">
                    <circle cx={center} cy={center} r={size / 2 - 5} fill="#F59E0B" stroke="#D97706" strokeWidth="4" />
                    <circle cx={center} cy={center} r={size / 2 - 16} fill="#FFF7ED" fillOpacity="0.3" />
                </svg>

                {/* Phần quay động (Wheel Segments) */}
                <motion.div
                    className="absolute inset-0 w-full h-full"
                    animate={{ rotate: rotation }}
                    transition={{
                        duration: isSpinning ? 5 : 0,
                        ease: isSpinning ? [0.25, 0.1, 0.25, 1] : 'linear',
                        type: 'tween',
                    }}
                    onAnimationComplete={() => {
                        if (isSpinning) onSpinEnd();
                    }}
                >
                    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
                        <circle cx={center} cy={center} r={radius} fill="rgba(0,0,0,0.1)" />

                        {segments.map((segment, index) => {
                            const count = segments.length;
                            const sliceAngle = 1 / count;
                            const startAngle = index * sliceAngle;
                            const endAngle = (index + 1) * sliceAngle;

                            const [startX, startY] = getCoordinatesForPercent(startAngle);
                            const [endX, endY] = getCoordinatesForPercent(endAngle);
                            const largeArcFlag = sliceAngle > 0.5 ? 1 : 0;

                            const pathData = [
                                `M ${center} ${center}`,
                                `L ${center + radius * startX} ${center + radius * startY}`,
                                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${center + radius * endX} ${center + radius * endY}`,
                                'Z',
                            ].join(' ');

                            const textAngle = startAngle + sliceAngle / 2;
                            const textRotationDeg = textAngle * 360;

                            return (
                                <g key={index}>
                                    <path d={pathData} fill={COLORS[index % COLORS.length]} stroke="#FFF7ED" strokeWidth="2" />
                                    <text
                                        x={center + (radius * 0.65) * Math.cos(2 * Math.PI * textAngle)}
                                        y={center + (radius * 0.65) * Math.sin(2 * Math.PI * textAngle)}
                                        fill="white"
                                        fontSize="20"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        transform={`rotate(${textRotationDeg + 90}, ${center + (radius * 0.65) * Math.cos(2 * Math.PI * textAngle)}, ${center + (radius * 0.65) * Math.sin(2 * Math.PI * textAngle)})`}
                                        style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
                                    >
                                        {segment.length > 15 ? segment.substring(0, 15) + '...' : segment}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </motion.div>

                {/* 3. Nút Quay (Center Button) - Tuyệt đối ở giữa */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <button
                        onClick={onSpinTrigger}
                        disabled={isSpinning}
                        className="pointer-events-auto relative flex h-[20%] w-[20%] items-center justify-center rounded-full border-4 border-white bg-[#EA580C] text-[4vw] sm:text-sm font-extrabold text-white shadow-xl transition-transform active:scale-95"
                    >
                        <div className="absolute inset-1 rounded-full border border-white/30"></div>
                        QUAY
                    </button>
                </div>
            </div>
        </div>
    );
}

