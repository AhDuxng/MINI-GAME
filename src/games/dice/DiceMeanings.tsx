// Bảng giải thích ý nghĩa 6 mặt xí ngầu kèm mẹo chơi
import Panel from '@/shared/ui/Panel';
import { DICE_FACES } from '@/data';
import FaceBadge from './FaceBadge';

export default function DiceMeanings() {
  return (
    <Panel title="Ý nghĩa xí ngầu" stop={1}>
      <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 rounded-xl overflow-hidden">
        {DICE_FACES.map((face) => (
          <li key={face.id} className="flex items-center gap-3 bg-canvas p-3">
            <FaceBadge face={face} />
            <div className="min-w-0">
              <p className="font-display text-base font-bold text-ink">{face.label}</p>
              <p className="text-sm text-muted">{face.description}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 border-l-4 border-ramp-1 bg-elevated px-3 py-2 text-sm text-ink">
        <strong>Mẹo:</strong> lắc vào &quot;Chỉ định&quot; thì chọn người uống nhiều nhất bàn để trả đũa!
      </p>
    </Panel>
  );
}
