// Điều khiển Nhanh Tay Lẹ Mắt: chạy từng vòng theo chuỗi khung hình hẹn giờ, nhận cú chạm của từng góc màn hình, người chạm đúng khung đích trước được điểm, chạm sai bị khoá tới hết vòng; chơi đủ 4 người chung máy là quyền VIP
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSound } from '@/features/settings';
import useLocalStorage from '@/shared/hooks/useLocalStorage';
import { FREE_LIMITS, VIP_LIMITS, useVipAccess } from '@/features/billing';
import { buildRound, nextChallenge, type ChallengeKind, type Frame } from './reflex-rules';

export type ArenaPhase = 'setup' | 'intro' | 'running' | 'result' | 'over';

const INTRO_MS = 1900;
const RESULT_MS = 1900;

interface ArenaState {
  phase: ArenaPhase;
  round: number;
  kind: ChallengeKind;
  frames: Frame[];
  frame: number;
  scores: number[];
  frozen: boolean[];
  winner: number | null;
  note: string;
}

const IDLE: ArenaState = { phase: 'setup', round: 0, kind: 'light', frames: [], frame: 0, scores: [], frozen: [], winner: null, note: '' };

export default function useQuickTap() {
  const { play } = useSound();
  const { isVip, requireVip } = useVipAccess('quick-tap');
  const [savedCount, setSavedCount] = useLocalStorage('quick-tap:players', 2);
  const maxPlayers = isVip ? VIP_LIMITS.reflexPlayers : FREE_LIMITS.reflexPlayers;
  const playerCount = Math.min(savedCount, maxPlayers);
  const setPlayerCount = useCallback(
    (value: number) => {
      if (value > FREE_LIMITS.reflexPlayers && !requireVip(`Chơi ${value} người chung một máy`)) return;
      setSavedCount(value);
    },
    [requireVip, setSavedCount],
  );
  const [goal, setGoal] = useLocalStorage('quick-tap:goal', 5);
  const [arena, setArena] = useState<ArenaState>(IDLE);
  const arenaRef = useRef(arena);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const playRef = useRef(play);
  const goalRef = useRef(goal);
  const finishRef = useRef<(winner: number | null, note: string) => void>(() => undefined);

  useEffect(() => {
    playRef.current = play;
    goalRef.current = goal;
  }, [play, goal]);

  const update = useCallback((patch: Partial<ArenaState>) => {
    arenaRef.current = { ...arenaRef.current, ...patch };
    setArena(arenaRef.current);
  }, []);

  const stop = useCallback(() => clearTimeout(timer.current), []);

  useEffect(() => stop, [stop]);

  const startRound = useCallback(() => {
    const current = arenaRef.current;
    const kind = nextChallenge(current.round > 0 ? current.kind : null);
    const frames = buildRound(kind, current.round);
    update({ phase: 'intro', round: current.round + 1, kind, frames, frame: 0, frozen: current.scores.map(() => false), winner: null, note: '' });

    timer.current = setTimeout(() => {
      update({ phase: 'running', frame: 0 });
      playRef.current('start');
      const step = (index: number) => {
        if (index >= frames.length) {
          finishRef.current(null, 'Không ai kịp chạm!');
          return;
        }
        update({ frame: index });
        timer.current = setTimeout(() => step(index + 1), frames[index].duration);
      };
      step(0);
    }, INTRO_MS);
  }, [update]);

  const finishRound = useCallback(
    (winner: number | null, note: string) => {
      stop();
      const current = arenaRef.current;
      const scores = winner === null ? current.scores : current.scores.map((score, index) => (index === winner ? score + 1 : score));
      update({ phase: 'result', winner, note, scores });
      const done = scores.some((score) => score >= goalRef.current);
      timer.current = setTimeout(() => {
        if (done) {
          update({ phase: 'over' });
          playRef.current('success');
        } else {
          startRound();
        }
      }, RESULT_MS);
    },
    [stop, update, startRound],
  );

  useEffect(() => {
    finishRef.current = finishRound;
  }, [finishRound]);

  const start = useCallback(() => {
    stop();
    arenaRef.current = { ...IDLE, scores: Array(playerCount).fill(0), frozen: Array(playerCount).fill(false) };
    startRound();
  }, [playerCount, stop, startRound]);

  const exit = useCallback(() => {
    stop();
    update(IDLE);
  }, [stop, update]);

  const tap = useCallback(
    (player: number) => {
      const current = arenaRef.current;
      if (current.phase !== 'running' || current.frozen[player]) return;
      if (current.frames[current.frame]?.target) {
        playRef.current('pop');
        finishRound(player, 'nhanh nhất! +1');
        return;
      }
      playRef.current('fail');
      const frozen = current.frozen.map((value, index) => value || index === player);
      update({ frozen });
      if (frozen.every(Boolean)) finishRound(null, 'Cả nhóm chạm sai rồi!');
    },
    [finishRound, update],
  );

  return { arena, playerCount, setPlayerCount, isVip, goal, setGoal, start, exit, tap };
}
