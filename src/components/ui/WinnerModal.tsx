'use client';

import { FaXmark, FaTrophy } from 'react-icons/fa6';

import { useEffect, useState } from 'react';

interface WinnerModalProps {
    winner: string | null;
    onClose: () => void;
}

export default function WinnerModal({ winner, onClose }: WinnerModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (winner) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [winner]);

    if (!isOpen || !winner) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm glass-lg rounded-3xl p-8 text-center animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 glass-sm rounded-full p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FaXmark className="h-4 w-4" />
                </button>

                {/* Trophy Icon */}
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-button shadow-glow">
                    <FaTrophy className="h-10 w-10 text-white" />
                </div>

                <h3 className="mb-2 text-2xl font-bold text-gray-800">Chúc mừng!</h3>
                <p className="mb-6 text-gray-500">Kết quả vòng quay là:</p>

                {/* Winner Name */}
                <div className="mb-8 rounded-2xl bg-orange-50 p-5 border border-orange-200">
                    <p className="text-2xl font-bold text-orange-600">{winner}</p>
                </div>

                {/* Continue Button */}
                <button
                    onClick={onClose}
                    className="btn-glass w-full"
                >
                    Tiếp tục chơi
                </button>
            </div>
        </div>
    );
}
