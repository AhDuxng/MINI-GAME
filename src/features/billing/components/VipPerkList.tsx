// Danh sách quyền lợi VIP có con số đếm thật từ dữ liệu game; tách thành component riêng để chỉ tải khi màn khoá hoặc hộp thoại mua thật sự hiện ra
import { FaCheck } from 'react-icons/fa6';
import { VIP_PERKS } from '../vip-perks';

export default function VipPerkList() {
  return (
    <ul className="space-y-1.5 text-left text-sm font-semibold text-ink">
      {VIP_PERKS.map((perk) => (
        <li key={perk} className="flex gap-2">
          <FaCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-ramp-text-8" />
          {perk}
        </li>
      ))}
    </ul>
  );
}
