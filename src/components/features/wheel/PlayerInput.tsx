'use client';

import { Trash2, Plus, Users } from 'lucide-react';
import { useState } from 'react';

interface PlayerInputProps {
    players: string[];
    onAddPlayer: (name: string) => void;
    onRemovePlayer: (index: number) => void;
}

// Component xử lý danh sách người chơi: Thêm, Xóa, Hiển thị
export default function PlayerInput({ players, onAddPlayer, onRemovePlayer }: PlayerInputProps) {
    const [name, setName] = useState('');

    // Xử lý thêm người chơi mới
    const handleAdd = () => {
        if (name.trim()) {
            onAddPlayer(name.trim());
            setName('');
        }
    };

    // Thêm nhanh bằng phím Enter
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAdd();
        }
    };

    return (
        <div className="flex select-none flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-bold text-gray-900">
                    <Users className="h-5 w-5 text-orange-500" />
                    Danh sách ({players.length})
                </h3>
            </div>

            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tên người chơi..."
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                <button
                    onClick={handleAdd}
                    disabled={!name.trim()}
                    className="flex items-center justify-center rounded-xl bg-gray-900 px-4 text-white hover:bg-gray-800 disabled:opacity-50"
                >
                    <Plus className="h-5 w-5" />
                </button>
            </div>

            <div className="flex h-[300px] flex-col gap-2 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200">
                {players.length === 0 ? (
                    // Hiển thị trạng thái trống nếu chưa có ai
                    <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
                        <p className="text-sm">Chưa có người chơi nào.</p>
                        <p className="text-xs">Hãy thêm ít nhất 2 người!</p>
                    </div>
                ) : (
                    players.map((player, index) => (
                        <div
                            key={index}
                            className="group flex items-center justify-between rounded-lg border border-gray-100 bg-white p-3 transition-colors hover:border-orange-200 hover:bg-orange-50"
                        >
                            <span className="font-medium text-gray-700">{player}</span>
                            <button
                                onClick={() => onRemovePlayer(index)}
                                className="opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
