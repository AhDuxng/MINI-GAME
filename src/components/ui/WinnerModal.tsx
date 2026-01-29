'use client';

import { X, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

interface WinnerModalProps {
    winner: string | null;
    onClose: () => void;
}

// Modal thông báo người chiến thắng
export default function WinnerModal({ winner, onClose }: WinnerModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Đồng bộ trạng thái mở modal khi có kết quả winner
    useEffect(() => {
        if (winner) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [winner]);

    if (!isOpen || !winner) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-yellow-500">
                    <Trophy className="h-8 w-8" />
                </div>

                <h3 className="mb-2 text-2xl font-bold text-gray-900">Chúc mừng!</h3>
                <p className="mb-6 text-gray-500">Kết quả vòng quay là:</p>

                <div className="mb-8 rounded-xl bg-orange-50 p-4">
                    <p className="text-xl font-bold text-orange-600">{winner}</p>
                </div>

                <button
                    onClick={onClose}
                    className="w-full rounded-full bg-orange-500 px-8 py-3 font-bold text-white shadow-lg shadow-orange-200 transition-transform hover:scale-105 hover:bg-orange-600 active:scale-95"
                >
                    Tiếp tục chơi
                </button>
            </div>
        </div>
    );
}
