'use client';

import { RotateCcw, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PlayerInputProps {
    players: string[];
    onUpdatePlayers: (newPlayers: string[]) => void;
}

// Component nhập liệu danh sách người chơi (Bulk Input)
export default function PlayerInput({ players, onUpdatePlayers }: PlayerInputProps) {
    const [text, setText] = useState('');

    // Đồng bộ text với danh sách người chơi hiện tại khi component mount hoặc players thay đổi từ bên ngoài
    useEffect(() => {
        setText(players.join('\n'));
    }, [players]);

    // Xử lý cập nhật danh sách
    const handleUpdate = () => {
        // Tách chuỗi theo dòng, loại bỏ khoảng trắng thừa và dòng trống
        const newPlayers = text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        onUpdatePlayers(newPlayers);
    };

    // Xử lý xóa hết
    const handleClear = () => {
        setText('');
        onUpdatePlayers([]);
    };

    return (
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-bold text-gray-900">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="14" y1="4" y2="4" /><line x1="10" x2="3" y1="4" y2="4" /><line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" /><line x1="21" x2="6" y1="20" y2="20" /><line x1="2" x2="2" y1="20" y2="20" /></svg>
                    </span>
                    Cấu hình vòng quay
                </h3>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    {players.length} mục
                </span>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    Danh sách người tham gia / Phần thưởng
                </label>
                <div className="relative">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Nhập tên mỗi dòng một người..."
                        className="min-h-[200px] w-full resize-y rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                    {text && (
                        <button
                            onClick={() => setText('')}
                            className="absolute bottom-4 right-4 text-xs text-gray-400 hover:text-red-500"
                        >
                            Xóa hết
                        </button>
                    )}
                </div>
                <p className="text-xs text-gray-400">Nhập mỗi mục trên một dòng mới.</p>
            </div>

            <button
                onClick={handleUpdate}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800"
            >
                <RotateCcw className="h-4 w-4" />
                Cập nhật danh sách
            </button>

            <div className="mt-2">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Danh sách hiện tại</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {players.length > 0 ? (
                        players.map((player, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700"
                            >
                                <span className={`mr-1.5 h-2 w-2 rounded-full ${['bg-orange-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][index % 4]}`}></span>
                                {player}
                            </span>
                        ))
                    ) : (
                        <span className="text-sm text-gray-400 italic">Danh sách trống...</span>
                    )}
                    <button className="inline-flex items-center rounded-lg border border-dashed border-gray-300 px-3 py-1 text-sm text-gray-400 hover:border-orange-300 hover:text-orange-500">
                        + Thêm
                    </button>
                </div>
            </div>
        </div>
    );
}
