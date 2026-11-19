// Mô phỏng cuộc đua thuần: mỗi nhịp vịt tiến một bước ngẫu nhiên, thỉnh thoảng tăng tốc hoặc trượt chân
import { randomBetween } from '@/shared/lib/random';

export const FINISH_LINE = 100;
export const TICK_MS = 120;

const STEP_MIN = 0.35;
const STEP_MAX = 2;
const EVENT_CHANCE = 0.015;
const BOOST_DISTANCE = 6;
const SLIP_DISTANCE = 4;

export type RaceEventKind = 'boost' | 'slip';

export interface RaceEvent {
  racer: number;
  kind: RaceEventKind;
}

export interface RaceState {
  positions: number[];
  finishOrder: number[];
}

export function createRace(racerCount: number): RaceState {
  return { positions: Array(racerCount).fill(0), finishOrder: [] };
}

export function isRaceOver(race: RaceState) {
  return race.positions.length > 0 && race.finishOrder.length === race.positions.length;
}

export function leaderOf(race: RaceState) {
  return race.positions.reduce((best, position, index) => (position > race.positions[best] ? index : best), 0);
}

export function advanceRace(race: RaceState): { race: RaceState; events: RaceEvent[] } {
  const events: RaceEvent[] = [];

  const rawPositions = race.positions.map((position, racer) => {
    if (position >= FINISH_LINE) return position;

    let step = randomBetween(STEP_MIN, STEP_MAX);
    if (Math.random() < EVENT_CHANCE) {
      const kind: RaceEventKind = Math.random() < 0.5 ? 'boost' : 'slip';
      events.push({ racer, kind });
      step += kind === 'boost' ? BOOST_DISTANCE : -SLIP_DISTANCE;
    }
    return Math.max(0, position + step);
  });

  const newlyFinished = rawPositions
    .map((position, racer) => ({ position, racer }))
    .filter(({ position, racer }) => position >= FINISH_LINE && !race.finishOrder.includes(racer))
    .sort((a, b) => b.position - a.position)
    .map(({ racer }) => racer);

  return {
    race: {
      positions: rawPositions.map((position) => Math.min(position, FINISH_LINE)),
      finishOrder: [...race.finishOrder, ...newlyFinished],
    },
    events,
  };
}
