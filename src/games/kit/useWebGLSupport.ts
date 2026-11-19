// Kiểm tra trình duyệt có hỗ trợ WebGL một lần cho cả phiên và giải phóng ngữ cảnh thử ngay; trả về null khi chưa kiểm tra xong (lúc render phía server)
import { useEffect, useState } from 'react';

let cached: boolean | null = null;

function detectWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    context?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(context);
  } catch {
    return false;
  }
}

export default function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(cached);

  useEffect(() => {
    if (cached === null) cached = detectWebGL();
    setSupported(cached);
  }, []);

  return supported;
}
