// Bảng vẽ cảm ứng: nét mượt nối bằng đường cong qua trung điểm, nét đã xong được gộp vào một lớp đệm nên mỗi khung hình chỉ vẽ lại nét đang kéo; lưu nét theo toạ độ tương đối để đổi cỡ màn hình vẫn đúng, có hoàn tác và xoá sạch
'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, type PointerEvent } from 'react';

export interface DrawingBoardHandle {
  undo: () => void;
  clear: () => void;
}

interface Stroke {
  color: string;
  size: number;
  points: [number, number][];
}

interface DrawingBoardProps {
  color: string;
  size: number;
  disabled: boolean;
}

const REFERENCE_WIDTH = 600;
const MAX_RATIO = 2;

function paintStroke(context: CanvasRenderingContext2D, stroke: Stroke, width: number, height: number) {
  const { points } = stroke;
  if (points.length === 0) return;
  context.strokeStyle = stroke.color;
  context.fillStyle = stroke.color;
  context.lineWidth = (stroke.size * width) / REFERENCE_WIDTH;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  if (points.length === 1) {
    context.beginPath();
    context.arc(points[0][0] * width, points[0][1] * height, context.lineWidth / 2, 0, Math.PI * 2);
    context.fill();
    return;
  }
  context.beginPath();
  context.moveTo(points[0][0] * width, points[0][1] * height);
  for (let index = 1; index < points.length - 1; index++) {
    const x = points[index][0] * width;
    const y = points[index][1] * height;
    const nextX = points[index + 1][0] * width;
    const nextY = points[index + 1][1] * height;
    context.quadraticCurveTo(x, y, (x + nextX) / 2, (y + nextY) / 2);
  }
  const last = points[points.length - 1];
  context.lineTo(last[0] * width, last[1] * height);
  context.stroke();
}

const DrawingBoard = forwardRef<DrawingBoardHandle, DrawingBoardProps>(function DrawingBoard({ color, size, disabled }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layer = useRef<HTMLCanvasElement | null>(null);
  const strokes = useRef<Stroke[]>([]);
  const active = useRef<{ pointer: number; stroke: Stroke } | null>(null);
  const frame = useRef(0);

  const present = useCallback(() => {
    frame.current = 0;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !layer.current) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(layer.current, 0, 0);
    if (active.current) paintStroke(context, active.current.stroke, canvas.width, canvas.height);
  }, []);

  const schedule = useCallback(() => {
    if (frame.current === 0) frame.current = requestAnimationFrame(present);
  }, [present]);

  const rebuild = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!layer.current) layer.current = document.createElement('canvas');
    layer.current.width = canvas.width;
    layer.current.height = canvas.height;
    const context = layer.current.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    strokes.current.forEach((stroke) => paintStroke(context, stroke, canvas.width, canvas.height));
    schedule();
  }, [schedule]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_RATIO);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      rebuild();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, [rebuild]);

  useImperativeHandle(
    ref,
    () => ({
      undo: () => {
        strokes.current = strokes.current.slice(0, -1);
        rebuild();
      },
      clear: () => {
        strokes.current = [];
        active.current = null;
        rebuild();
      },
    }),
    [rebuild],
  );

  const relative = (event: { clientX: number; clientY: number }, rect: DOMRect): [number, number] => [(event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height];

  const handleDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (disabled || active.current) return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      active.current = null;
    }
    active.current = { pointer: event.pointerId, stroke: { color, size, points: [relative(event, event.currentTarget.getBoundingClientRect())] } };
    schedule();
  };

  const handleMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const current = active.current;
    if (!current || current.pointer !== event.pointerId) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const samples = event.nativeEvent.getCoalescedEvents?.() ?? [];
    (samples.length > 0 ? samples : [event.nativeEvent]).forEach((sample) => current.stroke.points.push(relative(sample, rect)));
    schedule();
  };

  const handleUp = (event: PointerEvent<HTMLCanvasElement>) => {
    const current = active.current;
    if (!current || current.pointer !== event.pointerId) return;
    active.current = null;
    strokes.current = [...strokes.current, current.stroke];
    const canvas = canvasRef.current;
    const context = layer.current?.getContext('2d');
    if (canvas && context) paintStroke(context, current.stroke, canvas.width, canvas.height);
    schedule();
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
      data-tap-ignore
      className="absolute inset-0 h-full w-full touch-none"
      style={{ cursor: disabled ? 'default' : 'crosshair' }}
    />
  );
});

export default DrawingBoard;
