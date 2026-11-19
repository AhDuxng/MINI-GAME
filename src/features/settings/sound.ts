// Hiệu ứng âm thanh tổng hợp bằng Web Audio API, dùng chung một AudioContext để tránh giới hạn của trình duyệt
type Note = {
  frequency: number;
  at: number;
  duration: number;
  wave?: OscillatorType;
  volume?: number;
};

export type SoundName = 'success' | 'roll' | 'tick' | 'fail' | 'pop' | 'start';

const SOUNDS: Record<SoundName, Note[]> = {
  success: [
    { frequency: 523.25, at: 0, duration: 0.2 },
    { frequency: 659.25, at: 0.1, duration: 0.2 },
    { frequency: 783.99, at: 0.2, duration: 0.2 },
    { frequency: 1046.5, at: 0.3, duration: 0.4 },
  ],
  roll: [
    { frequency: 220, at: 0, duration: 0.06, wave: 'square', volume: 0.08 },
    { frequency: 260, at: 0.08, duration: 0.06, wave: 'square', volume: 0.08 },
    { frequency: 200, at: 0.16, duration: 0.06, wave: 'square', volume: 0.08 },
    { frequency: 280, at: 0.24, duration: 0.06, wave: 'square', volume: 0.08 },
  ],
  tick: [{ frequency: 1200, at: 0, duration: 0.04, wave: 'square', volume: 0.05 }],
  fail: [
    { frequency: 392, at: 0, duration: 0.18, wave: 'sawtooth', volume: 0.12 },
    { frequency: 311.13, at: 0.18, duration: 0.18, wave: 'sawtooth', volume: 0.12 },
    { frequency: 233.08, at: 0.36, duration: 0.4, wave: 'sawtooth', volume: 0.12 },
  ],
  pop: [
    { frequency: 880, at: 0, duration: 0.08, volume: 0.2 },
    { frequency: 1318.51, at: 0.06, duration: 0.15, volume: 0.2 },
  ],
  start: [
    { frequency: 659.25, at: 0, duration: 0.12 },
    { frequency: 987.77, at: 0.12, duration: 0.3 },
  ],
};

let sharedContext: AudioContext | null = null;

function getContext() {
  if (typeof window === 'undefined') return null;

  if (!sharedContext) {
    const AudioContextClass =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    sharedContext = new AudioContextClass();
  }

  if (sharedContext.state === 'suspended') void sharedContext.resume();
  return sharedContext;
}

function playNote(context: AudioContext, note: Note) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const start = context.currentTime + note.at;
  const peak = note.volume ?? 0.3;

  oscillator.type = note.wave ?? 'triangle';
  oscillator.frequency.value = note.frequency;
  oscillator.connect(gain);
  gain.connect(context.destination);

  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peak, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, start + note.duration);

  oscillator.start(start);
  oscillator.stop(start + note.duration + 0.05);
}

export function playSound(name: SoundName) {
  const context = getContext();
  if (!context) return;
  SOUNDS[name].forEach((note) => playNote(context, note));
}
