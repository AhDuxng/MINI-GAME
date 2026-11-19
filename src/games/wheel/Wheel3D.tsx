// Cảnh 3D vòng quay kiểu sân khấu truyền hình: bánh xe viền vàng có đèn chạy, giá đỡ tím than dưới đèn rọi, mặt trước vẽ ô và chữ bằng canvas, chốt quanh vành gảy kim mỗi khi đi qua
'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { SceneCanvas, usePageFont, useSceneColors, type SceneColors, canvasTexture } from '@/games/kit/three';
import { truncate } from '@/shared/lib/utils';
import { SPIN_DURATION_S, isLeftHalf, labelStyle, segmentColor } from './wheel-geometry';

const RADIUS = 3;
const DEPTH = 0.45;
const FACE_Z = DEPTH / 2 + 0.003;
const TEXTURE_SIZE = 1024;
const SVG_VIEWBOX = 500;
const POINTER_ANGLE = 270;
const FLICK_ANGLE = 0.45;
const MIN_TICK_GAP_MS = 45;

const BULB_COUNT = 28;
const GOLD = '#e2b04a';
const PLUM = '#2a1a45';
const PLUM_LIGHT = '#3d2763';

const toRadians = THREE.MathUtils.degToRad;
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

function drawWheelFace(context: CanvasRenderingContext2D, size: number, segments: string[], palette: string[], colors: SceneColors, font: string) {
  const center = size / 2;
  const count = segments.length;
  const slice = (Math.PI * 2) / Math.max(count, 1);
  const { fontSize, maxChars } = labelStyle(count);

  context.fillStyle = colors.elevated;
  context.fillRect(0, 0, size, size);

  segments.forEach((label, index) => {
    const start = index * slice;
    const middle = start + slice / 2;
    context.beginPath();
    context.moveTo(center, center);
    context.arc(center, center, center, start, start + slice);
    context.closePath();
    context.fillStyle = segmentColor(index, count, palette);
    context.fill();
    context.lineWidth = 6;
    context.strokeStyle = '#fffaf0';
    context.stroke();

    context.save();
    context.translate(center + Math.cos(middle) * center * 0.6, center + Math.sin(middle) * center * 0.6);
    context.rotate(isLeftHalf(THREE.MathUtils.radToDeg(middle)) ? middle + Math.PI : middle);
    context.fillStyle = '#12121a';
    context.font = `700 ${(fontSize * size) / SVG_VIEWBOX}px ${font}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(truncate(label, maxChars), 0, 0);
    context.restore();
  });
}

interface WheelModelProps {
  segments: string[];
  palette: string[];
  colors: SceneColors;
  rotation: number;
  isSpinning: boolean;
  canSpin: boolean;
  onSpin: () => void;
  onSpinEnd: () => void;
  onTick: () => void;
}

function WheelModel({ segments, palette, colors, rotation, isSpinning, canSpin, onSpin, onSpinEnd, onTick }: WheelModelProps) {
  const font = usePageFont();
  const standRef = useRef<THREE.Group>(null);
  const wheelRef = useRef<THREE.Group>(null);
  const pointerRef = useRef<THREE.Group>(null);
  const angle = useRef(rotation);
  const spin = useRef<{ from: number; to: number; start: number } | null>(null);
  const flick = useRef(0);
  const lastCrossing = useRef<number | null>(null);
  const lastTickAt = useRef(0);
  const count = segments.length;
  const slice = 360 / Math.max(count, 1);

  const faceTexture = useMemo(
    () => canvasTexture(TEXTURE_SIZE, (context, size) => drawWheelFace(context, size, segments, palette, colors, font)),
    [segments, palette, colors, font],
  );
  const hubTexture = useMemo(
    () =>
      canvasTexture(256, (context, size) => {
        context.fillStyle = PLUM;
        context.fillRect(0, 0, size, size);
        context.fillStyle = '#f6cf6b';
        context.font = `800 ${size * 0.24}px ${font}`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('QUAY', size / 2, size / 2 + size * 0.02);
      }),
    [font],
  );
  const bulbs = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: '#fff3c4', emissive: '#ffd27a', emissiveIntensity: 1 }),
      new THREE.MeshStandardMaterial({ color: '#fff3c4', emissive: '#ffd27a', emissiveIntensity: 0.15 }),
    ],
    [],
  );
  const pointerShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.3, 0);
    shape.lineTo(0.3, 0);
    shape.lineTo(0, -0.75);
    shape.closePath();
    return shape;
  }, []);

  useEffect(() => () => faceTexture.dispose(), [faceTexture]);
  useEffect(() => () => hubTexture.dispose(), [hubTexture]);
  useEffect(() => () => bulbs.forEach((material) => material.dispose()), [bulbs]);

  useEffect(() => {
    if (isSpinning && rotation !== angle.current) {
      spin.current = { from: angle.current, to: rotation, start: performance.now() };
    } else if (!isSpinning) {
      angle.current = rotation;
    }
  }, [rotation, isSpinning]);

  useFrame(({ clock }, delta) => {
    const current = spin.current;
    if (current) {
      const t = Math.min((performance.now() - current.start) / (SPIN_DURATION_S * 1000), 1);
      angle.current = current.from + (current.to - current.from) * easeOutQuint(t);
      if (t >= 1) {
        spin.current = null;
        onSpinEnd();
      }
    }

    const crossing = Math.floor((angle.current - POINTER_ANGLE) / slice);
    if (current && lastCrossing.current !== null && crossing !== lastCrossing.current) {
      flick.current = -FLICK_ANGLE;
      const now = performance.now();
      if (now - lastTickAt.current > MIN_TICK_GAP_MS) {
        lastTickAt.current = now;
        onTick();
      }
    }
    lastCrossing.current = crossing;
    flick.current *= Math.exp(-delta * 14);

    if (wheelRef.current) wheelRef.current.rotation.z = -toRadians(angle.current);
    if (pointerRef.current) pointerRef.current.rotation.z = flick.current;
    if (standRef.current) standRef.current.rotation.y = current ? 0 : Math.sin(clock.elapsedTime * 0.6) * 0.14;
    const phase = Math.floor(clock.elapsedTime * (current ? 10 : 3)) % 2;
    bulbs[0].emissiveIntensity = phase === 0 ? 1.1 : 0.15;
    bulbs[1].emissiveIntensity = phase === 0 ? 0.15 : 1.1;
  });

  const pegs = Array.from({ length: count }, (_, index) => -toRadians(index * slice));

  return (
    <group ref={standRef}>
      <group ref={wheelRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[RADIUS, RADIUS, DEPTH, 96]} />
          <meshStandardMaterial color={GOLD} roughness={0.32} metalness={0.45} />
        </mesh>
        {Array.from({ length: BULB_COUNT }, (_, index) => {
          const theta = (index / BULB_COUNT) * Math.PI * 2;
          return (
            <mesh key={`bulb-${index}`} position={[Math.cos(theta) * RADIUS * 0.98, Math.sin(theta) * RADIUS * 0.98, FACE_Z + 0.03]} material={bulbs[index % 2]}>
              <sphereGeometry args={[0.055, 12, 12]} />
            </mesh>
          );
        })}
        <mesh position={[0, 0, FACE_Z]} receiveShadow>
          <circleGeometry args={[RADIUS * 0.96, 96]} />
          <meshStandardMaterial map={faceTexture} roughness={0.55} />
        </mesh>
        {pegs.map((theta, index) => (
          <mesh key={index} position={[Math.cos(theta) * RADIUS * 0.92, Math.sin(theta) * RADIUS * 0.92, FACE_Z + 0.13]} rotation={[0, 0, theta]} castShadow>
            <boxGeometry args={[0.1, 0.1, 0.26]} />
            <meshStandardMaterial color={colors.ramp[1]} roughness={0.35} metalness={0.2} />
          </mesh>
        ))}
      </group>

      <group
        position={[0, 0, FACE_Z + 0.2]}
        onClick={(event) => {
          event.stopPropagation();
          if (canSpin) onSpin();
        }}
        onPointerOver={() => {
          document.body.style.cursor = canSpin ? 'pointer' : 'default';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.62, 0.62, 0.4, 48]} />
          <meshStandardMaterial color={GOLD} roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.201]}>
          <circleGeometry args={[0.58, 48]} />
          <meshBasicMaterial map={hubTexture} toneMapped={false} />
        </mesh>
      </group>

      <group ref={pointerRef} position={[0, RADIUS + 0.42, FACE_Z + 0.12]}>
        <mesh castShadow>
          <extrudeGeometry args={[pointerShape, { depth: 0.16, bevelEnabled: false }]} />
          <meshStandardMaterial color={colors.ramp[3]} roughness={0.4} />
        </mesh>
      </group>

      <mesh position={[0, -(RADIUS + 0.55) / 2, -DEPTH / 2 - 0.2]} castShadow>
        <boxGeometry args={[0.45, RADIUS + 0.55, 0.3]} />
        <meshStandardMaterial color={PLUM_LIGHT} roughness={0.5} />
      </mesh>
      <mesh position={[0, -RADIUS - 0.72, -0.1]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.35, 1.5]} />
        <meshStandardMaterial color={PLUM} roughness={0.5} />
      </mesh>
      <mesh position={[0, -RADIUS - 0.53, -0.1]}>
        <boxGeometry args={[3.42, 0.04, 1.52]} />
        <meshStandardMaterial color={GOLD} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, -RADIUS - 0.9, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <shadowMaterial opacity={0.35} />
      </mesh>
    </group>
  );
}

function CameraFit() {
  const { camera, size } = useThree();

  useEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    const tanHalf = Math.tan(toRadians(perspective.fov / 2));
    const aspect = size.width / size.height;
    const fitHeight = (RADIUS + 1.1) / tanHalf;
    const fitWidth = (RADIUS + 0.6) / (tanHalf * aspect);
    const distance = Math.max(fitHeight, fitWidth) * 1.05;
    camera.position.set(0, 0.6, distance);
    camera.lookAt(0, -0.2, 0);
  }, [camera, size]);

  return null;
}

interface Wheel3DProps extends Omit<WheelModelProps, 'palette' | 'colors'> {
  stops: number[];
}

const IDLE_FPS = 24;

export default function Wheel3D({ stops, ...props }: Wheel3DProps) {
  const colors = useSceneColors();
  const palette = useMemo(() => stops.map((stop) => colors.ramp[stop]), [stops, colors]);

  return (
    <SceneCanvas camera={{ fov: 35, near: 0.1, far: 100, position: [0, 0.6, 14] }} active={props.isSpinning} idleFps={IDLE_FPS}>
      <CameraFit />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2, -3]} color="#b48cf0" intensity={18} distance={14} />
      <spotLight position={[0, 9, 6]} angle={0.5} penumbra={0.7} intensity={110} color="#fff1d6" />
      <directionalLight
        position={[-4, 6, 8]}
        intensity={1.7}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <WheelModel palette={palette} colors={colors} {...props} />
    </SceneCanvas>
  );
}
