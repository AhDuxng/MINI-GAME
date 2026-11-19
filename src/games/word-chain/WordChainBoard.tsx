// Màn chơi nối từ đang diễn ra: ô chữ đề bài, người đến lượt, đồng hồ, ô nhập, bác bỏ từ vô nghĩa, người chơi còn lại và các từ đã dùng
'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { FaBan, FaFlag, FaPause, FaPlay, FaXmark } from 'react-icons/fa6';
import { GameLayout, GameStage } from '@/games/kit';
import Badge from '@/shared/ui/Badge';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import { rampFill } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';
import TurnTimer from './TurnTimer';
import WordTiles from './WordTiles';
import type { WordChainState } from './word-chain-state';
import { lastSyllable } from './word-rules';

const REASON_LABELS = { timeout: 'hết giờ', surrender: 'chịu thua', veto: 'bị cả bàn bác bỏ từ' };

interface WordChainBoardProps {
  state: WordChainState;
  currentWord: string | null;
  currentPlayer: string | null;
  winner: string | null;
  timeLeftMs: number;
  onSubmit: (input: string) => boolean;
  onSurrender: () => void;
  onVeto: () => void;
  onTogglePause: () => void;
  onRestart: () => void;
  onExit: () => void;
}

export default function WordChainBoard({
  state,
  currentWord,
  currentPlayer,
  winner,
  timeLeftMs,
  onSubmit,
  onSurrender,
  onVeto,
  onTogglePause,
  onRestart,
  onExit,
}: WordChainBoardProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const playing = state.phase === 'playing';
  const latestElimination = state.eliminations[state.eliminations.length - 1];
  const aliveNames = new Set(state.alive.map((index) => state.roster[index]));
  const nextSyllable = state.mode === 'chain' && currentWord ? lastSyllable(currentWord) : null;
  const lastWord = state.words[state.words.length - 1];
  const canVeto = playing && lastWord?.player != null;

  useEffect(() => {
    if (playing && !state.paused) inputRef.current?.focus();
  }, [playing, state.paused, state.turnId]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (onSubmit(input)) setInput('');
  };

  return (
    <GameLayout
      main={
        <>
          <GameStage theme="chalk" className="flex flex-col items-center gap-5 px-6 py-10 text-center">
            <p className="eyebrow">{state.mode === 'chain' ? 'Từ hiện tại' : 'Chủ đề'}</p>
            {state.mode === 'chain' && currentWord ? (
              <WordTiles key={currentWord} word={currentWord} highlightLast />
            ) : (
              <p className="text-ramp font-display text-title font-extrabold">{state.prompt}</p>
            )}
            <p className="font-semibold text-muted">
              {nextSyllable ? (
                <>
                  Từ tiếp theo bắt đầu bằng <span className="font-display text-xl font-bold text-ink">&ldquo;{nextSyllable}&rdquo;</span>
                </>
              ) : (
                'Kể tên một thứ thuộc chủ đề, không trùng người trước'
              )}
            </p>
          </GameStage>

          {playing ? (
            <div className="surface space-y-5 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-muted">
                  Đến lượt <span className="text-ramp font-display text-2xl font-extrabold">{currentPlayer}</span>
                </p>
                {state.paused && <Badge>Đang tạm dừng</Badge>}
              </div>

              <TurnTimer timeLeftMs={timeLeftMs} totalMs={state.turnSeconds * 1000} />

              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  disabled={state.paused}
                  placeholder={nextSyllable ? `${nextSyllable} ...` : 'Nhập từ của bạn...'}
                  aria-label="Từ của bạn"
                  autoComplete="off"
                  spellCheck={false}
                  className="field h-12 flex-1 font-display text-xl font-bold"
                />
                <Button type="submit" size="lg" disabled={state.paused}>
                  Gửi
                </Button>
              </form>

              {state.error && (
                <p key={state.error.id} role="alert" className="animate-shake text-sm font-bold text-ramp-text-3">
                  {state.error.message}
                </p>
              )}

              <div className="flex flex-wrap gap-2 border-t border-line pt-5">
                <Button variant="danger" size="sm" onClick={onSurrender}>
                  <FaFlag className="h-3 w-3" />
                  Chịu thua
                </Button>
                {canVeto && (
                  <Button variant="danger" size="sm" onClick={onVeto} title="Từ vừa rồi vô nghĩa hoặc sai chủ đề: loại người vừa nói">
                    <FaBan className="h-3 w-3" />
                    Bác bỏ &ldquo;{lastWord?.word}&rdquo;
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={onTogglePause}>
                  {state.paused ? <FaPlay className="h-3 w-3" /> : <FaPause className="h-3 w-3" />}
                  {state.paused ? 'Tiếp tục' : 'Tạm dừng'}
                </Button>
                <Button variant="ghost" size="sm" onClick={onExit}>
                  <FaXmark className="h-3 w-3" />
                  Kết thúc ván
                </Button>
              </div>
            </div>
          ) : (
            <div className="surface flex flex-col items-center gap-4 p-6 text-center">
              <p className="text-lg text-muted">
                Ván đã kết thúc, <strong className="text-ramp font-display text-2xl">{winner}</strong> là người chiến thắng!
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button onClick={onRestart}>Chơi lại</Button>
                <Button variant="secondary" onClick={onExit}>
                  Đổi thiết lập
                </Button>
              </div>
            </div>
          )}

          {latestElimination && (
            <p className="rounded-xl border border-line border-l-4 border-l-ramp-3 bg-elevated px-4 py-3 text-sm text-ink">
              <strong>{latestElimination.player}</strong> bị loại vì {REASON_LABELS[latestElimination.reason]}. Hình phạt:{' '}
              <strong className="text-ramp-text-3">{latestElimination.punishment}</strong>
            </p>
          )}
        </>
      }
      aside={
        <>
          <Panel title="Người chơi" stop={7} action={<Badge>{state.alive.length} còn lại</Badge>}>
            <ul className="divide-y divide-line">
              {state.roster.map((name, index) => {
                const alive = aliveNames.has(name);
                const current = name === currentPlayer;
                return (
                  <li key={name} className={cn('flex items-center gap-3 py-2.5', !alive && 'opacity-45')}>
                    <span
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center font-display text-sm font-bold text-[#12121a] rounded-md"
                      style={{ background: rampFill(index) }}
                    >
                      {index + 1}
                    </span>
                    <span className={cn('flex-1 font-semibold', current ? 'text-ramp font-display text-lg font-bold' : 'text-ink', !alive && 'line-through')}>
                      {name}
                    </span>
                    {current && <Badge tone="new">Đang chơi</Badge>}
                    {!alive && <span className="text-xs font-bold text-ramp-text-3">Bị loại</span>}
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel title="Từ đã dùng" stop={5} action={<Badge>{state.words.length} từ</Badge>}>
            <ol className="scrollbar-soft max-h-80 divide-y divide-line overflow-y-auto">
              {state.words.length === 0 && <li className="py-2 text-sm text-muted">Chưa có từ nào.</li>}
              {[...state.words].reverse().map((entry, index) => (
                <li key={`${entry.word}-${index}`} className="flex items-baseline justify-between gap-3 py-2">
                  <span className="font-display text-base font-bold text-ink">{entry.word}</span>
                  <span className="truncate text-xs font-semibold text-muted">{entry.player ?? 'Từ khởi đầu'}</span>
                </li>
              ))}
            </ol>
          </Panel>
        </>
      }
    />
  );
}
