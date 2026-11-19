// Sóng hồ dùng chung: cùng một công thức chạy trên CPU để đặt vịt và trong vertex shader để mặt nước, dây phao, lá súng, vệt sóng tự nhấp nhô trên GPU, không phải ghi lại đỉnh hay ma trận mỗi khung hình
import * as THREE from 'three';

export type TimeUniform = { value: number };

export function waveHeight(x: number, z: number, time: number) {
  return Math.sin(x * 0.55 + time * 1.6) * 0.09 + Math.cos(z * 0.8 - time * 1.3) * 0.07 + Math.sin((x + z) * 0.9 + time * 2.1) * 0.04;
}

const WAVE_HEADER = `
uniform float uTime;
float pondWave(vec2 p) {
  return sin(p.x * 0.55 + uTime * 1.6) * 0.09 + cos(p.y * 0.8 - uTime * 1.3) * 0.07 + sin((p.x + p.y) * 0.9 + uTime * 2.1) * 0.04;
}
`;

const WAVE_PROJECT = `
vec4 mvPosition = vec4(transformed, 1.0);
#ifdef USE_INSTANCING
  mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelMatrix * mvPosition;
float pondLift = pondWave(mvPosition.xz);
mvPosition.y += pondLift;
mvPosition = viewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;
`;

export function ridesWaves<T extends THREE.Material>(material: T, time: TimeUniform, cacheKey: string): T {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = time;
    shader.vertexShader = WAVE_HEADER + shader.vertexShader.replace('#include <project_vertex>', WAVE_PROJECT);
  };
  material.customProgramCacheKey = () => `pond-wave-${cacheKey}`;
  return material;
}

export interface WaterLook {
  deep: string;
  shallow: string;
  foam: string;
  halfCanal: number;
  centerX: number;
  halfLength: number;
}

export function waterMaterial(time: TimeUniform, look: WaterLook) {
  const material = new THREE.MeshStandardMaterial({ roughness: 0.24, metalness: 0.06, flatShading: true });
  const uniforms = {
    uTime: time,
    uDeep: { value: new THREE.Color(look.deep) },
    uShallow: { value: new THREE.Color(look.shallow) },
    uFoam: { value: new THREE.Color(look.foam) },
    uHalfCanal: { value: look.halfCanal },
    uSpan: { value: new THREE.Vector2(look.centerX, look.halfLength) },
  };

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader =
      WAVE_HEADER +
      'varying vec2 vPondXZ;\nvarying float vPondLift;\n' +
      shader.vertexShader.replace('#include <project_vertex>', `${WAVE_PROJECT}\nvPondXZ = (modelMatrix * vec4(transformed, 1.0)).xz;\nvPondLift = pondLift;`);
    shader.fragmentShader =
      'uniform float uTime;\nuniform vec3 uDeep;\nuniform vec3 uShallow;\nuniform vec3 uFoam;\nuniform float uHalfCanal;\nuniform vec2 uSpan;\nvarying vec2 vPondXZ;\nvarying float vPondLift;\n' +
      shader.fragmentShader.replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        float shore = smoothstep(uHalfCanal - 1.5, uHalfCanal + 0.05, abs(vPondXZ.y));
        float ends = smoothstep(uSpan.y - 1.5, uSpan.y + 0.05, abs(vPondXZ.x - uSpan.x));
        float shallow = max(shore, ends);
        vec3 water = mix(uDeep, uShallow, shallow);
        float crest = smoothstep(0.07, 0.19, vPondLift);
        vec2 glintCell = floor(vPondXZ * 1.7);
        float glintSeed = fract(sin(dot(glintCell, vec2(127.1, 311.7))) * 43758.5453);
        vec2 glintSpot = fract(vPondXZ * 1.7) - 0.5 - (vec2(fract(glintSeed * 13.7), fract(glintSeed * 7.3)) - 0.5) * 0.5;
        float glint = step(0.9, glintSeed) * (1.0 - smoothstep(0.0, 0.1, length(glintSpot))) * max(0.0, sin(uTime * 2.4 + glintSeed * 60.0));
        water = mix(water, uFoam, crest * 0.2 + smoothstep(0.86, 1.0, shallow) * 0.5);
        diffuseColor.rgb = water + glint * 0.45;`,
      );
  };
  material.customProgramCacheKey = () => 'pond-water';
  return { material, uniforms };
}
