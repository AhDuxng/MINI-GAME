// Điều khiển cuộc đua vịt: đếm ngược, chạy vòng lặp mô phỏng, bình luận diễn biến và chốt người về chót chịu phạt
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSound } from '@/features/settings';
import { PUNISHMENTS } from '@/data';
import { pickRandom } from '@/shared/lib/random';
import { TICK_MS, advanceRace, createRace, isRaceOver, leaderOf, type RaceEvent, type RaceState } from './race-engine';

const COUNTDOWN_FROM = 3;
const LEAD_CHANGE_QUIET_MS = 1500;
const IDLE_COMMENTARY = 'Các chú vịt đã vào vị trí xuất phát!';

export type RacePhase = 'ready' | 'countdown' | 'racing' | 'finished';

function describeEvent(event: RaceEvent, racers: string[]) {
  const name = racers[event.racer];
  return event.kind === 'boost' ? `${name} bất ngờ tăng tốc! 🚀` : `${name} trượt chân, lùi lại! 😵`;
}

export default function useDuckRace(racers: string[]) {
  const { play } = useSound();
  const [phase, setPhase] = useState<RacePhase>('ready');
  const [countdown, setCountdown] = useState(COUNTDOWN_FROM);
  const [race, setRace] = useState<RaceState>(() => createRace(racers.length));
  const [commentary, setCommentary] = useState(IDLE_COMMENTARY);
  const [punishment, setPunishment] = useState('');
  const [resultOpen, setResultOpen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const raceRef = useRef(race);
  const racersRef = useRef(racers);
  const leaderRef = useRef(-1);
  const lastCommentaryAt = useRef(0);
  const tickRef = useRef<() => void>(() => undefined);

  const stopTimer = useCallback(() => clearInterval(timerRef.current), []);

  useEffect(() => stopTimer, [stopTimer]);

  const loadRace = useCallback((next: RaceState) => {
    raceRef.current = next;
    setRace(next);
  }, []);

  const announce = useCallback((text: string, force = true) => {
    const now = Date.now();
    if (!force && now - lastCommentaryAt.current < LEAD_CHANGE_QUIET_MS) return;
    lastCommentaryAt.current = now;
    setCommentary(text);
  }, []);

  const reset = useCallback(() => {
    stopTimer();
    loadRace(createRace(racers.length));
    setPhase('ready');
    setCommentary(IDLE_COMMENTARY);
    setResultOpen(false);
  }, [racers.length, stopTimer, loadRace]);

  const racersKey = racers.join('\n');
  useEffect(() => {
    reset();
  }, [reset, racersKey]);

  const finishRace = useCallback(() => {
    stopTimer();
    setPhase('finished');
    setPunishment(pickRandom(PUNISHMENTS));
    setResultOpen(true);
    play('success');
  }, [play, stopTimer]);

  useEffect(() => {
    tickRef.current = () => {
      const previous = raceRef.current;
      const { race: next, events } = advanceRace(previous);
      const names = racersRef.current;
      const leader = leaderOf(next);
      loadRace(next);

      if (previous.finishOrder.length === 0 && next.finishOrder.length > 0) {
        announce(`${names[next.finishOrder[0]]} cán đích đầu tiên! 🏆`);
      } else if (events.length > 0) {
        announce(describeEvent(events[0], names));
      } else if (next.finishOrder.length === 0 && leader !== leaderRef.current) {
        announce(`${names[leader]} vươn lên dẫn đầu!`, false);
      }
      leaderRef.current = leader;

      if (isRaceOver(next)) {
        announce(`${names[next.finishOrder[next.finishOrder.length - 1]]} về chót, chuẩn bị chịu phạt! 😈`);
        finishRace();
      }
    };
  }, [announce, finishRace, loadRace]);

  const start = useCallback(() => {
    if (racers.length < 2 || phase === 'countdown' || phase === 'racing') return;

    racersRef.current = racers;
    leaderRef.current = -1;
    loadRace(createRace(racers.length));
    setResultOpen(false);
    setPhase('countdown');
    setCountdown(COUNTDOWN_FROM);
    setCommentary('Chuẩn bị...');
    play('tick');

    let remaining = COUNTDOWN_FROM;
    timerRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        setCountdown(remaining);
        play('tick');
        return;
      }
      clearInterval(timerRef.current);
      setPhase('racing');
      announce('Xuất phát! 🦆💨');
      play('start');
      timerRef.current = setInterval(() => tickRef.current(), TICK_MS);
    }, 1000);
  }, [racers, phase, play, loadRace, announce]);

  const closeResult = useCallback(() => setResultOpen(false), []);

  return {
    phase,
    countdown,
    race,
    ranking: race.finishOrder.map((racer) => racers[racer]),
    commentary,
    punishment,
    resultOpen,
    isRunning: phase === 'countdown' || phase === 'racing',
    start,
    reset,
    closeResult,
  };
}
