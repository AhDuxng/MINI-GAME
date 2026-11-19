// Bố cục thuần của hồ đua vịt: kích thước đường đua, khối đất hai bờ theo hướng màn hình, và vị trí ngẫu nhiên có hạt giống của cây, bụi, cỏ, hoa, đá, lau sậy, lá súng, cờ dây để cảnh dựng lại luôn giống nhau
import * as THREE from 'three';
import { FINISH_LINE } from './race-engine';

export const TRACK_LENGTH = 24;
export const START_X = -TRACK_LENGTH / 2;
export const FINISH_X = START_X + TRACK_LENGTH;
export const LANE_GAP = 1.7;
export const WATER_MARGIN = 1.8;
export const BANK_TOP = 0.32;
export const GROUND_DEPTH = 1.4;
export const CANAL_START = START_X - 4;
export const CANAL_END = FINISH_X + 4;

const FAR_BANK_WIDE = 5;
const FAR_BANK_TALL = 14;
const NEAR_BANK = 14;
const LAND_BEFORE = 40;
const LAND_AFTER_WIDE = 40;
const LAND_AFTER_TALL = 7;

export type Vec3 = [number, number, number];

export interface Placement {
  position: Vec3;
  scale: Vec3;
  rotation?: Vec3;
  color?: string;
}

export interface LilyPad {
  x: number;
  z: number;
  size: number;
  turn: number;
  bloom: boolean;
}

export interface PondLand {
  halfCanal: number;
  farEdge: number;
  nearEdge: number;
  start: number;
  end: number;
}

export const laneZ = (index: number, count: number) => (index - (count - 1) / 2) * LANE_GAP;
export const trackX = (position: number) => START_X + (position / FINISH_LINE) * TRACK_LENGTH;

export function pondLand(halfWidth: number, portrait: boolean): PondLand {
  const halfCanal = halfWidth + WATER_MARGIN;
  return {
    halfCanal,
    farEdge: -(halfCanal + (portrait ? FAR_BANK_TALL : FAR_BANK_WIDE)),
    nearEdge: halfCanal + NEAR_BANK,
    start: CANAL_START - LAND_BEFORE,
    end: CANAL_END + (portrait ? LAND_AFTER_TALL : LAND_AFTER_WIDE),
  };
}

export function landBlocks(land: PondLand) {
  const height = BANK_TOP + GROUND_DEPTH;
  const y = BANK_TOP - height / 2;
  const length = land.end - land.start;
  const middle = (land.start + land.end) / 2;
  const farWidth = -land.halfCanal - land.farEdge;
  const nearWidth = land.nearEdge - land.halfCanal;
  const blocks: { size: Vec3; position: Vec3 }[] = [
    { size: [length, height, farWidth], position: [middle, y, land.farEdge + farWidth / 2] },
    { size: [length, height, nearWidth], position: [middle, y, land.halfCanal + nearWidth / 2] },
    { size: [CANAL_START - land.start, height, land.halfCanal * 2], position: [(land.start + CANAL_START) / 2, y, 0] },
    { size: [land.end - CANAL_END, height, land.halfCanal * 2], position: [(CANAL_END + land.end) / 2, y, 0] },
  ];
  return blocks;
}

function createRandom(seed: number) {
  let state = seed;
  return () => {
    const value = Math.sin(state++ * 127.1 + 311.7) * 43758.5453;
    return value - Math.floor(value);
  };
}

export const LEAF_COLORS = ['#5fae69', '#7cc46f', '#4e9c78', '#95cf74'];
export const PINE_COLORS = ['#3f8f63', '#4c9c6a', '#367e5a'];
export const BUSH_COLORS = ['#5aa564', '#6db86a', '#4f9a6e', '#78bf6c'];
export const ROCK_COLORS = ['#a9b3ad', '#bcc3bd', '#959f99'];

const BUNTING_HEIGHT = 1.95;
const BUNTING_SAG = 0.38;
const BUNTING_POLE_GAP = 7;
const FLAG_GAP = 0.42;

export function buildScenery(land: PondLand, halfWidth: number, portrait: boolean, flowerColors: string[], flagColors: string[]) {
  const random = createRandom(17);
  const pick = <T,>(list: T[]) => list[Math.floor(random() * list.length)];
  const jitter = (amount: number) => (random() - 0.5) * amount;
  const { halfCanal } = land;

  const trunks: Placement[] = [];
  const crowns: Placement[] = [];
  const pines: Placement[] = [];
  const addTree = (x: number, z: number, smallest: number, spread: number) => {
    if (z > halfCanal && !portrait) return;
    const size = smallest + random() * spread;
    trunks.push({ position: [x, BANK_TOP, z], scale: [size, size * 0.85, size] });
    if (random() < 0.35) {
      const color = pick(PINE_COLORS);
      pines.push({ position: [x, BANK_TOP + size * 0.45, z], scale: [size * 0.82, size * 1.45, size * 0.82], rotation: [0, random() * Math.PI, 0], color });
      pines.push({ position: [x, BANK_TOP + size * 1.2, z], scale: [size * 0.6, size * 1.15, size * 0.6], rotation: [0, random() * Math.PI, 0], color });
    } else {
      crowns.push({ position: [x, BANK_TOP + size * 1.5, z], scale: [size * 0.95, size * 1.1, size * 0.95], rotation: [0, random() * Math.PI, 0], color: pick(LEAF_COLORS) });
    }
  };

  const farDepth = -halfCanal - land.farEdge;
  for (let x = land.start + 2; x < land.end - 1; x += 4.6) {
    if (random() < 0.15) continue;
    addTree(x + jitter(2), -(halfCanal + 2.6 + random() * Math.min(farDepth - 3.4, 7)), 0.6, 0.45);
  }
  if (portrait) {
    for (let x = land.start + 2; x < land.end - 1; x += 3.4) {
      if (random() < 0.4) continue;
      addTree(x + jitter(2), -(halfCanal + 7 + random() * (farDepth - 8)), 0.75, 0.6);
    }
  }
  for (let x = land.start + 1; x < land.end - 1; x += 3.2) {
    if (random() < 0.25) continue;
    addTree(x + jitter(1.4), halfCanal + 2.4 + random() * 4, 0.7, 0.55);
  }
  const capEnd = portrait ? land.end - 0.8 : CANAL_END + 22;
  for (const [from, to] of [
    [CANAL_START - 26, CANAL_START - 6],
    [CANAL_END + 1.6, capEnd],
  ]) {
    for (let x = from; x < to; x += 3) {
      for (let z = -halfCanal + 1; z < halfCanal - 0.3; z += 3.2) {
        if (random() < 0.3) continue;
        addTree(x + jitter(1), z + jitter(1.2), 0.65, 0.5);
      }
    }
  }

  const bushes: Placement[] = [];
  const addBush = (x: number, z: number) => {
    const size = 0.55 + random() * 0.45;
    bushes.push({ position: [x, BANK_TOP + size * 0.18, z], scale: [size * 1.35, size * 0.8, size * 1.1], rotation: [0, random() * Math.PI, 0], color: pick(BUSH_COLORS) });
  };
  if (portrait) {
    for (let z = land.farEdge + 0.4; z < land.nearEdge - 0.4; z += 0.85) addBush(land.end - 0.5 + jitter(0.4), z + jitter(0.3));
  } else {
    for (let x = land.start + 0.5; x < land.end - 0.5; x += 0.85) addBush(x + jitter(0.3), land.farEdge + 0.5 + jitter(0.4));
  }

  const landPoint = (): [number, number] => {
    const region = random();
    if (region < 0.8) {
      const side = region < 0.4 ? -1 : 1;
      return [CANAL_START - 6 + random() * (CANAL_END - CANAL_START + 12), side * (halfCanal + 0.4 + random() * 4.4)];
    }
    const [from, to] = region < 0.9 ? [CANAL_START - 8, CANAL_START] : [CANAL_END, CANAL_END + 8];
    return [from + 0.4 + random() * (to - from - 0.8), (random() * 2 - 1) * (halfCanal - 0.3)];
  };

  const tufts: Placement[] = Array.from({ length: 190 }, () => {
    const [x, z] = landPoint();
    const size = 0.7 + random() * 0.6;
    return { position: [x, BANK_TOP, z], scale: [size, size * (0.8 + random() * 0.6), size], rotation: [0, random() * Math.PI, 0] };
  });

  const flowers: Placement[] = Array.from({ length: 140 }, () => {
    const [x, z] = landPoint();
    const size = 0.8 + random() * 0.5;
    return { position: [x, BANK_TOP + 0.08, z], scale: [size, size, size], color: pick(flowerColors) };
  });

  const rocks: Placement[] = [];
  for (const side of portrait ? [-1, 1] : [-1]) {
    for (let index = 0; index < 9; index++) {
      const size = 0.25 + random() * 0.25;
      rocks.push({
        position: [CANAL_START + random() * (CANAL_END - CANAL_START), BANK_TOP, side * (halfCanal + 0.3 + random() * 0.5)],
        scale: [size, size * 0.6, size * 0.8],
        rotation: [0, random() * Math.PI, 0],
        color: pick(ROCK_COLORS),
      });
    }
  }

  const reeds: Placement[] = [];
  const cattails: Placement[] = [];
  const stem = new THREE.Vector3();
  const tilt = new THREE.Euler();
  const addReed = (x: number, z: number) => {
    const height = 0.9 + random() * 0.7;
    const rotation: Vec3 = [jitter(0.3), 0, jitter(0.3)];
    reeds.push({ position: [x, -0.15, z], scale: [1, height, 1], rotation });
    if (random() < 0.55) {
      stem.set(0, height - 0.1, 0).applyEuler(tilt.set(...rotation));
      cattails.push({ position: [x + stem.x, -0.15 + stem.y, z + stem.z], scale: [1, 1, 1], rotation });
    }
  };
  for (const side of [-1, 1]) {
    for (let x = CANAL_START + 0.4; x < CANAL_END - 0.4; x += 0.9) {
      if (random() > 0.5) continue;
      const clump = 2 + Math.floor(random() * 3);
      for (let index = 0; index < clump; index++) addReed(x + jitter(0.7), side * (halfCanal - 0.1 - random() * 0.3));
    }
  }
  for (const x of [CANAL_START + 0.15, CANAL_END - 0.15]) {
    for (let z = -halfCanal + 0.4; z < halfCanal - 0.4; z += 0.8) {
      if (random() > 0.45) continue;
      for (let index = 0; index < 3; index++) addReed(x + jitter(0.25), z + jitter(0.6));
    }
  }

  const pads: LilyPad[] = [];
  const addPad = (x: number, z: number) => pads.push({ x, z, size: 0.28 + random() * 0.18, turn: random() * Math.PI * 2, bloom: random() < 0.3 });
  for (const side of [-1, 1]) {
    for (let x = START_X; x < FINISH_X; x += 1.5) {
      if (random() < 0.5) addPad(x + jitter(0.8), side * (halfWidth + 0.6 + random() * 0.55));
    }
  }
  for (const [from, to] of [
    [CANAL_START + 0.6, START_X - 2.3],
    [FINISH_X + 1.8, CANAL_END - 0.6],
  ]) {
    for (let index = 0; index < 9; index++) addPad(from + random() * (to - from), (random() * 2 - 1) * (halfCanal - 0.6));
  }

  const poles: Placement[] = [];
  const ropes: Placement[] = [];
  const flags: Placement[] = [];
  const buntingZ = -(halfCanal + 0.95);
  const from = new THREE.Vector3();
  const to = new THREE.Vector3();
  const along = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const turn = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const sagAt = (t: number) => BANK_TOP + BUNTING_HEIGHT - BUNTING_SAG * 4 * t * (1 - t);
  const poleXs: number[] = [];
  for (let x = START_X - 2; x <= FINISH_X + 2.01; x += BUNTING_POLE_GAP) poleXs.push(x);
  poleXs.forEach((x) => poles.push({ position: [x, BANK_TOP, buntingZ], scale: [1, BUNTING_HEIGHT + 0.1, 1] }));
  let flagIndex = 0;
  for (let span = 0; span < poleXs.length - 1; span++) {
    const left = poleXs[span];
    const width = poleXs[span + 1] - left;
    const pieces = 10;
    for (let piece = 0; piece < pieces; piece++) {
      from.set(left + (width * piece) / pieces, sagAt(piece / pieces), buntingZ);
      to.set(left + (width * (piece + 1)) / pieces, sagAt((piece + 1) / pieces), buntingZ);
      along.subVectors(to, from);
      turn.setFromUnitVectors(up, along.clone().normalize());
      euler.setFromQuaternion(turn);
      ropes.push({ position: [(from.x + to.x) / 2, (from.y + to.y) / 2, buntingZ], scale: [1, along.length(), 1], rotation: [euler.x, euler.y, euler.z] });
    }
    const count = Math.floor(width / FLAG_GAP);
    for (let index = 1; index < count; index++) {
      const t = index / count;
      flags.push({
        position: [left + width * t, sagAt(t), buntingZ],
        scale: [1, 1, 1],
        rotation: [0, (flagIndex % 2 === 0 ? 1 : -1) * 0.5, jitter(0.12)],
        color: flagColors[flagIndex % flagColors.length],
      });
      flagIndex++;
    }
  }

  return { trunks, crowns, pines, bushes, tufts, flowers, rocks, reeds, cattails, pads, poles, ropes, flags };
}

export type Scenery = ReturnType<typeof buildScenery>;
