'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface WheelProps {
    segments: string[];
    isSpinning: boolean;
    onSpinEnd: () => void;
    rotation: number;
}

// Bảng màu rực rỡ để phân biệt các ô trên vòng quay
const COLORS = [
    '#FF6B00', // Cam đậm
    '#FFB000', // Vàng
    '#eb4d4b', // Đỏ
    '#6ab04c', // Xanh lá
    '#22a6b3', // Xanh dương
    '#be2edd', // Tím
    '#f0932b', // Cam nhạt
    '#30336b', // Xanh đậm
];

export default function Wheel({ segments, isSpinning, onSpinEnd, rotation }: WheelProps) {
    const size = 300; // Kích thước SVG cố định
    const center = size / 2;
    const radius = size / 2 - 10; // Khoảng cách đệm để không bị cắt viền

    // Tính tọa độ điểm trên đường tròn dựa trên phần trăm góc
    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div className="relative flex items-center justify-center">
            {/* Mũi tên chỉ kết quả (Tam giác ngược) */}
            <div className="absolute -top-6 z-10 text-gray-800 drop-shadow-md">
                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="rotate-180"
                >
                    <path d="M12 2L2 22H22L12 2Z" />
                </svg>
            </div>

            {/* Container vòng quay có animation xoay */}
            <motion.div
                className="relative overflow-hidden rounded-full shadow-2xl ring-4 ring-white"
                style={{ width: size, height: size }}
                animate={{ rotate: rotation }}
                transition={{
                    duration: isSpinning ? 4 : 0, // Thời gian quay 4s
                    ease: isSpinning ? [0.2, 0.8, 0, 1] : 'linear', // Hiệu ứng giảm tốc (cubic-bezier)
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

                        // Dữ liệu đường dẫn SVG
                        const pathData = [
                            `M ${center} ${center}`,
                            `L ${center + radius * startX} ${center + radius * startY}`,
                            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${center + radius * endX} ${center + radius * endY}`,
                            'Z',
                        ].join(' ');

                        // Tính toán góc xoay chữ để chữ luôn hướng tâm
                        const textAngle = startAngle + sliceAngle / 2;
                        const textRotationDeg = textAngle * 360;

                        return (
                            <g key={index}>
                                <path d={pathData} fill={COLORS[index % COLORS.length]} stroke="white" strokeWidth="2" />
                                <text
                                    x={center + (radius * 0.65) * Math.cos(2 * Math.PI * textAngle)}
                                    y={center + (radius * 0.65) * Math.sin(2 * Math.PI * textAngle)}
                                    fill="white"
                                    fontSize="12"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    transform={`rotate(${textRotationDeg + 90}, ${center + (radius * 0.65) * Math.cos(2 * Math.PI * textAngle)}, ${center + (radius * 0.65) * Math.sin(2 * Math.PI * textAngle)})`}
                                    style={{ pointerEvents: 'none' }}
                                >
                                    {segment.length > 10 ? segment.substring(0, 10) + '...' : segment}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </motion.div>

            {/* Nút trang trí ở giữa tâm vòng quay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-12 w-12 rounded-full bg-white shadow-md flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                        ★
                    </div>
                </div>
            </div>
        </div>
    );
}
