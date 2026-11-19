// Tạo texture cho cảnh 3D bằng canvas 2D: dùng chung font của trang để chữ tiếng Việt hiển thị đúng trên vật thể
import * as THREE from 'three';

export function pageFontFamily() {
  return getComputedStyle(document.body).fontFamily;
}

export function canvasTexture(size: number | [number, number], draw: (context: CanvasRenderingContext2D, width: number, height: number) => void) {
  const [width, height] = typeof size === 'number' ? [size, size] : size;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (context) draw(context, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function checkerTexture(dark: string, light: string, columns: number, rows = 2) {
  const cell = 16;
  const texture = canvasTexture([columns * cell, rows * cell], (context) => {
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        context.fillStyle = (row + column) % 2 === 0 ? dark : light;
        context.fillRect(column * cell, row * cell, cell, cell);
      }
    }
  });
  texture.magFilter = THREE.NearestFilter;
  return texture;
}
