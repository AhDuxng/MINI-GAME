// Phong cảnh tĩnh quanh hồ đua vịt: đất hai bờ có cỏ loang màu, cây tròn và thông, hàng bụi che mép đất, cỏ, hoa, đá, lau sậy, lá súng nổi theo sóng, bến gỗ xuất phát và dây cờ đuôi nheo; mỗi loại vật thể là một lệnh vẽ instanced duy nhất
'use client';

import { memo, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { SceneColors } from '@/games/kit/three';
import { START_X, buildScenery, landBlocks, type LilyPad, type Placement, type PondLand } from './pond-layout';
import { ridesWaves, type TimeUniform } from './pond-waves';

const GRASS_COLOR = '#a5d57e';
const EARTH_COLOR = '#b88a5b';
const WOOD_COLOR = '#ddb07a';
const TRUNK_COLOR = '#8b5d3b';
const TUFT_COLOR = '#84bf60';
const REED_COLOR = '#74a84e';
const CATTAIL_COLOR = '#7f512e';
const PAD_COLOR = '#58a85b';
const ROPE_COLOR = '#6b5a4a';

function patchyGrass(material: THREE.MeshStandardMaterial) {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = 'varying vec2 vGrassXZ;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvGrassXZ = (modelMatrix * vec4(transformed, 1.0)).xz;');
    shader.fragmentShader =
      'varying vec2 vGrassXZ;\n' +
      shader.fragmentShader.replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        float patchy = sin(vGrassXZ.x * 0.31 + sin(vGrassXZ.y * 0.23) * 2.0) * sin(vGrassXZ.y * 0.41 - vGrassXZ.x * 0.13);
        float speckle = sin(vGrassXZ.x * 2.7 + vGrassXZ.y * 1.9) * sin(vGrassXZ.y * 3.1 - vGrassXZ.x * 1.3);
        diffuseColor.rgb *= 0.95 + patchy * 0.07 + speckle * 0.025;`,
      );
  };
  material.customProgramCacheKey = () => 'pond-grass';
  return material;
}

function useSceneryKit(bloomColor: string, time: TimeUniform) {
  const kit = useMemo(() => {
    const material = (color: string, flatShading = true) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, flatShading });
    const flag = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([-0.14, 0, 0, 0.14, 0, 0, 0, -0.3, 0], 3));
    flag.computeVertexNormals();
    return {
      trunk: new THREE.CylinderGeometry(0.12, 0.17, 1, 6).translate(0, 0.5, 0),
      crown: new THREE.IcosahedronGeometry(0.85, 0),
      pine: new THREE.ConeGeometry(1, 1, 7).translate(0, 0.5, 0),
      bush: new THREE.IcosahedronGeometry(0.6, 0),
      tuft: new THREE.ConeGeometry(0.11, 0.34, 4).translate(0, 0.17, 0),
      flower: new THREE.IcosahedronGeometry(0.09, 0),
      rock: new THREE.DodecahedronGeometry(1, 0),
      reed: new THREE.CylinderGeometry(0.028, 0.045, 1, 5).translate(0, 0.5, 0),
      cattail: new THREE.CylinderGeometry(0.07, 0.07, 0.3, 6),
      pad: new THREE.CircleGeometry(1, 16, 0.35, Math.PI * 2 - 0.7).rotateX(-Math.PI / 2),
      bloom: new THREE.IcosahedronGeometry(1, 0),
      box: new THREE.BoxGeometry(1, 1, 1),
      pole: new THREE.CylinderGeometry(0.05, 0.06, 1, 6).translate(0, 0.5, 0),
      rope: new THREE.CylinderGeometry(0.014, 0.014, 1, 4),
      flag,
      grass: patchyGrass(material(GRASS_COLOR)),
      earth: material(EARTH_COLOR),
      wood: material(WOOD_COLOR),
      bark: material(TRUNK_COLOR),
      leaves: material('#ffffff'),
      tuftLeaves: material(TUFT_COLOR),
      petals: material('#ffffff'),
      stone: material('#ffffff'),
      reedLeaves: material(REED_COLOR, false),
      reedHeads: material(CATTAIL_COLOR),
      twine: material(ROPE_COLOR),
      flags: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.7, side: THREE.DoubleSide }),
      padLeaves: ridesWaves(new THREE.MeshStandardMaterial({ color: PAD_COLOR, roughness: 0.6, flatShading: true }), time, 'pad'),
      blooms: ridesWaves(material(bloomColor), time, 'bloom'),
    };
  }, [bloomColor, time]);

  useEffect(
    () => () => {
      Object.values(kit).forEach((item) => item.dispose());
    },
    [kit],
  );

  return kit;
}

interface ScatterProps {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  items: Placement[];
  shadow?: boolean;
}

function Scatter({ geometry, material, items, shadow = false }: ScatterProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    items.forEach((item, index) => {
      dummy.position.set(...item.position);
      dummy.rotation.set(...(item.rotation ?? [0, 0, 0]));
      dummy.scale.set(...item.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      if (item.color) mesh.setColorAt(index, color.set(item.color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items]);

  if (items.length === 0) return null;
  return <instancedMesh key={items.length} ref={meshRef} args={[geometry, material, items.length]} castShadow={shadow} receiveShadow={shadow} />;
}

function padPlacements(pads: LilyPad[]) {
  const leaves: Placement[] = pads.map((pad) => ({ position: [pad.x, 0.03, pad.z], scale: [pad.size, 1, pad.size], rotation: [0, pad.turn, 0] }));
  const blooms: Placement[] = pads
    .filter((pad) => pad.bloom)
    .map((pad) => ({ position: [pad.x, 0.1, pad.z], scale: [pad.size * 0.42, pad.size * 0.3, pad.size * 0.42] }));
  return { leaves, blooms };
}

interface PondSceneryProps {
  land: PondLand;
  halfWidth: number;
  portrait: boolean;
  colors: SceneColors;
  time: TimeUniform;
}

function PondScenery({ land, halfWidth, portrait, colors, time }: PondSceneryProps) {
  const kit = useSceneryKit(colors.ramp[4], time);
  const flowerColors = useMemo(() => [...colors.ramp.slice(0, 5), '#ffffff'], [colors.ramp]);
  const flagColors = useMemo(() => [0, 2, 7, 1, 3, 6, 4, 8].map((stop) => colors.ramp[stop]), [colors.ramp]);
  const scenery = useMemo(() => buildScenery(land, halfWidth, portrait, flowerColors, flagColors), [land, halfWidth, portrait, flowerColors, flagColors]);
  const pads = useMemo(() => padPlacements(scenery.pads), [scenery.pads]);
  const blocks = useMemo(() => landBlocks(land), [land]);
  const ground = useMemo(() => [kit.earth, kit.earth, kit.grass, kit.earth, kit.earth, kit.earth], [kit]);

  return (
    <>
      {blocks.map((block) => (
        <mesh key={block.position.join(':')} position={block.position} scale={block.size} geometry={kit.box} material={ground} receiveShadow />
      ))}
      <mesh geometry={kit.box} material={kit.wood} position={[START_X - 1.5, 0.1, 0]} scale={[0.5, 0.2, land.halfCanal * 2]} castShadow receiveShadow />
      {[-1, 1].map((side) => (
        <mesh key={side} geometry={kit.box} material={kit.wood} position={[START_X - 1.5, 0.45, side * (land.halfCanal - 0.2)]} scale={[0.22, 1.1, 0.22]} castShadow />
      ))}
      <Scatter geometry={kit.trunk} material={kit.bark} items={scenery.trunks} shadow />
      <Scatter geometry={kit.crown} material={kit.leaves} items={scenery.crowns} shadow />
      <Scatter geometry={kit.pine} material={kit.leaves} items={scenery.pines} shadow />
      <Scatter geometry={kit.bush} material={kit.leaves} items={scenery.bushes} shadow />
      <Scatter geometry={kit.rock} material={kit.stone} items={scenery.rocks} shadow />
      <Scatter geometry={kit.tuft} material={kit.tuftLeaves} items={scenery.tufts} />
      <Scatter geometry={kit.flower} material={kit.petals} items={scenery.flowers} />
      <Scatter geometry={kit.reed} material={kit.reedLeaves} items={scenery.reeds} />
      <Scatter geometry={kit.cattail} material={kit.reedHeads} items={scenery.cattails} />
      <Scatter geometry={kit.pad} material={kit.padLeaves} items={pads.leaves} />
      <Scatter geometry={kit.bloom} material={kit.blooms} items={pads.blooms} />
      <Scatter geometry={kit.pole} material={kit.wood} items={scenery.poles} shadow />
      <Scatter geometry={kit.rope} material={kit.twine} items={scenery.ropes} />
      <Scatter geometry={kit.flag} material={kit.flags} items={scenery.flags} shadow />
    </>
  );
}

export default memo(PondScenery);
