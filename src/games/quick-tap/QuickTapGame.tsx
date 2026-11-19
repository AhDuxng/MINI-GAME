// Màn chơi Nhanh Tay Lẹ Mắt: màn thiết lập số người và điểm thắng, sàn đấu toàn màn hình chia 2 đến 4 góc chạm quay về từng người, vòng tròn giữa hiện luật, đèn, con vật, con số hay chữ màu
'use client';

import { useEffect, type ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { FaHashtag, FaPalette, FaPlay, FaRotateRight, FaTrafficLight, FaTrophy, FaXmark } from 'react-icons/fa6';
import { GiCat, GiChicken, GiDuck, GiFrog, GiPig, GiRabbit, GiSittingDog, GiSnail, GiTropicalFish, GiTurtle } from 'react-icons/gi';
import { ActionBar, GameLayout, GameStage, useFullscreenLock } from '@/games/kit';
import { PlayerPanel, usePlayers } from '@/features/players';
import { FREE_LIMITS } from '@/features/billing';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import SegmentedControl from '@/shared/ui/SegmentedControl';
import { rampFill, rampWash } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';
import { CHALLENGES, COLOR_WORDS, type AnimalId, type ChallengeKind, type Display } from './reflex-rules';
import useQuickTap from './useQuickTap';

const ZONE_STOPS = [3, 7, 1, 5];
const ANIMALS: Record<AnimalId, IconType> = {
  duck: GiDuck,
  frog: GiFrog,
  cat: GiCat,
  dog: GiSittingDog,
  chicken: GiChicken,
  pig: GiPig,
  rabbit: GiRabbit,
  fish: GiTropicalFish,
  snail: GiSnail,
  turtle: GiTurtle,
};
const CHALLENGE_ICONS: Record<ChallengeKind, IconType> = { light: FaTrafficLight, duck: GiDuck, seven: FaHashtag, color: FaPalette };

interface ZoneSpot {
  className: string;
  flipped: boolean;
  key: string;
}

const LAYOUTS: Record<number, { grid: string; zones: ZoneSpot[] }> = {
  2: {
    grid: 'grid-cols-1 grid-rows-2',
    zones: [
      { className: '', flipped: true, key: 'q' },
      { className: '', flipped: false, key: 'm' },
    ],
  },
  3: {
    grid: 'grid-cols-2 grid-rows-2',
    zones: [
      { className: 'col-span-2', flipped: true, key: 'q' },
      { className: '', flipped: false, key: 'z' },
      { className: '', flipped: false, key: 'm' },
    ],
  },
  4: {
    grid: 'grid-cols-2 grid-rows-2',
    zones: [
      { className: '', flipped: true, key: 'q' },
      { className: '', flipped: true, key: 'p' },
      { className: '', flipped: false, key: 'z' },
      { className: '', flipped: false, key: 'm' },
    ],
  },
};

const GOAL_OPTIONS = [3, 5, 7].map((value) => ({ value, label: `${value} điểm` }));
const FLIP = '[@media(pointer:coarse)]:rotate-180';

function Mirrored({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('flex flex-col items-center justify-center gap-1', className)}>
      <span className={cn('hidden [@media(pointer:coarse)]:block', FLIP)}>{children}</span>
      <span>{children}</span>
    </span>
  );
}

function StimulusFace({ display }: { display: Display }) {
  if (display.type === 'light') {
    const label = display.state === 'green' ? 'CHẠM!' : display.state === 'yellow' ? 'Khoan!' : 'Chờ...';
    return <Mirrored className="font-display text-3xl font-extrabold text-white sm:text-4xl">{label}</Mirrored>;
  }
  if (display.type === 'icon') {
    const Icon = ANIMALS[display.animal];
    return <Icon className="h-3/5 w-3/5 text-[#12121a]" aria-label={display.animal} />;
  }
  if (display.type === 'number') {
    return <Mirrored className="font-display text-6xl font-extrabold leading-none text-[#12121a] sm:text-7xl">{display.value}</Mirrored>;
  }
  return (
    <Mirrored className="font-display text-4xl font-extrabold leading-none sm:text-5xl">
      <span style={{ color: COLOR_WORDS[display.ink].ink }}>{COLOR_WORDS[display.word].label}</span>
    </Mirrored>
  );
}

const LIGHT_FILL = { red: '#e5484d', yellow: '#e8b10c', green: '#22a565' };

function Arena({ names, game }: { names: string[]; game: ReturnType<typeof useQuickTap> }) {
  const { arena, tap, exit, start } = game;
  const count = arena.scores.length;
  const layout = LAYOUTS[count] ?? LAYOUTS[2];
  const frame = arena.frames[arena.frame];
  const showing = arena.phase === 'running' && frame;
  const circleFill = showing && frame.display.type === 'light' ? LIGHT_FILL[frame.display.state] : '#ffffff';

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const index = layout.zones.findIndex((zone) => zone.key === event.key.toLowerCase());
      if (index >= 0 && !event.repeat) tap(index);
      if (event.key === 'Escape') exit();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [layout, tap, exit]);

  if (arena.phase === 'over') {
    const ranked = arena.scores.map((score, index) => ({ score, index })).sort((a, b) => b.score - a.score);
    const lowest = Math.min(...arena.scores);
    const losers = ranked.filter((entry) => entry.score === lowest).map((entry) => names[entry.index]);
    return (
      <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-[#140c26] px-6 text-center text-white">
        <FaTrophy className="h-16 w-16" style={{ color: rampFill(1) }} />
        <p className="text-ramp font-display text-5xl font-extrabold">{names[ranked[0].index]} thắng!</p>
        <ol className="w-full max-w-xs space-y-2">
          {ranked.map(({ score, index }, rank) => (
            <li key={index} className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5">
              <span className="h-3 w-3 rounded-full" style={{ background: rampFill(ZONE_STOPS[index]) }} />
              <span className="flex-1 text-left font-display font-bold">
                {rank + 1}. {names[index]}
              </span>
              <span className="font-display text-xl font-extrabold">{score}</span>
            </li>
          ))}
        </ol>
        <p className="font-semibold text-white/80">
          Ít điểm nhất: <strong className="text-white">{losers.join(', ')}</strong>, uống một ngụm nhé!
        </p>
        <div className="flex w-full max-w-xs flex-col gap-2">
          <Button size="lg" onClick={start}>
            <FaRotateRight className="h-4 w-4" />
            Chơi lại
          </Button>
          <Button size="lg" variant="secondary" onClick={exit}>
            Thoát
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] touch-none select-none bg-[#140c26] p-2 [-webkit-touch-callout:none]">
      <div className={cn('grid h-full w-full gap-2', layout.grid)}>
        {layout.zones.slice(0, count).map((zone, index) => {
          const stop = ZONE_STOPS[index];
          const frozen = arena.frozen[index];
          const won = arena.phase === 'result' && arena.winner === index;
          return (
            <button
              key={index}
              type="button"
              onPointerDown={(event) => {
                event.preventDefault();
                tap(index);
              }}
              aria-label={`Vùng chạm của ${names[index]}`}
              className={cn(
                'relative flex items-center justify-center overflow-hidden rounded-3xl border-2 transition-[opacity,transform] duration-150 active:scale-[0.985]',
                zone.className,
                frozen && 'opacity-35',
                won && 'scale-[1.01]',
              )}
              style={{ background: won ? rampFill(stop) : rampWash(stop, 26), borderColor: rampFill(stop) }}
            >
              <span className={cn('flex flex-col items-center gap-1 text-center', zone.flipped && FLIP, won ? 'text-[#12121a]' : 'text-white')}>
                <span className="font-display text-lg font-bold">{names[index]}</span>
                <span className="font-display text-5xl font-extrabold leading-none">{arena.scores[index]}</span>
                <span className="text-xs font-bold opacity-80">{won ? '+1 điểm!' : frozen ? 'Chạm sai, chờ vòng sau' : 'Chạm vào đây'}</span>
                <span className="hidden text-[11px] font-bold opacity-60 [@media(hover:hover)]:inline">Phím {zone.key.toUpperCase()}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 flex h-[min(46vmin,260px)] w-[min(46vmin,260px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-edge p-4 text-center shadow-[0_0_0_10px_rgb(20_12_38),0_20px_60px_rgb(0_0_0/0.5)] transition-colors duration-100"
        style={{ background: arena.phase === 'running' ? circleFill : '#1d1235' }}
      >
        {arena.phase === 'intro' && (
          <Mirrored className="text-white">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-white/60">Vòng {arena.round}</span>
            <span className="block font-display text-lg font-extrabold leading-tight sm:text-xl">{CHALLENGES[arena.kind].rule}</span>
          </Mirrored>
        )}
        {showing && <StimulusFace display={frame.display} />}
        {arena.phase === 'result' && (
          <Mirrored className="font-display text-lg font-extrabold leading-tight text-white sm:text-xl">{arena.winner === null ? arena.note : `${names[arena.winner]} ${arena.note}`}</Mirrored>
        )}
      </div>

      <button
        type="button"
        onClick={exit}
        aria-label="Thoát sàn đấu"
        className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white"
      >
        <FaXmark className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function QuickTapGame() {
  const { players } = usePlayers();
  const live = useQuickTap();
  const playerOptions = [2, 3, 4].map((value) => ({ value, label: value > FREE_LIMITS.reflexPlayers && !live.isVip ? `${value} người 👑` : `${value} người` }));
  const names = Array.from({ length: live.playerCount }, (_, index) => players[index] ?? `Người ${index + 1}`);
  const playing = live.arena.phase !== 'setup';

  useFullscreenLock(playing);

  return (
    <>
      <GameLayout
        main={
          <>
            <GameStage theme="party" onTap={live.start} className="flex min-h-[340px] flex-col items-center justify-center gap-6 px-5 py-8 sm:flex-row sm:gap-10 sm:px-10">
              <div className="relative h-56 w-32 flex-shrink-0 rounded-[28px] border-4 border-edge bg-[#140c26] p-1.5 shadow-[0_24px_40px_-18px_rgba(0,0,0,0.7)]">
                <div className={cn('grid h-full w-full gap-1', (LAYOUTS[live.playerCount] ?? LAYOUTS[2]).grid)}>
                  {(LAYOUTS[live.playerCount] ?? LAYOUTS[2]).zones.map((zone, index) => (
                    <span key={index} className={cn('flex items-center justify-center rounded-2xl border text-[10px] font-bold text-white', zone.className)} style={{ background: rampWash(ZONE_STOPS[index], 30), borderColor: rampFill(ZONE_STOPS[index]) }}>
                      <span className={cn(zone.flipped && 'rotate-180')}>{names[index]}</span>
                    </span>
                  ))}
                </div>
                <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-edge bg-[#22a565] text-[9px] font-extrabold text-white">CHẠM!</span>
              </div>
              <div className="max-w-sm space-y-4 text-center sm:text-left">
                <p className="font-display text-2xl font-extrabold leading-tight text-ink sm:text-3xl">Đặt máy giữa bàn, mỗi người giữ một góc</p>
                <p className="text-sm font-semibold text-muted">Nhìn vòng tròn ở giữa, đúng lúc thì chạm thật nhanh vào góc của mình. Chạm sớm hay chạm sai là bị khoá tới hết vòng.</p>
                <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                  {(Object.keys(CHALLENGES) as ChallengeKind[]).map((kind, index) => {
                    const Icon = CHALLENGE_ICONS[kind];
                    return (
                      <span key={kind} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-ink">
                        <Icon className="h-3.5 w-3.5" style={{ color: rampFill(index * 2 + 1) }} />
                        {CHALLENGES[kind].short}
                      </span>
                    );
                  })}
                </div>
              </div>
            </GameStage>

            <ActionBar>
              <Button size="lg" onClick={live.start}>
                <FaPlay className="h-4 w-4" />
                Vào sàn đấu
              </Button>
            </ActionBar>
          </>
        }
        aside={
          <>
            <Panel title="Thiết lập" stop={7}>
              <div className="space-y-4">
                <SegmentedControl label="Số người chơi" options={playerOptions} value={live.playerCount} onChange={live.setPlayerCount} />
                <SegmentedControl label="Ai đạt trước thì thắng" options={GOAL_OPTIONS} value={live.goal} onChange={live.setGoal} />
              </div>
            </Panel>
            <Panel title="Luật từng vòng" stop={1}>
              <ul className="space-y-3">
                {(Object.keys(CHALLENGES) as ChallengeKind[]).map((kind, index) => {
                  const Icon = CHALLENGE_ICONS[kind];
                  return (
                    <li key={kind} className="flex items-center gap-3">
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[#12121a]" style={{ background: rampFill(index * 2 + 1) }}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold text-ink">{CHALLENGES[kind].rule}</span>
                    </li>
                  );
                })}
              </ul>
            </Panel>
            <PlayerPanel hint="Những người đầu danh sách sẽ giữ các góc màn hình theo thứ tự." />
          </>
        }
      />
      {playing && <Arena names={names} game={live} />}
    </>
  );
}
