// Thanh trạng thái của ván: tên pha, ngày thứ mấy, lời dẫn của quản trò, đồng hồ đếm ngược theo giờ máy chủ và số người còn sống
'use client';

import { GiCampfire, GiCrossbow, GiHangingSign, GiMoon, GiSunrise } from 'react-icons/gi';
import { FaHourglassHalf } from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import { cn } from '@/shared/lib/utils';
import type { NightStep } from '../engine/roles';
import { HUNTER_SECONDS, REVEAL_SECONDS, STEP_SECONDS, VERDICT_SECONDS, VOTE_SECONDS } from '../engine/setup';
import type { RoomView } from '../engine/types';
import usePhaseClock from '../usePhaseClock';

export const STEP_NARRATION: Record<NightStep, { title: string; line: string }> = {
  guard: { title: 'Bảo Vệ thức dậy', line: 'Bảo Vệ chọn một người để che chở đêm nay.' },
  wolves: { title: 'Bầy sói thức dậy', line: 'Những con sói mở mắt, nhìn nhau và chọn con mồi.' },
  seer: { title: 'Tiên Tri thức dậy', line: 'Tiên Tri nhìn vào quả cầu và soi một người.' },
  witch: { title: 'Phù Thủy thức dậy', line: 'Phù Thủy xem ai bị cắn và quyết định dùng bình.' },
};

function phaseTotal(view: RoomView) {
  const { phase } = view;
  switch (phase.kind) {
    case 'reveal':
      return REVEAL_SECONDS;
    case 'night':
      return STEP_SECONDS[phase.step];
    case 'day':
      return view.settings.discussionSeconds;
    case 'vote':
      return VOTE_SECONDS;
    case 'verdict':
      return VERDICT_SECONDS;
    case 'hunter':
      return HUNTER_SECONDS;
    default:
      return 1;
  }
}

function phaseCopy(view: RoomView): { icon: IconType; title: string; line: string } {
  const { phase, round } = view;
  switch (phase.kind) {
    case 'reveal':
      return { icon: GiCampfire, title: 'Nhận vai', line: 'Nhấn giữ lá bài để xem vai, xong thì bấm Đã xem vai.' };
    case 'night':
      return { icon: GiMoon, title: `Đêm ${round}`, line: STEP_NARRATION[phase.step].line };
    case 'day':
      return { icon: GiSunrise, title: `Ngày ${round} · Thảo luận`, line: 'Cả làng bàn bạc xem ai đáng nghi nhất.' };
    case 'vote':
      return { icon: GiHangingSign, title: `Ngày ${round} · Bỏ phiếu`, line: 'Chọn người muốn treo cổ, hoặc bỏ qua nếu chưa chắc.' };
    case 'verdict':
      return { icon: GiHangingSign, title: `Ngày ${round} · Phán quyết`, line: 'Kết quả bỏ phiếu của cả làng.' };
    case 'hunter':
      return { icon: GiCrossbow, title: 'Thợ Săn ngắm bắn', line: 'Thợ Săn vừa ngã xuống và được kéo theo một người.' };
    default:
      return { icon: GiCampfire, title: 'Phòng chờ', line: '' };
  }
}

export default function PhaseBanner({ view, serverNow }: { view: RoomView; serverNow: () => number }) {
  const endsAt = 'endsAt' in view.phase ? view.phase.endsAt : 0;
  const { seconds, progress } = usePhaseClock(endsAt, phaseTotal(view), serverNow);
  const { icon: Icon, title, line } = phaseCopy(view);
  const alive = view.players.filter((player) => player.alive).length;
  const urgent = seconds !== null && seconds <= 10;

  return (
    <section className="surface overflow-hidden">
      <div className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
        <span className="fill-ramp flex h-12 w-12 flex-shrink-0 items-center justify-center sm:h-14 sm:w-14 rounded-lg">
          <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-extrabold leading-tight text-ink sm:text-2xl">{title}</h2>
          <p className="text-sm text-muted">{line}</p>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          {seconds !== null && (
            <span className={cn('flex items-center gap-1.5 font-display text-2xl font-extrabold tabular-nums', urgent ? 'animate-pulse text-ramp-text-3' : 'text-ink')}>
              <FaHourglassHalf className="h-4 w-4" />
              {seconds}s
            </span>
          )}
          <span className="whitespace-nowrap text-xs font-bold text-muted">
            {alive}/{view.players.length} còn sống
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-elevated">
        <div className="rule-ramp h-full transition-[width] duration-300 ease-linear" style={{ width: `${(1 - progress) * 100}%` }} />
      </div>
    </section>
  );
}
