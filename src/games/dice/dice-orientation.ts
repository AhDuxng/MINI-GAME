// Tính hướng nằm yên của xúc xắc: mặt kết quả hướng lên và chữ trên mặt đọc xuôi từ phía camera (mép trên của texture quay ra xa)
import * as THREE from 'three';

export const MATERIAL_FACE_IDS = [3, 4, 1, 6, 2, 5];

const FACE_UP_EULER: Record<number, [number, number, number]> = {
  1: [0, 0, 0],
  6: [Math.PI, 0, 0],
  2: [-Math.PI / 2, 0, 0],
  5: [Math.PI / 2, 0, 0],
  3: [0, 0, Math.PI / 2],
  4: [0, 0, -Math.PI / 2],
};

const TEXTURE_UP: Record<number, [number, number, number]> = {
  1: [0, 0, -1],
  6: [0, 0, 1],
  2: [0, 1, 0],
  5: [0, 1, 0],
  3: [0, 1, 0],
  4: [0, 1, 0],
};

const Y_AXIS = new THREE.Vector3(0, 1, 0);

export function restingEuler(faceId: number) {
  const faceUp = new THREE.Quaternion().setFromEuler(new THREE.Euler(...FACE_UP_EULER[faceId]));
  const textureUp = new THREE.Vector3(...TEXTURE_UP[faceId]).applyQuaternion(faceUp);
  const yaw = Math.PI - Math.atan2(textureUp.x, textureUp.z);
  const rest = new THREE.Quaternion().setFromAxisAngle(Y_AXIS, yaw).multiply(faceUp);
  return new THREE.Euler().setFromQuaternion(rest, 'XYZ');
}
