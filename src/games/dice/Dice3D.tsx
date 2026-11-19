// Cảnh 3D xí ngầu: khay nỉ xanh viền gỗ đặt trên sân bàn nỉ, xúc xắc vẽ mặt bằng canvas, tung lên xoay nhiều vòng rồi nảy và dừng với mặt kết quả hướng lên
'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { DICE_FACES, type DiceFace } from '@/data';
import { SceneCanvas, usePageFont, useSceneColors, type SceneColors, canvasTexture } from '@/games/kit/three';
import { randomBetween } from '@/shared/lib/random';
import { MATERIAL_FACE_IDS, restingEuler } from './dice-orientation';
import { ROLL_DURATION_MS, type SpinTurns } from './useDiceGame';

const DIE_SIZE = 1.6;
const HALF = DIE_SIZE / 2;
const RAIL = 0.22;

interface TableSize {
  width: number;
  depth: number;
}

function tableFor(aspect: number): TableSize {
  return aspect < 1 ? { width: 5.4, depth: 5.4 } : { width: 8, depth: 5.4 };
}
const BOUNCE_HEIGHT = 2.6;
const FELT = '#1b5e45';
const WOOD = '#7a4e2c';
const FACE_TEXTURE_SIZE = 512;

const PIPS: Record<number, [number, number][]> = {
  1: [[0, 0]],
  2: [[-1, -1], [1, 1]],
  3: [[-1, -1], [0, 0], [1, 1]],
  4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
};

function drawFace(context: CanvasRenderingContext2D, size: number, face: DiceFace, colors: SceneColors, font: string) {
  context.fillStyle = '#fbfaf6';
  context.fillRect(0, 0, size, size);
  context.lineWidth = size * 0.035;
  context.strokeStyle = '#f98f45';
  context.strokeRect(context.lineWidth / 2, context.lineWidth / 2, size - context.lineWidth, size - context.lineWidth);
  context.strokeStyle = '#12121a';

  const step = size * 0.17;
  PIPS[face.id].forEach(([dx, dy]) => {
    context.beginPath();
    context.arc(size / 2 + dx * step, size * 0.4 + dy * step, size * 0.066, 0, Math.PI * 2);
    context.fillStyle = colors.ramp[face.ramp];
    context.fill();
    context.lineWidth = size * 0.014;
    context.stroke();
  });

  context.fillStyle = '#12121a';
  context.font = `800 ${size * 0.12}px ${font}`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(face.label, size / 2, size * 0.8);
}

interface RollAnimation {
  start: number;
  fromRotation: THREE.Euler;
  toRotation: THREE.Euler;
  rest: THREE.Euler;
  fromPosition: THREE.Vector3;
  toPosition: THREE.Vector3;
}

function Die({ faceId, turns, colors, table }: { faceId: number; turns: SpinTurns; colors: SceneColors; table: TableSize }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const rollRef = useRef<RollAnimation | null>(null);
  const placed = useRef(false);
  const font = usePageFont();

  const materials = useMemo(
    () =>
      MATERIAL_FACE_IDS.map((id) => {
        const face = DICE_FACES.find((item) => item.id === id) ?? DICE_FACES[0];
        const texture = canvasTexture(FACE_TEXTURE_SIZE, (context, size) => drawFace(context, size, face, colors, font));
        return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.45 });
      }),
    [colors, font],
  );

  useEffect(
    () => () =>
      materials.forEach((material) => {
        material.map?.dispose();
        material.dispose();
      }),
    [materials],
  );

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const rest = restingEuler(faceId);

    if (!placed.current) {
      placed.current = true;
      mesh.rotation.copy(rest);
      mesh.position.set(0, HALF, 0);
      return;
    }

    const spin = () => (2 + Math.floor(Math.random() * 3)) * Math.PI * 2 * (Math.random() < 0.5 ? -1 : 1);
    rollRef.current = {
      start: performance.now(),
      fromRotation: mesh.rotation.clone(),
      toRotation: new THREE.Euler(rest.x + spin(), rest.y + spin(), rest.z + spin()),
      rest,
      fromPosition: mesh.position.clone(),
      toPosition: new THREE.Vector3(randomBetween(-1, 1) * (table.width / 2 - 1.6), HALF, randomBetween(-1, 1) * (table.depth / 2 - 1.6)),
    };
  }, [faceId, turns, table]);

  useFrame(() => {
    const mesh = meshRef.current;
    const roll = rollRef.current;
    if (!mesh || !roll) return;

    const t = Math.min((performance.now() - roll.start) / ROLL_DURATION_MS, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const lerp = THREE.MathUtils.lerp;

    mesh.rotation.set(
      lerp(roll.fromRotation.x, roll.toRotation.x, eased),
      lerp(roll.fromRotation.y, roll.toRotation.y, eased),
      lerp(roll.fromRotation.z, roll.toRotation.z, eased),
    );
    mesh.position.set(
      lerp(roll.fromPosition.x, roll.toPosition.x, eased),
      HALF + BOUNCE_HEIGHT * Math.pow(1 - t, 2) * Math.abs(Math.sin(2.5 * Math.PI * t)),
      lerp(roll.fromPosition.z, roll.toPosition.z, eased),
    );

    if (t >= 1) {
      mesh.rotation.copy(roll.rest);
      rollRef.current = null;
    }
  });

  return (
    <mesh ref={meshRef} material={materials} castShadow>
      <boxGeometry args={[DIE_SIZE, DIE_SIZE, DIE_SIZE]} />
    </mesh>
  );
}

function Table({ table }: { table: TableSize }) {
  const rails: [number, number, number, number][] = [
    [0, -(table.depth + RAIL) / 2, table.width + RAIL * 2, RAIL],
    [0, (table.depth + RAIL) / 2, table.width + RAIL * 2, RAIL],
    [-(table.width + RAIL) / 2, 0, RAIL, table.depth],
    [(table.width + RAIL) / 2, 0, RAIL, table.depth],
  ];

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[table.width, table.depth]} />
        <meshStandardMaterial color={FELT} roughness={1} />
      </mesh>
      {rails.map(([x, z, width, depth], index) => (
        <mesh key={index} position={[x, 0.14, z]} castShadow receiveShadow>
          <boxGeometry args={[width, 0.28, depth]} />
          <meshStandardMaterial color={WOOD} roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function DiceScene({ faceId, turns, colors }: { faceId: number; turns: SpinTurns; colors: SceneColors }) {
  const { camera, size } = useThree();
  const aspect = size.width / size.height;
  const table = useMemo(() => tableFor(aspect), [aspect]);

  useEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(perspective.fov / 2));
    const fitWidth = (table.width / 2 + RAIL + 0.3) / (tanHalf * aspect);
    const fitDepth = ((table.depth / 2 + RAIL + 0.9) * 0.8) / tanHalf;
    const distance = Math.max(fitWidth, fitDepth, 5);
    camera.position.set(0, distance * 0.8, distance * 0.6);
    camera.lookAt(0, 0, 0.3);
  }, [camera, aspect, table]);

  return (
    <>
      <hemisphereLight args={['#fffaf0', '#d9e4dc', 1.15]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[-4, 9, 5]}
        intensity={1.9}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <Table table={table} />
      <Die faceId={faceId} turns={turns} colors={colors} table={table} />
    </>
  );
}

export default function Dice3D({ faceId, turns, rolling }: { faceId: number; turns: SpinTurns; rolling: boolean }) {
  const colors = useSceneColors();

  return (
    <SceneCanvas camera={{ fov: 38, near: 0.1, far: 100, position: [0, 8, 6] }} active={rolling}>
      <DiceScene faceId={faceId} turns={turns} colors={colors} />
    </SceneCanvas>
  );
}
