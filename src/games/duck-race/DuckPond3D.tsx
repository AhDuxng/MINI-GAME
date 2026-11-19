// Cảnh 3D đua vịt: con kênh gợn sóng bằng shader giữa hai bờ cỏ, dây phao chia làn, cổng đích ca-rô, vịt cao su vẽ instanced kèm vệt sóng và bóng mềm; vịt trượt đều giữa hai nhịp mô phỏng, bóng đổ của cảnh tĩnh chỉ vẽ lại khi bố cục đổi, camera tự căn khung và ghim phông núi vào đường chân trời
'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { memo, useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { SceneCanvas, canvasTexture, checkerTexture, useSceneColors, type SceneColors } from '@/games/kit/three';
import { spreadStop } from '@/shared/lib/ramp';
import { TICK_MS, type RaceState } from './race-engine';
import { rankLabel } from './RaceTrack';
import PondBackdrop, { BACKDROP_LAYER_HEIGHT, BACKDROP_PARALLAX } from './PondBackdrop';
import PondScenery from './PondScenery';
import { BANK_TOP, CANAL_END, CANAL_START, FINISH_X, LANE_GAP, START_X, laneZ, pondLand, trackX, type PondLand } from './pond-layout';
import { ridesWaves, waterMaterial, waveHeight, type TimeUniform } from './pond-waves';

const FOG_COLOR = '#d5ecdf';
const WATER_DEEP = '#2b9fb4';
const WATER_SHALLOW = '#79d3cc';
const WATER_FOAM = '#f3fbf7';
const SHADOW_TINT = '#0e4c57';
const ROPE_COLOR = '#f5f3ea';
const FLOAT_WHITE = '#ffffff';

const DUCK_SCALE = 0.68;
const LABEL_HEIGHT = 1.2 * DUCK_SCALE;
const DESK_PITCH = THREE.MathUtils.degToRad(26);
const PHONE_PITCH = THREE.MathUtils.degToRad(25);
const PHONE_DUCK_NDC = 0.55;
const CROWDED_LANES = 6;
const LABEL_STEP_PX = 18;
const TICK_SECONDS = TICK_MS / 1000;
const FLOAT_GAP = 0.78;
const FLOAT_END_ZONE = 2.4;
const SHADOW_REFRESH_FRAMES = 3;
const HORIZON_OVERLAP_PX = 6;
const BACKDROP_FILL = 0.85;
const BACKDROP_SCALE_STEP = 0.05;
const WAKE_MAX = 2.4;
const IDLE_FPS = 30;

const smoothing = (delta: number, speed: number) => 1 - Math.exp(-delta * speed);

function Water({ land, time }: { land: PondLand; time: TimeUniform }) {
  const geometry = useMemo(
    () =>
      new THREE.PlaneGeometry(CANAL_END - CANAL_START + 0.6, land.halfCanal * 2 + 0.6, 84, 26)
        .rotateX(-Math.PI / 2)
        .translate((CANAL_START + CANAL_END) / 2, 0, 0),
    [land.halfCanal],
  );
  const { material } = useMemo(
    () =>
      waterMaterial(time, {
        deep: WATER_DEEP,
        shallow: WATER_SHALLOW,
        foam: WATER_FOAM,
        halfCanal: land.halfCanal,
        centerX: (CANAL_START + CANAL_END) / 2,
        halfLength: (CANAL_END - CANAL_START) / 2,
      }),
    [time, land.halfCanal],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return <mesh geometry={geometry} material={material} receiveShadow />;
}

function LaneRopes({ count, colors, time }: { count: number; colors: SceneColors; time: TimeUniform }) {
  const ropeRef = useRef<THREE.InstancedMesh>(null);
  const floatRef = useRef<THREE.InstancedMesh>(null);
  const length = FINISH_X - START_X + 2;
  const kit = useMemo(
    () => ({
      rope: new THREE.CylinderGeometry(0.026, 0.026, length, 5, 64, true).rotateZ(Math.PI / 2),
      float: new THREE.SphereGeometry(0.1, 8, 5).scale(1.6, 0.85, 0.85),
      ropeMaterial: ridesWaves(new THREE.MeshStandardMaterial({ color: ROPE_COLOR, roughness: 0.6 }), time, 'rope'),
      floatMaterial: ridesWaves(new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.45 }), time, 'float'),
    }),
    [length, time],
  );
  const floats = useMemo(() => {
    const list: { x: number; z: number; color: string }[] = [];
    for (let line = 0; line <= count; line++) {
      const z = (line - count / 2) * LANE_GAP;
      let index = 0;
      for (let x = START_X - 1; x <= FINISH_X + 1; x += FLOAT_GAP) {
        const nearEnd = x < START_X + FLOAT_END_ZONE || x > FINISH_X - FLOAT_END_ZONE;
        list.push({ x, z, color: nearEnd ? colors.ramp[3] : index % 2 === 0 ? FLOAT_WHITE : colors.ramp[1] });
        index++;
      }
    }
    return list;
  }, [count, colors.ramp]);

  useEffect(
    () => () => {
      Object.values(kit).forEach((item) => item.dispose());
    },
    [kit],
  );

  useLayoutEffect(() => {
    const ropes = ropeRef.current;
    const buoys = floatRef.current;
    if (!ropes || !buoys) return;
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    for (let line = 0; line <= count; line++) {
      ropes.setMatrixAt(line, matrix.makeTranslation((START_X + FINISH_X) / 2, 0.05, (line - count / 2) * LANE_GAP));
    }
    floats.forEach(({ x, z, color: tint }, index) => {
      buoys.setMatrixAt(index, matrix.makeTranslation(x, 0.06, z));
      buoys.setColorAt(index, color.set(tint));
    });
    ropes.instanceMatrix.needsUpdate = true;
    buoys.instanceMatrix.needsUpdate = true;
    if (buoys.instanceColor) buoys.instanceColor.needsUpdate = true;
    ropes.computeBoundingSphere();
    buoys.computeBoundingSphere();
  }, [count, floats]);

  return (
    <>
      <instancedMesh key={`rope-${count}`} ref={ropeRef} args={[kit.rope, kit.ropeMaterial, count + 1]} />
      <instancedMesh key={`float-${floats.length}`} ref={floatRef} args={[kit.float, kit.floatMaterial, floats.length]} />
    </>
  );
}

function FinishGate({ halfWidth, colors }: { halfWidth: number; colors: SceneColors }) {
  const span = halfWidth * 2 + 1;
  const banner = useMemo(() => checkerTexture(colors.ink, colors.canvas, Math.round(span * 2)), [colors.ink, colors.canvas, span]);

  useEffect(() => () => banner.dispose(), [banner]);

  return (
    <group position={[FINISH_X + 0.5, 0, 0]}>
      {[1, -1].map((side) => (
        <mesh key={side} position={[0, 1.5, side * (span / 2)]} castShadow>
          <boxGeometry args={[0.25, 3, 0.25]} />
          <meshStandardMaterial color={colors.ink} />
        </mesh>
      ))}
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[0.3, 0.5, span + 0.25]} />
        <meshStandardMaterial map={banner} />
      </mesh>
    </group>
  );
}

function paintedGeometry(geometry: THREE.BufferGeometry, color: string, matrix: THREE.Matrix4) {
  const piece = geometry.clone().applyMatrix4(matrix);
  const tint = new THREE.Color(color);
  const values = new Float32Array(piece.attributes.position.count * 3);
  for (let index = 0; index < values.length; index += 3) {
    values[index] = tint.r;
    values[index + 1] = tint.g;
    values[index + 2] = tint.b;
  }
  piece.setAttribute('color', new THREE.BufferAttribute(values, 3));
  return piece;
}

function duckGeometry(colors: SceneColors) {
  const sphere = new THREE.SphereGeometry(1, 20, 14);
  const bead = new THREE.SphereGeometry(1, 10, 8);
  const cone = new THREE.ConeGeometry(0.16, 0.36, 12);
  const place = (position: [number, number, number], scale: [number, number, number], roll = 0) =>
    new THREE.Matrix4().compose(new THREE.Vector3(...position), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, roll)), new THREE.Vector3(...scale));
  const [body, wing, beak] = [colors.ramp[0], colors.ramp[1], colors.ramp[2]];
  const pieces = [
    paintedGeometry(sphere, body, place([0, 0.28, 0], [0.62, 0.42, 0.48])),
    paintedGeometry(sphere, body, place([0.36, 0.72, 0], [0.3, 0.3, 0.3])),
    paintedGeometry(sphere, beak, place([0.66, 0.68, 0], [0.2, 0.07, 0.15])),
    paintedGeometry(bead, '#12121a', place([0.53, 0.8, 0.15], [0.045, 0.045, 0.045])),
    paintedGeometry(bead, '#12121a', place([0.53, 0.8, -0.15], [0.045, 0.045, 0.045])),
    paintedGeometry(bead, '#f59a9f', place([0.5, 0.67, 0.21], [0.06, 0.035, 0.03])),
    paintedGeometry(bead, '#f59a9f', place([0.5, 0.67, -0.21], [0.06, 0.035, 0.03])),
    paintedGeometry(sphere, wing, place([-0.02, 0.36, 0.44], [0.3, 0.16, 0.08])),
    paintedGeometry(sphere, wing, place([-0.02, 0.36, -0.44], [0.3, 0.16, 0.08])),
    paintedGeometry(cone, body, place([-0.58, 0.5, 0], [1, 1, 1], 0.9)),
  ];
  const merged = mergeGeometries(pieces) ?? sphere.clone();
  [sphere, bead, cone, ...pieces].forEach((geometry) => geometry.dispose());
  return merged;
}

function radialTexture() {
  return canvasTexture(64, (context, width, height) => {
    const gradient = context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.55, 'rgba(255,255,255,0.55)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  });
}

function wakeTexture() {
  return canvasTexture([256, 128], (context, width, height) => {
    const fade = context.createLinearGradient(width, 0, 0, 0);
    fade.addColorStop(0, 'rgba(255,255,255,0.95)');
    fade.addColorStop(1, 'rgba(255,255,255,0)');
    context.strokeStyle = fade;
    context.lineCap = 'round';
    for (const [spread, thickness] of [
      [0.46, 10],
      [0.3, 6],
    ]) {
      context.lineWidth = thickness;
      for (const side of [-1, 1]) {
        context.beginPath();
        context.moveTo(width - 10, height / 2);
        context.quadraticCurveTo(width * 0.55, height / 2 + side * height * spread * 0.55, 6, height / 2 + side * height * spread);
        context.stroke();
      }
    }
    const glow = context.createRadialGradient(width - 18, height / 2, 0, width - 18, height / 2, 40);
    glow.addColorStop(0, 'rgba(255,255,255,0.7)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
  });
}

export interface Flock {
  bodies: THREE.InstancedMesh | null;
  rings: THREE.InstancedMesh | null;
  shadows: THREE.InstancedMesh | null;
  wakes: THREE.InstancedMesh | null;
}

function DuckFlock({ count, colors, time, flockRef }: { count: number; colors: SceneColors; time: TimeUniform; flockRef: MutableRefObject<Flock> }) {
  const kit = useMemo(() => {
    const shadowMap = radialTexture();
    const wakeMap = wakeTexture();
    return {
      body: duckGeometry(colors),
      ring: new THREE.TorusGeometry(0.62, 0.11, 10, 28).rotateX(Math.PI / 2).translate(0, 0.06, 0),
      blob: new THREE.CircleGeometry(0.85, 20).rotateX(-Math.PI / 2),
      wake: new THREE.PlaneGeometry(1, 1, 8, 2).rotateX(-Math.PI / 2).translate(-0.5, 0, 0),
      bodyMaterial: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.35 }),
      ringMaterial: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5 }),
      shadowMaterial: ridesWaves(new THREE.MeshBasicMaterial({ map: shadowMap, color: SHADOW_TINT, transparent: true, opacity: 0.38, depthWrite: false }), time, 'blob'),
      wakeMaterial: ridesWaves(new THREE.MeshBasicMaterial({ map: wakeMap, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), time, 'wake'),
      shadowMap,
      wakeMap,
    };
  }, [colors, time]);

  useEffect(
    () => () => {
      Object.values(kit).forEach((item) => item.dispose());
    },
    [kit],
  );

  useLayoutEffect(() => {
    const rings = flockRef.current.rings;
    const wakes = flockRef.current.wakes;
    if (!rings || !wakes) return;
    const color = new THREE.Color();
    for (let index = 0; index < count; index++) {
      rings.setColorAt(index, color.set(colors.ramp[spreadStop(index, count)]));
      wakes.setColorAt(index, color.setScalar(0));
    }
    if (rings.instanceColor) rings.instanceColor.needsUpdate = true;
    if (wakes.instanceColor) wakes.instanceColor.needsUpdate = true;
  }, [count, colors, flockRef]);

  const attach = (key: keyof Flock) => (node: THREE.InstancedMesh | null) => {
    flockRef.current[key] = node;
  };

  return (
    <>
      <instancedMesh key={`shadow-${count}`} ref={attach('shadows')} args={[kit.blob, kit.shadowMaterial, count]} frustumCulled={false} renderOrder={1} />
      <instancedMesh key={`wake-${count}`} ref={attach('wakes')} args={[kit.wake, kit.wakeMaterial, count]} frustumCulled={false} renderOrder={2} />
      <instancedMesh key={`ring-${count}`} ref={attach('rings')} args={[kit.ring, kit.ringMaterial, count]} frustumCulled={false} />
      <instancedMesh key={`body-${count}`} ref={attach('bodies')} args={[kit.body, kit.bodyMaterial, count]} frustumCulled={false} />
    </>
  );
}

interface PondProps {
  racers: string[];
  colors: SceneColors;
  raceRef: MutableRefObject<RaceState>;
  runningRef: MutableRefObject<boolean>;
  labelsRef: MutableRefObject<(HTMLDivElement | null)[]>;
  layersRef: MutableRefObject<(HTMLDivElement | null)[]>;
}

function Pond({ racers, colors, raceRef, runningRef, labelsRef, layersRef }: PondProps) {
  const count = racers.length;
  const halfWidth = (count * LANE_GAP) / 2;
  const portrait = useThree((state) => state.size.width < state.size.height);
  const gl = useThree((state) => state.gl);
  const land = useMemo(() => pondLand(halfWidth, portrait), [halfWidth, portrait]);
  const time = useMemo<TimeUniform>(() => ({ value: 0 }), []);
  const flockRef = useRef<Flock>({ bodies: null, rings: null, shadows: null, wakes: null });
  const fogRef = useRef<THREE.Fog>(null);
  const motion = useRef({ race: null as RaceState | null, from: [] as number[], to: [] as number[], visual: [] as number[], wake: [] as number[], tickAt: 0 });
  const shadowFrames = useRef(SHADOW_REFRESH_FRAMES);
  const layerTransforms = useRef<{ height: number; transform: string }[]>([]);
  const helpers = useMemo(
    () => ({
      dummy: new THREE.Object3D(),
      tint: new THREE.Color(),
      lookTarget: new THREE.Vector3(),
      focus: new THREE.Vector3(),
      cameraTarget: new THREE.Vector3(),
      projected: new THREE.Vector3(),
      horizon: new THREE.Vector3(),
      placed: { value: false },
    }),
    [],
  );

  useEffect(() => {
    gl.shadowMap.autoUpdate = false;
    shadowFrames.current = SHADOW_REFRESH_FRAMES;
    return () => {
      gl.shadowMap.autoUpdate = true;
    };
  }, [gl, land, colors]);

  useFrame(({ clock, camera, size }, delta) => {
    const now = clock.elapsedTime;
    time.value = now;
    if (shadowFrames.current > 0) {
      gl.shadowMap.needsUpdate = true;
      shadowFrames.current -= 1;
    }

    const race = raceRef.current;
    const state = motion.current;
    if (state.race !== race) {
      for (let index = 0; index < count; index++) {
        const target = trackX(race.positions[index] ?? 0);
        const current = state.visual[index] ?? target;
        const snap = target < current - 1;
        state.from[index] = snap ? target : current;
        state.to[index] = target;
        if (snap) state.visual[index] = target;
      }
      state.race = race;
      state.tickAt = now;
    }
    const progress = Math.min(1, (now - state.tickAt) / TICK_SECONDS);
    const running = runningRef.current;
    const { bodies, rings, shadows, wakes } = flockRef.current;
    const { dummy, tint } = helpers;

    for (let index = 0; index < count; index++) {
      const from = state.from[index] ?? state.to[index] ?? START_X;
      const to = state.to[index] ?? from;
      const x = from + (to - from) * progress;
      const z = laneZ(index, count);
      const finished = race.finishOrder.includes(index);
      const swimming = running && !finished && progress < 1;
      const speed = swimming ? Math.abs(to - from) / TICK_SECONDS : 0;
      state.visual[index] = x;
      state.wake[index] = (state.wake[index] ?? 0) + (Math.min(1, speed / 6) - (state.wake[index] ?? 0)) * smoothing(delta, 6);

      const hop = finished && running ? Math.abs(Math.sin(now * 7 + index)) * 0.14 : 0;
      dummy.position.set(x, waveHeight(x, z, now) + Math.sin(now * 3 + index) * 0.03 + hop, z);
      dummy.rotation.set(Math.sin(now * 2 + index * 0.7) * 0.06, 0, running && !finished ? Math.sin(now * 12 + index) * 0.1 : Math.sin(now * 1.5 + index) * 0.04);
      dummy.scale.setScalar(DUCK_SCALE);
      dummy.updateMatrix();
      bodies?.setMatrixAt(index, dummy.matrix);
      rings?.setMatrixAt(index, dummy.matrix);

      dummy.position.set(x + 0.05, 0.035, z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(DUCK_SCALE);
      dummy.updateMatrix();
      shadows?.setMatrixAt(index, dummy.matrix);

      const wake = state.wake[index];
      dummy.position.set(x - 0.25 * DUCK_SCALE, 0.07, z);
      dummy.scale.set((0.4 + wake * WAKE_MAX) * DUCK_SCALE, 1, (0.9 + wake * 0.5) * DUCK_SCALE);
      dummy.updateMatrix();
      wakes?.setMatrixAt(index, dummy.matrix);
      wakes?.setColorAt(index, tint.setScalar(wake * 0.75));
    }
    for (const mesh of [bodies, rings, shadows, wakes]) {
      if (mesh) mesh.instanceMatrix.needsUpdate = true;
    }
    if (wakes?.instanceColor) wakes.instanceColor.needsUpdate = true;

    const crowd = THREE.MathUtils.degToRad(THREE.MathUtils.clamp((count - CROWDED_LANES) * 1.4, 0, 14));
    let minX = Infinity;
    let maxX = -Infinity;
    for (let index = 0; index < count; index++) {
      minX = Math.min(minX, state.visual[index]);
      maxX = Math.max(maxX, state.visual[index]);
    }
    const perspective = camera as THREE.PerspectiveCamera;
    const halfFov = THREE.MathUtils.degToRad(perspective.fov / 2);
    const tanHalf = Math.tan(halfFov);
    const aspect = size.width / size.height;
    const { cameraTarget, focus, lookTarget, projected, horizon } = helpers;

    if (aspect >= 1) {
      const pitch = DESK_PITCH + crowd;
      const reach = Math.cos(pitch) - Math.sin(pitch) / Math.tan(pitch + halfFov);
      const fitX = (maxX - minX + 8) / 2 / (tanHalf * aspect);
      const fitZ = (halfWidth + 1) / reach;
      const distance = THREE.MathUtils.clamp(Math.max(fitX, fitZ), 11, 60);
      const centerX = (minX + maxX) / 2;
      cameraTarget.set(centerX, distance * Math.sin(pitch), distance * Math.cos(pitch));
      focus.set(centerX, 0, 0);
    } else {
      const offset = Math.atan(PHONE_DUCK_NDC * tanHalf);
      const depth = THREE.MathUtils.clamp((halfWidth + 2.2) / (tanHalf * aspect), 8, 60);
      const reach = depth / Math.cos(offset);
      const pitch = PHONE_PITCH + crowd;
      const height = reach * Math.sin(pitch + offset);
      const cameraX = minX - reach * Math.cos(pitch + offset);
      cameraTarget.set(cameraX, height, 0);
      focus.set(cameraX + height / Math.tan(pitch), 0, 0);
    }

    const follow = helpers.placed.value ? smoothing(delta, 2.5) : 1;
    camera.position.lerp(cameraTarget, follow);
    lookTarget.lerp(focus, follow);
    camera.lookAt(lookTarget);
    helpers.placed.value = true;

    const viewDistance = camera.position.distanceTo(lookTarget);
    if (fogRef.current) {
      fogRef.current.near = viewDistance * 1.3;
      fogRef.current.far = viewDistance * 4.4;
    }

    const beside = aspect >= 1;
    labelsRef.current.slice(0, count).forEach((label, index) => {
      if (!label) return;
      const x = state.visual[index];
      const z = laneZ(index, count);
      const y = waveHeight(x, z, now);
      const flip = count > CROWDED_LANES && index % 2 === 1;
      if (beside) projected.set(flip ? x + 0.85 * DUCK_SCALE : x - 0.85 * DUCK_SCALE, y + 0.5 * DUCK_SCALE, z).project(camera);
      else projected.set(x, y + LABEL_HEIGHT, z).project(camera);
      const anchor = beside ? (flip ? 'translate(0, -50%)' : 'translate(-100%, -50%)') : flip ? `translate(-50%, calc(-100% - ${LABEL_STEP_PX}px))` : 'translate(-50%, -100%)';
      label.style.opacity = projected.z < 1 ? '1' : '0';
      label.style.transform = `translate3d(${((projected.x * 0.5 + 0.5) * size.width).toFixed(1)}px, ${((-projected.y * 0.5 + 0.5) * size.height).toFixed(1)}px, 0) ${anchor}`;
    });

    if (beside) horizon.set(camera.position.x, BANK_TOP, land.farEdge);
    else horizon.set(land.end, BANK_TOP, 0);
    horizon.project(camera);
    const horizonPx = (-horizon.y * 0.5 + 0.5) * size.height;
    const fullHeight = size.height * BACKDROP_LAYER_HEIGHT;
    const scale = Math.round(THREE.MathUtils.clamp((horizonPx * BACKDROP_FILL) / fullHeight, 0.3, 1) / BACKDROP_SCALE_STEP) * BACKDROP_SCALE_STEP;
    const layerHeight = Math.round(fullHeight * scale);
    const top = horizonPx + HORIZON_OVERLAP_PX - layerHeight;
    layersRef.current.forEach((layer, index) => {
      if (!layer) return;
      const shift = beside ? -camera.position.x * BACKDROP_PARALLAX[index] : 0;
      const transform = `translate3d(${shift.toFixed(1)}px, ${top.toFixed(1)}px, 0)`;
      const last = layerTransforms.current[index];
      if (last?.height !== layerHeight) layer.style.height = `${layerHeight}px`;
      if (last?.transform !== transform) layer.style.transform = transform;
      layerTransforms.current[index] = { height: layerHeight, transform };
    });
  });

  return (
    <>
      <fog ref={fogRef} attach="fog" args={[FOG_COLOR, 40, 120]} />
      <hemisphereLight args={['#fffdf3', '#e4f0d2', 1.5]} />
      <directionalLight
        position={[9, 15, 11]}
        intensity={2.1}
        color="#fff6e2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={26}
        shadow-camera-bottom={-26}
      />
      <PondScenery land={land} halfWidth={halfWidth} portrait={portrait} colors={colors} time={time} />
      <Water land={land} time={time} />
      <LaneRopes count={count} colors={colors} time={time} />
      <FinishGate halfWidth={halfWidth} colors={colors} />
      <DuckFlock count={count} colors={colors} time={time} flockRef={flockRef} />
    </>
  );
}

const PondCanvas = memo(function PondCanvas({ active, ...props }: PondProps & { active: boolean }) {
  return (
    <SceneCanvas camera={{ fov: 40, near: 0.1, far: 220, position: [0, 20, 25] }} active={active} idleFps={IDLE_FPS}>
      <Pond {...props} />
    </SceneCanvas>
  );
});

interface DuckPond3DProps {
  racers: string[];
  race: RaceState;
  running: boolean;
}

export default function DuckPond3D({ racers, race, running }: DuckPond3DProps) {
  const colors = useSceneColors();
  const labelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);
  const raceRef = useRef(race);
  const runningRef = useRef(running);

  useLayoutEffect(() => {
    raceRef.current = race;
    runningRef.current = running;
  }, [race, running]);

  return (
    <div className="relative h-full w-full">
      <PondBackdrop layersRef={layersRef} />
      <div className="absolute inset-0">
        <PondCanvas active={running} racers={racers} colors={colors} raceRef={raceRef} runningRef={runningRef} labelsRef={labelsRef} layersRef={layersRef} />
      </div>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {racers.map((name, index) => {
          const rank = race.finishOrder.indexOf(index);
          return (
            <div
              key={`${name}-${index}`}
              ref={(node) => {
                labelsRef.current[index] = node;
              }}
              className="absolute left-0 top-0 whitespace-nowrap border border-line bg-canvas/90 px-1.5 py-0.5 text-[11px] font-bold text-ink opacity-0 sm:text-xs rounded-md"
            >
              {rank >= 0 && <span className="mr-1 font-extrabold">{rankLabel(rank)}</span>}
              {name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
