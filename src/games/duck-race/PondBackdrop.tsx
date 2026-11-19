// Phông nền minh hoạ phía sau hồ đua vịt: bầu trời chuyển màu, mặt trời toả tia, mây và chim bay chậm, ba lớp núi đá vôi, đồi cây, nhà mái đỏ lát ngang liền mạch; cảnh 3D ghim các lớp núi vào đường chân trời và trượt lệch nhau tạo chiều sâu
import type { CSSProperties, MutableRefObject } from 'react';

export const BACKDROP_LAYER_HEIGHT = 0.4;
export const BACKDROP_PARALLAX = [3, 6, 11];

interface Peak {
  x: number;
  top: number;
  width: number;
}

function seeded(seed: number) {
  let state = seed;
  return () => {
    const value = Math.sin(state++ * 91.7 + 47.3) * 24634.6345;
    return value - Math.floor(value);
  };
}

function karstPeaks(width: number, count: number, highest: number, lowest: number, seed: number): Peak[] {
  const random = seeded(seed);
  return Array.from({ length: count }, (_, index) => ({
    x: ((index + 0.2 + random() * 0.6) / count) * width,
    top: highest + random() * (lowest - highest),
    width: 120 + random() * 110,
  }));
}

function karstPolygons(peaks: Peak[], width: number, height: number) {
  const base = height + 4;
  const shapes: { lit: string; shade: string }[] = [];
  for (const peak of peaks) {
    for (const offset of [-width, 0, width]) {
      const x = peak.x + offset;
      const half = peak.width / 2;
      if (x + half < 0 || x - half > width) continue;
      const rise = base - peak.top;
      const crown: [number, number][] = [
        [x - half, base],
        [x - half * 0.62, peak.top + rise * 0.34],
        [x - half * 0.3, peak.top + rise * 0.06],
        [x, peak.top],
        [x + half * 0.26, peak.top + rise * 0.08],
        [x + half * 0.6, peak.top + rise * 0.4],
        [x + half, base],
      ];
      const shade: [number, number][] = [crown[3], crown[4], crown[5], crown[6], [x + half * 0.12, base], [x + half * 0.05, peak.top + rise * 0.45]];
      const toPoints = (points: [number, number][]) => points.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(' ');
      shapes.push({ lit: toPoints(crown), shade: toPoints(shade) });
    }
  }
  return shapes;
}

function svgUrl(svg: string) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function karstTile(width: number, height: number, peaks: Peak[], colors: { lit: string; shade: string; haze: string }) {
  const shapes = karstPolygons(peaks, width, height);
  const gradient = (id: string, top: string) =>
    `<linearGradient id='${id}' x1='0' y1='0' x2='0' y2='1'><stop offset='0.15' stop-color='${top}'/><stop offset='0.95' stop-color='${colors.haze}'/></linearGradient>`;
  const body = shapes.map(({ lit, shade }) => `<polygon points='${lit}' fill='url(#l)'/><polygon points='${shade}' fill='url(#s)'/>`).join('');
  return svgUrl(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'><defs>${gradient('l', colors.lit)}${gradient('s', colors.shade)}</defs>${body}</svg>`,
  );
}

function hillsTile(width: number, height: number) {
  const random = seeded(29);
  const ridge = (x: number) => height * 0.8 - 20 * Math.sin((2 * Math.PI * x) / width + 0.6) - 9 * Math.sin((6 * Math.PI * x) / width + 1.7);
  const points: string[] = [];
  for (let x = 0; x <= width; x += 15) points.push(`${x},${ridge(x).toFixed(1)}`);
  const hill = `<polygon points='0,${height} ${points.join(' ')} ${width},${height}' fill='#a3d18a'/>`;
  const trees: string[] = [];
  const greens = ['#78bb6f', '#6aad68', '#86c477', '#5fa063'];
  for (let x = 6; x < width; x += 14 + random() * 22) {
    if (random() < 0.18) continue;
    const y = ridge(x);
    const size = 8 + random() * 9;
    const color = greens[Math.floor(random() * greens.length)];
    if (random() < 0.3) {
      trees.push(`<polygon points='${x - size * 0.6},${y + 3} ${x},${y - size * 2.1} ${x + size * 0.6},${y + 3}' fill='${color}'/>`);
    } else {
      trees.push(`<rect x='${x - 1.2}' y='${y - 3}' width='2.4' height='7' fill='#8b6a4b'/><circle cx='${x}' cy='${y - size * 0.75}' r='${size}' fill='${color}'/>`);
    }
  }
  const houses = [width * 0.28, width * 0.71].map((x) => {
    const y = ridge(x) + 4;
    return `<rect x='${x - 11}' y='${y - 13}' width='22' height='15' fill='#f6efe1'/><polygon points='${x - 15},${y - 12} ${x},${y - 25} ${x + 15},${y - 12}' fill='#d9604c'/><rect x='${x - 3}' y='${y - 7}' width='6' height='9' fill='#8b5d3b'/>`;
  });
  const meadow = `<rect x='0' y='${height * 0.9}' width='${width}' height='${height * 0.1 + 2}' fill='#a7d48c'/>`;
  return svgUrl(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'>${trees.join('')}${hill}${houses.join('')}${meadow}</svg>`,
  );
}

const TILE_HEIGHT = 400;
const FAR_TILE = karstTile(1000, TILE_HEIGHT, karstPeaks(1000, 7, 110, 200, 7), { lit: '#b4d6e3', shade: '#9cc4d6', haze: '#dcefee' });
const MID_TILE = karstTile(820, TILE_HEIGHT, karstPeaks(820, 5, 190, 250, 13), { lit: '#94c6b8', shade: '#7cb2a5', haze: '#c3e1d4' });
const NEAR_TILE = hillsTile(640, TILE_HEIGHT);
const HORIZON_GLOW = 'linear-gradient(0deg, rgb(232 246 240) 0%, rgb(232 246 240 / 0.85) 18%, rgb(232 246 240 / 0) 62%)';

const LAYERS: { background: string; size: string }[] = [
  { background: `${FAR_TILE}, ${HORIZON_GLOW}`, size: 'auto 100%, 100% 100%' },
  { background: MID_TILE, size: 'auto 100%' },
  { background: NEAR_TILE, size: 'auto 100%' },
];

const CLOUDS = [
  { top: '7%', width: 150, duration: 95, delay: -20 },
  { top: '15%', width: 110, duration: 120, delay: -75 },
  { top: '4%', width: 90, duration: 140, delay: -110 },
  { top: '20%', width: 130, duration: 105, delay: -50 },
];

const BIRDS = [
  { top: '12%', duration: 46, delay: -8, scale: 1 },
  { top: '16%', duration: 52, delay: -12, scale: 0.75 },
  { top: '10%', duration: 58, delay: -30, scale: 0.85 },
];

function Cloud({ width }: { width: number }) {
  const shape = (
    <>
      <circle cx={52} cy={52} r={26} />
      <circle cx={88} cy={38} r={32} />
      <circle cx={126} cy={50} r={24} />
      <circle cx={150} cy={62} r={16} />
      <rect x={30} y={56} width={136} height={22} rx={11} />
    </>
  );
  return (
    <svg viewBox="0 0 190 86" width={width} height={(width * 86) / 190}>
      <g fill="#cfe5f2" transform="translate(0 6)">
        {shape}
      </g>
      <g fill="#ffffff">{shape}</g>
    </svg>
  );
}

const SUN_RAYS: CSSProperties = {
  background: 'repeating-conic-gradient(from 0deg, rgb(255 246 205 / 0.42) 0deg 7deg, transparent 7deg 22deg)',
  maskImage: 'radial-gradient(circle, black 18%, transparent 68%)',
  WebkitMaskImage: 'radial-gradient(circle, black 18%, transparent 68%)',
};

export default function PondBackdrop({ layersRef }: { layersRef: MutableRefObject<(HTMLDivElement | null)[]> }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(180deg, #6dbde6 0%, #9fd6ee 38%, #cdebf0 70%, #e6f5ef 100%)' }}>
      <div className="absolute right-[6%] top-[-6%] h-56 w-56 sm:right-[10%] sm:h-72 sm:w-72">
        <div className="absolute inset-0 animate-[spin_140s_linear_infinite]" style={SUN_RAYS} />
        <div className="absolute inset-[34%] rounded-full" style={{ background: 'radial-gradient(circle, #fffbe6 0%, #fff1b8 55%, #ffe58f 100%)', boxShadow: '0 0 40px 18px rgb(255 240 180 / 0.55)' }} />
      </div>

      {CLOUDS.map((cloud) => (
        <div key={cloud.top + cloud.width} className="absolute inset-x-0 animate-drift" style={{ top: cloud.top, animationDuration: `${cloud.duration}s`, animationDelay: `${cloud.delay}s` }}>
          <Cloud width={cloud.width} />
        </div>
      ))}

      {BIRDS.map((bird) => (
        <div key={bird.top + bird.duration} className="absolute inset-x-0 animate-drift" style={{ top: bird.top, animationDuration: `${bird.duration}s`, animationDelay: `${bird.delay}s` }}>
          <svg viewBox="0 0 24 10" width={22 * bird.scale} height={10 * bird.scale} className="animate-flap overflow-visible">
            <path d="M1 7 Q 6 1 12 7 Q 18 1 23 7" fill="none" stroke="#3f5f6b" strokeWidth={2} strokeLinecap="round" />
          </svg>
        </div>
      ))}

      {LAYERS.map((layer, index) => (
        <div
          key={index}
          ref={(node) => {
            layersRef.current[index] = node;
          }}
          className="absolute left-[-100%] top-0 w-[300%] will-change-transform"
          style={{
            height: `${BACKDROP_LAYER_HEIGHT * 100}%`,
            backgroundImage: layer.background,
            backgroundSize: layer.size,
            backgroundRepeat: 'repeat-x, no-repeat',
            backgroundPosition: 'bottom',
            transform: 'translate3d(0, 120%, 0)',
          }}
        />
      ))}
    </div>
  );
}
