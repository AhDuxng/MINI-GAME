import { FaBeer } from 'react-icons/fa';
import { FaGlassWater, FaDroplet, FaUser, FaRotate, FaUsers } from 'react-icons/fa6';

export const DICE_FACES = [
    { id: 1, label: 'Cạn ly', desc: 'Uống hết 100% ly', icon: FaBeer, color: 'text-orange-600', bg: 'bg-orange-100' },
    { id: 2, label: 'Nửa ly', desc: 'Uống 50% ly', icon: FaGlassWater, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { id: 3, label: 'Nhấp môi', desc: 'Chỉ uống 1 ngụm nhỏ', icon: FaDroplet, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 4, label: 'Chỉ định', desc: 'Mời 1 người uống', icon: FaUser, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 5, label: 'Qua lượt', desc: 'May mắn, bạn thoát!', icon: FaRotate, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 6, label: 'Đồng khởi', desc: 'Tất cả cùng uống!', icon: FaUsers, color: 'text-red-600', bg: 'bg-red-100' },
];

export default function DiceMeanings() {
    return (
        <div className="glass rounded-2xl p-6 h-full">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-800">
                Ý nghĩa Xí ngầu
            </h3>
            <div className="space-y-3">
                {DICE_FACES.map((face) => (
                    <div key={face.id} className="glass-sm flex items-start gap-4 rounded-xl p-3 transition-all hover:bg-orange-50">
                        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${face.bg} ${face.color}`}>
                            <face.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">{face.label}</p>
                            <p className="text-sm text-gray-500">{face.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tip Box */}
            <div className="mt-6 rounded-xl bg-orange-50 p-4 border border-orange-200">
                <div className="mb-2 flex items-center gap-2 font-bold text-orange-600">
                    <span className="text-xl">💡</span> MẸO VUI
                </div>
                <p className="text-sm text-gray-600">
                    Nếu lắc vào "Chỉ định", bạn có quyền chọn người uống nhiều nhất bàn để "trả đũa"!
                </p>
            </div>
        </div>
    );
}
