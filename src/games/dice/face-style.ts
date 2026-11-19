// Ánh xạ khoá icon của từng mặt xí ngầu sang component icon, và chỉ số ramp sang màu chữ/nền nhạt
import type { IconType } from 'react-icons';
import { FaBeer } from 'react-icons/fa';
import { FaDroplet, FaGlassWater, FaRotate, FaUser, FaUsers } from 'react-icons/fa6';
import { DICE_FACES, type DiceFace } from '@/data';
import { rampText, rampWash } from '@/shared/lib/ramp';

const ICONS: Record<string, IconType> = {
  beer: FaBeer,
  glass: FaGlassWater,
  droplet: FaDroplet,
  user: FaUser,
  skip: FaRotate,
  users: FaUsers,
};

export function getFace(faceId: number): DiceFace {
  return DICE_FACES.find((face) => face.id === faceId) ?? DICE_FACES[0];
}

export function faceStyle(face: DiceFace) {
  return { Icon: ICONS[face.icon] ?? FaBeer, color: rampText(face.ramp), wash: rampWash(face.ramp, 28) };
}
