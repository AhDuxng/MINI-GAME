// Ba bước bắt đầu chơi, đánh số trong ô màu theo dải
import SectionTitle from '@/shared/ui/SectionTitle';
import { rampFill } from '@/shared/lib/ramp';

const STEPS = [
  { stop: 1, title: 'Nhập tên một lần', text: 'Danh sách người chơi được lưu lại và dùng chung cho mọi trò.' },
  { stop: 4, title: 'Đặt máy giữa bàn', text: 'Một chiếc điện thoại là đủ, ai đến lượt thì cầm lên bấm.' },
  { stop: 7, title: 'Thua thì chịu phạt', text: 'Mỗi game đều có hình phạt ngẫu nhiên cho người kém may mắn.' },
];

export default function HowItWorks() {
  return (
    <section className="page py-10 md:py-14">
      <SectionTitle title="Bắt đầu trong 1 phút" stop={4} />
      <ol className="grid gap-px border border-line bg-line md:grid-cols-3 rounded-xl overflow-hidden">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-4 bg-canvas p-5 md:p-7">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center font-display text-2xl font-extrabold text-[#12121a] rounded-lg" style={{ background: rampFill(step.stop) }}>
              {index + 1}
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-ink">{step.title}</h3>
              <p className="text-sm text-muted">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
