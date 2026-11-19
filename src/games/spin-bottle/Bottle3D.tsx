// Cảnh 3D Xoay Chai: bàn quầy bar tròn bằng gỗ vân vòng, chân kim loại, tên từng người quanh mép, mỗi chỗ một ly nhỏ, chai thuỷ tinh giữa bàn xoay chậm dần dưới ánh đèn vàng ấm
'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { SceneCanvas, canvasTexture, usePageFont, useSceneColors, type SceneColors } from '@/games/kit/three';
import { spreadStop } from '@/shared/lib/ramp';
import { truncate } from '@/shared/lib/utils';
import { SPIN_SECONDS, seatHeading, seatSlice } from './spin-rules';

const TABLE_RADIUS = 3.2;
const TABLE_THICKNESS = 0.32;
const NAME_RING = 0.83;
const GLASS_RING = 0.62;
const TEXTURE_SIZE = 1024;
const BODY_RADIUS = 0.37;
const MIN_TICK_GAP_MS = 55;
const EDGE = '#f98f45';
const WOOD_SIDE = '#6e3f1f';
const PEDESTAL = '#2b2622';

const BOTTLE_PROFILE: [number, number][] = [
  [0, -1.2],
  [0.3, -1.2],
  [0.36, -1.16],
  [BODY_RADIUS, -1.04],
  [BODY_RADIUS, 0.16],
  [0.34, 0.36],
  [0.24, 0.6],
  [0.15, 0.8],
  [0.125, 0.96],
  [0.12, 1.08],
  [0.14, 1.12],
  [0.14, 1.2],
  [0, 1.2],
];

const toRadians = THREE.MathUtils.degToRad;
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

function seatPoint(index: number, count: number, ring: number) {
  const heading = toRadians(seatHeading(index, count));
  return { x: Math.sin(heading) * ring, z: -Math.cos(heading) * ring };
}

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function drawTableTop(context: CanvasRenderingContext2D, size: number, seats: string[], colors: SceneColors, font: string, winner: number | null) {
  const center = size / 2;
  const wood = context.createRadialGradient(center * 0.85, center * 0.8, size * 0.05, center, center, center);
  wood.addColorStop(0, '#d39457');
  wood.addColorStop(0.6, '#b06d3a');
  wood.addColorStop(1, '#8a4f27');
  context.fillStyle = wood;
  context.fillRect(0, 0, size, size);

  for (let radius = center; radius > size * 0.03; radius -= size * 0.022) {
    context.strokeStyle = radius % 3 > 1.5 ? 'rgba(70, 35, 12, 0.2)' : 'rgba(255, 220, 170, 0.08)';
    context.lineWidth = size * (radius % 3 > 1.5 ? 0.0035 : 0.002);
    context.beginPath();
    context.ellipse(center, center, radius, radius * 0.985, 0, 0, Math.PI * 2);
    context.stroke();
  }

  context.lineWidth = size * 0.03;
  context.strokeStyle = '#5a3218';
  context.beginPath();
  context.arc(center, center, center - size * 0.016, 0, Math.PI * 2);
  context.stroke();
  context.lineWidth = size * 0.004;
  context.strokeStyle = 'rgba(255, 214, 160, 0.5)';
  context.beginPath();
  context.arc(center, center, center - size * 0.034, 0, Math.PI * 2);
  context.stroke();

  context.setLineDash([size * 0.018, size * 0.014]);
  context.lineWidth = size * 0.005;
  context.strokeStyle = 'rgba(255, 236, 205, 0.4)';
  context.beginPath();
  context.arc(center, center, size * 0.21, 0, Math.PI * 2);
  context.stroke();
  context.setLineDash([]);

  const count = seats.length;
  const fontSize = size * (count <= 6 ? 0.044 : count <= 10 ? 0.036 : 0.029);
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  seats.forEach((name, index) => {
    const active = index === winner;
    const scale = active ? 1.18 : 1;
    const { x, z } = seatPoint(index, count, center * NAME_RING);
    const px = center + x;
    const py = center + z;
    context.font = `800 ${fontSize * scale}px ${font}`;
    const label = truncate(name, 10);
    const width = context.measureText(label).width + fontSize * 1.2 * scale;
    const height = fontSize * 1.75 * scale;
    roundedRect(context, px - width / 2, py - height / 2, width, height, height * 0.28);
    context.fillStyle = colors.ramp[spreadStop(index, count)];
    context.fill();
    if (active) {
      context.lineWidth = size * 0.009;
      context.strokeStyle = EDGE;
      context.stroke();
    }
    context.fillStyle = '#12121a';
    context.fillText(label, px, py + fontSize * 0.06);
  });
}

function ShotGlass({ index, count, color, active }: { index: number; count: number; color: string; active: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const { x, z } = seatPoint(index, count, TABLE_RADIUS * GLASS_RING);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const lift = active ? Math.abs(Math.sin(clock.elapsedTime * 5.5)) * 0.32 : 0;
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, lift, 0.35);
    ref.current.rotation.y = active ? clock.elapsedTime * 2 : 0;
  });

  return (
    <group position={[x, 0, z]}>
      <group ref={ref}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.15, 0.4, 24, 1, true]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.35} roughness={0.1} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.06, 24]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.55} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.17, 0.145, 0.22, 24]} />
          <meshStandardMaterial color={color} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}

interface BottleSceneProps {
  seats: string[];
  rotation: number;
  spinning: boolean;
  winner: number | null;
  onSpin: () => void;
  onSpinEnd: () => void;
  onTick: () => void;
}

function BottleScene({ seats, rotation, spinning, winner, onSpin, onSpinEnd, onTick, colors }: BottleSceneProps & { colors: SceneColors }) {
  const font = usePageFont();
  const spinRef = useRef<THREE.Group>(null);
  const wobbleRef = useRef<THREE.Group>(null);
  const angle = useRef(rotation);
  const spin = useRef<{ from: number; to: number; start: number } | null>(null);
  const lastCrossing = useRef<number | null>(null);
  const lastTickAt = useRef(0);
  const count = seats.length;
  const slice = seatSlice(count);

  const bottleGeometry = useMemo(() => new THREE.LatheGeometry(BOTTLE_PROFILE.map(([radius, y]) => new THREE.Vector2(radius, y)), 48), []);
  const topTexture = useMemo(
    () => canvasTexture(TEXTURE_SIZE, (context, size) => drawTableTop(context, size, seats, colors, font, winner)),
    [seats, colors, font, winner],
  );

  useEffect(() => () => bottleGeometry.dispose(), [bottleGeometry]);
  useEffect(() => () => topTexture.dispose(), [topTexture]);

  useEffect(() => {
    if (spinning && rotation !== angle.current) {
      spin.current = { from: angle.current, to: rotation, start: performance.now() };
    } else if (!spinning) {
      angle.current = rotation;
    }
  }, [rotation, spinning]);

  useFrame(({ clock }) => {
    const current = spin.current;
    const now = performance.now();
    let energy = 0;
    if (current) {
      const t = Math.min((now - current.start) / (SPIN_SECONDS * 1000), 1);
      angle.current = current.from + (current.to - current.from) * easeOutQuart(t);
      energy = 1 - t;
      if (t >= 1) {
        spin.current = null;
        onSpinEnd();
      }
    }

    const crossing = Math.floor((angle.current + slice / 2) / slice);
    if (current && lastCrossing.current !== null && crossing !== lastCrossing.current && now - lastTickAt.current > MIN_TICK_GAP_MS) {
      lastTickAt.current = now;
      onTick();
    }
    lastCrossing.current = crossing;

    if (spinRef.current) spinRef.current.rotation.y = -toRadians(angle.current);
    if (wobbleRef.current) {
      const idle = current ? 0 : Math.sin(clock.elapsedTime * 1.4) * 0.02;
      wobbleRef.current.position.y = Math.abs(Math.sin(clock.elapsedTime * 24)) * 0.06 * energy + Math.max(idle, 0);
      wobbleRef.current.rotation.z = Math.sin(clock.elapsedTime * 19) * 0.07 * energy;
    }
  });

  return (
    <group>
      <mesh position={[0, -TABLE_THICKNESS / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[TABLE_RADIUS, TABLE_RADIUS * 0.97, TABLE_THICKNESS, 96]} />
        <meshStandardMaterial color={WOOD_SIDE} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[TABLE_RADIUS, 96]} />
        <meshStandardMaterial map={topTexture} roughness={0.42} />
      </mesh>
      <mesh position={[0, -TABLE_THICKNESS - 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.3, 1.8, 32]} />
        <meshStandardMaterial color={PEDESTAL} roughness={0.35} metalness={0.6} />
      </mesh>
      <mesh position={[0, -TABLE_THICKNESS - 1.78, 0]} castShadow>
        <cylinderGeometry args={[1.1, 1.2, 0.08, 48]} />
        <meshStandardMaterial color={PEDESTAL} roughness={0.35} metalness={0.6} />
      </mesh>
      <mesh position={[0, -TABLE_THICKNESS - 1.83, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[TABLE_RADIUS * 1.6, 64]} />
        <shadowMaterial opacity={0.35} />
      </mesh>

      {seats.map((name, index) => (
        <ShotGlass key={`${name}-${index}`} index={index} count={count} color={colors.ramp[spreadStop(index, count)]} active={index === winner} />
      ))}

      <group ref={spinRef} position={[0, BODY_RADIUS + 0.01, 0]}>
        <group ref={wobbleRef}>
          <group
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={(event) => {
              event.stopPropagation();
              if (!spinning) onSpin();
            }}
            onPointerOver={() => {
              document.body.style.cursor = spinning ? 'default' : 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default';
            }}
          >
            <mesh geometry={bottleGeometry} castShadow>
              <meshStandardMaterial color={colors.ramp[8]} transparent opacity={0.88} roughness={0.12} metalness={0.15} />
            </mesh>
            <mesh position={[0, -0.36, 0]}>
              <cylinderGeometry args={[BODY_RADIUS + 0.008, BODY_RADIUS + 0.008, 0.78, 48, 1, true]} />
              <meshStandardMaterial color={colors.ramp[3]} roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.36, 0]}>
              <cylinderGeometry args={[BODY_RADIUS + 0.012, BODY_RADIUS + 0.012, 0.16, 48, 1, true]} />
              <meshStandardMaterial color={colors.ramp[0]} roughness={0.5} />
            </mesh>
            <mesh position={[0, 1.24, 0]} castShadow>
              <cylinderGeometry args={[0.155, 0.155, 0.12, 24]} />
              <meshStandardMaterial color={colors.ramp[3]} roughness={0.4} metalness={0.3} />
            </mesh>
            <mesh position={[0.1, -0.25, 0.37]}>
              <boxGeometry args={[0.05, 1.4, 0.01]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

function CameraFit() {
  const { camera, size } = useThree();

  useEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    const tanHalf = Math.tan(toRadians(perspective.fov / 2));
    const aspect = size.width / size.height;
    const radius = TABLE_RADIUS + 0.2;
    const distance = Math.max(radius / (tanHalf * aspect), (radius * 0.92) / tanHalf) * 1.06;
    const elevation = toRadians(54);
    camera.position.set(0, Math.sin(elevation) * distance, Math.cos(elevation) * distance);
    camera.lookAt(0, -0.45, 0.15);
  }, [camera, size]);

  return null;
}

const IDLE_FPS = 24;

export default function Bottle3D(props: BottleSceneProps) {
  const colors = useSceneColors();

  return (
    <SceneCanvas camera={{ fov: 38, near: 0.1, far: 100, position: [0, 8, 6] }} active={props.spinning} idleFps={IDLE_FPS}>
      <CameraFit />
      <ambientLight intensity={0.55} color="#ffe3c2" />
      <hemisphereLight args={['#ffe7c4', '#2a160b', 0.45]} />
      <directionalLight
        position={[-4, 9, 5]}
        intensity={1.7}
        color="#ffdcae"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <BottleScene colors={colors} {...props} />
    </SceneCanvas>
  );
}
