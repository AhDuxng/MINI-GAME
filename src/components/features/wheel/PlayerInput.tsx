'use client';

import { FaRotate, FaSliders } from 'react-icons/fa6';
import { useState, useEffect } from 'react';

interface PlayerInputProps {
    players: string[];
    onUpdatePlayers: (newPlayers: string[]) => void;
}

export default function PlayerInput({ players, onUpdatePlayers }: PlayerInputProps) {
    const [text, setText] = useState('');

    useEffect(() => {
        setText(players.join('\n'));
    }, [players]);

    const handleUpdate = () => {
        const newPlayers = text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        onUpdatePlayers(newPlayers);
    };

    return (
        <div className="glass rounded-2xl p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-3 font-bold text-gray-800">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-accent shadow-glow">
                        <FaSliders className="h-5 w-5 text-white" />
                    </span>
                    Cấu hình vòng quay
                </h3>
                <span className="glass-sm rounded-full px-3 py-1 text-xs font-medium text-gray-600">
                    {players.length} mục
                </span>
            </div>

            {/* Textarea */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                    Danh sách người tham gia / Phần thưởng
                </label>
                <div className="relative">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Nhập tên mỗi dòng một người..."
                        className="input-glass min-h-[200px] resize-y"
                    />
                    {text && (
                        <button
                            onClick={() => setText('')}
                            className="absolute bottom-4 right-4 text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                            Xóa hết
                        </button>
                    )}
                </div>
                <p className="text-xs text-gray-400">Nhập mỗi mục trên một dòng mới.</p>
            </div>

            {/* Update Button */}
            <button
                onClick={handleUpdate}
                className="btn-glass w-full flex items-center justify-center gap-2"
            >
                <FaRotate className="h-4 w-4" />
                Cập nhật danh sách
            </button>

            {/* Current List */}
            <div>
                <span className="text-sm font-medium text-gray-600 mb-3 block">Danh sách hiện tại</span>
                <div className="flex flex-wrap gap-2">
                    {players.length > 0 ? (
                        players.map((player, index) => (
                            <span
                                key={index}
                                className="glass-sm inline-flex items-center rounded-lg px-3 py-1.5 text-sm text-gray-700"
                            >
                                <span className={`mr-2 h-2 w-2 rounded-full ${['bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'][index % 4]}`}></span>
                                {player}
                            </span>
                        ))
                    ) : (
                        <span className="text-sm text-gray-400 italic">Danh sách trống...</span>
                    )}
                </div>
            </div>
        </div>
    );
}
