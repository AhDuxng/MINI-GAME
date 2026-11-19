// Trả về font của trang khi web font đã tải xong (trước đó dùng sans-serif) để texture canvas được vẽ lại bằng đúng font
import { useEffect, useState } from 'react';
import { pageFontFamily } from './three-textures';

export default function usePageFont() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    document.fonts.ready.then(() => {
      if (active) setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  return loaded ? pageFontFamily() : 'sans-serif';
}
