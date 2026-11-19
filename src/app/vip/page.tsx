// Trang gói VIP: các mức giá, so sánh quyền lợi miễn phí và VIP, câu hỏi thường gặp
import type { Metadata } from 'next';
import { FaCheck, FaCrown, FaMinus } from 'react-icons/fa6';
import { MembershipStatus, PlanCard, FREE_LIMITS, VIP_LIMITS, VIP_TASTE_MINUTES, UPGRADE_WINDOW_DAYS, PLANS } from '@/features/billing';
import { GAMES } from '@/features/catalog';
import SectionTitle from '@/shared/ui/SectionTitle';

export const metadata: Metadata = {
  title: 'Gói VIP',
  description: 'Mở khoá toàn bộ trò chơi và nội dung nâng cao của VuiChơi cho cả bàn chỉ từ 9.000đ, không cần tài khoản.',
};

const COMPARISON: { feature: string; free: string | boolean; vip: string | boolean }[] = [
  { feature: `${GAMES.filter((game) => !game.vip && game.category !== 'online').length} game chơi chung một máy (Vòng quay, Xí ngầu, Đua vịt, Đoán trên trán...)`, free: true, vip: true },
  { feature: 'Bầu Cua, Gián Điệp, Bom Nổ Chậm', free: `Thử ${FREE_LIMITS.trialRoundsPerDay} lượt/ngày`, vip: 'Không giới hạn' },
  { feature: 'Mức "Cháy": Thật hay Thách, Tôi Chưa Từng, Chỉ Mặt Đặt Tên, Này Hay Kia', free: false, vip: true },
  { feature: 'Bộ từ Gen Z, Bàn nhậu (Đoán Trên Trán) và Thành ngữ (Vẽ Nhanh Đoán Lẹ)', free: false, vip: true },
  { feature: 'Số vịt tối đa trong Đua Vịt', free: `${FREE_LIMITS.duckRacers} vịt`, vip: `${VIP_LIMITS.duckRacers} vịt` },
  { feature: 'Số người quanh bàn Xoay Chai', free: `${FREE_LIMITS.bottleSeats} người`, vip: `${VIP_LIMITS.bottleSeats} người` },
  { feature: 'Số người chung máy trong Nhanh Tay Lẹ Mắt', free: `${FREE_LIMITS.reflexPlayers} người`, vip: `${VIP_LIMITS.reflexPlayers} người` },
  { feature: 'Ma Sói Online, danh sách người chơi dùng chung', free: true, vip: true },
  { feature: 'Không quảng cáo', free: true, vip: true },
];

const FAQ = [
  { question: 'Một người mua thì cả bàn chơi được không?', answer: 'Được. VIP mở trên máy của người mua, cả nhóm chơi chung trên máy đó. Bàn 6 người thì Vé Đêm Tiệc chỉ khoảng 1.500đ mỗi người.' },
  { question: 'Mua Vé Đêm Tiệc có cần tài khoản không?', answer: 'Không. Bạn quét mã VietQR là vé chạy ngay trên trình duyệt đang dùng, trong 24 giờ. Gói Tháng và Trọn Đời cần tài khoản để dùng được trên mọi máy.' },
  { question: 'Có được thử trước không?', answer: `Có. Mỗi máy được chơi thử toàn bộ VIP miễn phí ${VIP_TASTE_MINUTES} phút một lần, và mỗi game VIP có ${FREE_LIMITS.trialRoundsPerDay} lượt thử mỗi ngày.` },
  { question: 'Mua vé rồi muốn lên Gói Tháng thì sao?', answer: `Trong ${UPGRADE_WINDOW_DAYS} ngày sau khi mua Vé Đêm Tiệc bằng tài khoản, tiền vé được trừ thẳng vào giá Gói Tháng hoặc Trọn Đời. Mua vé trước không bao giờ phí tiền.` },
  { question: 'Thanh toán bằng cách nào?', answer: 'Chọn gói rồi quét mã VietQR bằng app ngân hàng bất kỳ. Hệ thống tự nhận tiền qua nội dung chuyển khoản và kích hoạt gói, thường chỉ sau vài giây.' },
  { question: 'Gói có tự động gia hạn không?', answer: 'Không. Mọi gói đều trả trước một lần, hết hạn thì tự trở về bản miễn phí, không trừ tiền thêm.' },
  { question: 'Chuyển khoản rồi mà chưa thấy kích hoạt?', answer: 'Hãy kiểm tra nội dung chuyển khoản có đúng mã đơn không. Nếu sai hoặc thiếu, liên hệ hỗ trợ kèm mã đơn để được kích hoạt thủ công.' },
  { question: 'Bầu Cua có cược tiền thật không?', answer: 'Không. Bầu Cua chỉ dùng điểm ảo để vui, không quy đổi thành tiền hay hiện vật.' },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <FaCheck className="mx-auto h-4 w-4 text-ramp-text-8" aria-label="Có" />;
  if (value === false) return <FaMinus className="mx-auto h-4 w-4 text-muted" aria-label="Không" />;
  return <span className="text-sm font-bold text-ink">{value}</span>;
}

export default function VipPage() {
  return (
    <div className="page space-y-14 pb-28 pt-8 md:py-12">
      <header className="space-y-3 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center bg-ramp-1 text-[#12121a] rounded-xl">
          <FaCrown className="h-8 w-8" />
        </span>
        <h1 className="font-display text-4xl font-extrabold text-ink md:text-5xl">
          VuiChơi <span className="text-ramp">VIP</span>
        </h1>
        <p className="mx-auto max-w-xl text-muted">Một người mua, cả bàn cùng chơi. Vé tối nay chỉ 9.000đ, quét mã là mở, không cần tài khoản, không tự gia hạn.</p>
      </header>

      <MembershipStatus />

      <section className="grid gap-6 pt-3 md:grid-cols-3">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </section>

      <section>
        <SectionTitle title="Miễn phí và VIP khác gì?" stop={1} />
        <div className="overflow-x-auto border border-line rounded-xl">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="bg-elevated font-display text-base">
                <th className="px-4 py-3 font-bold text-ink">Quyền lợi</th>
                <th className="w-32 px-4 py-3 text-center font-bold text-ink">Miễn phí</th>
                <th className="w-32 bg-ramp-1 px-4 py-3 text-center font-bold text-[#12121a]">VIP</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.feature} className="border-t border-line">
                  <td className="px-4 py-3 text-sm font-semibold text-ink">{row.feature}</td>
                  <td className="px-4 py-3 text-center">
                    <Cell value={row.free} />
                  </td>
                  <td className="bg-[color-mix(in_srgb,var(--ramp-1)_10%,transparent)] px-4 py-3 text-center">
                    <Cell value={row.vip} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24">
        <SectionTitle title="Câu hỏi thường gặp" stop={7} />
        <div className="divide-y divide-line border border-line rounded-xl overflow-hidden">
          {FAQ.map((item) => (
            <details key={item.question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-display text-lg font-bold text-ink">
                {item.question}
                <span className="text-2xl leading-none text-muted transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="px-5 pb-5 text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
