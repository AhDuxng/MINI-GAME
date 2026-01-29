import { Beer, GlassWater, Droplets, User, RotateCcw, Users } from 'lucide-react';

export const DICE_FACES = [
    { id: 1, label: 'Cạn ly', desc: 'Uống hết 100% ly', icon: Beer, color: 'text-orange-600', bg: 'bg-orange-100' },
    { id: 2, label: 'Nửa ly', desc: 'Uống 50% ly', icon: GlassWater, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { id: 3, label: 'Nhấp môi', desc: 'Chỉ uống 1 ngụm nhỏ', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 4, label: 'Chỉ định', desc: 'Mời 1 người uống', icon: User, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 5, label: 'Qua lượt', desc: 'May mắn, bạn thoát!', icon: RotateCcw, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 6, label: 'Đồng khởi', desc: 'Tất cả cùng uống!', icon: Users, color: 'text-red-600', bg: 'bg-red-100' },
];

export default function DiceMeanings() {
    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 h-full">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
                Ý nghĩa Xí ngầu
            </h3>
            <div className="space-y-6">
                {DICE_FACES.map((face) => (
                    <div key={face.id} className="flex items-start gap-4">
                        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${face.bg} ${face.color}`}>
                            <face.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{face.label}</p>
                            <p className="text-sm text-gray-500">{face.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 rounded-xl bg-orange-50 p-4">
                <div className="mb-2 flex items-center gap-2 font-bold text-orange-700">
                    <span className="text-xl">💡</span> MẸO VUI
                </div>
                <p className="text-sm text-orange-800">
                    Nếu lắc vào "Chỉ định", bạn có quyền chọn người uống nhiều nhất bàn để "trả đũa"!
                </p>
            </div>
        </div>
    );
}
