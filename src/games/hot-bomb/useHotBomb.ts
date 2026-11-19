// Điều khiển Bom Nổ Chậm: châm ngòi với thời gian nổ ẩn ngẫu nhiên, tích tắc nhanh dần, chuyền bom và chốt người thua khi bom nổ
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSound } from '@/features/settings';
import { BOMB_TOPICS, PUNISHMENTS } from '@/data';
import useLocalStorage from '@/shared/hooks/useLocalStorage';
import { useVipAccess } from '@/features/billing';
import { pickRandom, randomBetween, randomInt } from '@/shared/lib/random';
import { FUSES, type FuseId } from './fuses';

export type BombPhase = 'idle' | 'burning' | 'exploded';

const TICK_SLOW_MS = 720;
const TICK_FAST_MS = 110;

function pickTopic(previous: string | null) {
  const options = BOMB_TOPICS.filter((topic) => topic !== previous);
  return pickRandom(options.length > 0 ? options : BOMB_TOPICS);
}

export default function useHotBomb(players: string[]) {
  const { play } = useSound();
  const { requestRound } = useVipAccess('hot-bomb');
  const [fuseId, setFuseId] = useLocalStorage<FuseId>('hot-bomb:fuse', 'medium');
  const [phase, setPhase] = useState<BombPhase>('idle');
  const [topic, setTopic] = useState<string | null>(null);
  const [holder, setHolder] = useState(0);
  const [passes, setPasses] = useState(0);
  const [loser, setLoser] = useState<string | null>(null);
  const [punishment, setPunishment] = useState('');
  const [resultOpen, setResultOpen] = useState(false);
  const [tally, setTally] = useState<Record<string, number>>({});

  const startedAt = useRef(0);
  const fuseMaxMs = useRef(FUSES.medium.max * 1000);
  const holderRef = useRef(0);
  const playersRef = useRef(players);
  const playRef = useRef(play);
  const explodeTimer = useRef<ReturnType<typeof setTimeout>>();
  const tickTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  useEffect(() => {
    playRef.current = play;
  }, [play]);

  const stopTimers = useCallback(() => {
    clearTimeout(explodeTimer.current);
    clearTimeout(tickTimer.current);
  }, []);

  useEffect(() => stopTimers, [stopTimers]);

  const getHeat = useCallback(
    () => (startedAt.current === 0 ? 0 : Math.min((performance.now() - startedAt.current) / fuseMaxMs.current, 1)),
    [],
  );

  const explode = useCallback(() => {
    stopTimers();
    const list = playersRef.current;
    const name = list.length >= 2 ? list[holderRef.current % list.length] : null;
    setPhase('exploded');
    setLoser(name);
    setPunishment(pickRandom(PUNISHMENTS));
    if (name) setTally((current) => ({ ...current, [name]: (current[name] ?? 0) + 1 }));
    setResultOpen(true);
    playRef.current('fail');
  }, [stopTimers]);

  const light = useCallback(() => {
    if (phase === 'burning' || !requestRound()) return;
    const range = FUSES[fuseId];
    const list = playersRef.current;
    const first = list.length >= 2 ? randomInt(list.length) : 0;

    stopTimers();
    holderRef.current = first;
    fuseMaxMs.current = range.max * 1000;
    startedAt.current = performance.now();
    setHolder(first);
    setPasses(0);
    setLoser(null);
    setResultOpen(false);
    setTopic((previous) => pickTopic(previous));
    setPhase('burning');

    explodeTimer.current = setTimeout(explode, randomBetween(range.min, range.max) * 1000);
    const scheduleTick = () => {
      const delay = TICK_SLOW_MS - (TICK_SLOW_MS - TICK_FAST_MS) * getHeat();
      tickTimer.current = setTimeout(() => {
        playRef.current('tick');
        scheduleTick();
      }, delay);
    };
    scheduleTick();
    playRef.current('start');
  }, [phase, requestRound, fuseId, stopTimers, explode, getHeat]);

  const pass = useCallback(() => {
    if (phase !== 'burning') return;
    const count = playersRef.current.length;
    if (count >= 2) {
      holderRef.current = (holderRef.current + 1) % count;
      setHolder(holderRef.current);
    }
    setPasses((current) => current + 1);
    playRef.current('pop');
  }, [phase]);

  const closeResult = useCallback(() => setResultOpen(false), []);

  const holderName = players.length >= 2 ? players[holder % players.length] : null;

  return {
    phase,
    topic,
    holderName,
    passes,
    loser,
    punishment,
    resultOpen,
    tally,
    fuseId,
    setFuseId,
    getHeat,
    light,
    pass,
    closeResult,
  };
}
