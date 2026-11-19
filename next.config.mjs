// Cấu hình Next.js: header bảo mật (CSP chỉ cho phép Supabase và ảnh QR của SePay, chặn nhúng khung, HSTS) và chuyển hướng vĩnh viễn từ đường dẫn tiếng Việt cũ sang đường dẫn tiếng Anh (giữ cả tham số như mã phòng, gói, thể loại)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const isDev = process.env.NODE_ENV !== 'production';

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://qr.sepay.vn",
  "font-src 'self'",
  `connect-src 'self' ${supabaseUrl} ${supabaseUrl.replace(/^http/, 'ws')}`.trim(),
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
].join('; ');

const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
];

const RENAMED_PATHS = [
  ['/dang-nhap', '/login'],
  ['/dang-ky', '/signup'],
  ['/quen-mat-khau', '/forgot-password'],
  ['/doi-mat-khau', '/reset-password'],
  ['/tai-khoan', '/account'],
  ['/game/bau-cua', '/game/fish-prawn-crab'],
  ['/game/bom-so', '/game/number-bomb'],
  ['/game/chi-mat', '/game/most-likely'],
  ['/game/luat-bai', '/game/card-rules'],
  ['/game/xoay-chai', '/game/spin-bottle'],
  ['/game/nhanh-tay', '/game/quick-tap'],
  ['/game/doan-tren-tran', '/game/forehead'],
  ['/game/ve-doan', '/game/draw-guess'],
  ['/game/nay-hay-kia', '/game/would-you-rather'],
];

const RENAMED_CATEGORIES = [
  ['nhau', 'drinking'],
  ['nhom', 'group'],
  ['tri-tue', 'brain'],
];

const RENAMED_QUERIES = [
  { source: '/game/ma-soi', key: 'phong', destination: '/game/werewolf?room=:value' },
  { source: '/vip/thanh-toan', key: 'goi', destination: '/vip/checkout?plan=:value' },
  { source: '/', key: 'the-loai', destination: '/?category=:value' },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
  },
  async redirects() {
    return [
      ...RENAMED_CATEGORIES.map(([from, to]) => ({
        source: '/',
        has: [{ type: 'query', key: 'the-loai', value: from }],
        destination: `/?category=${to}`,
        permanent: true,
      })),
      ...RENAMED_QUERIES.map(({ source, key, destination }) => ({
        source,
        has: [{ type: 'query', key, value: '(?<value>.*)' }],
        destination,
        permanent: true,
      })),
      { source: '/game/ma-soi', destination: '/game/werewolf', permanent: true },
      { source: '/vip/thanh-toan', destination: '/vip/checkout', permanent: true },
      ...RENAMED_PATHS.map(([source, destination]) => ({ source, destination, permanent: true })),
    ];
  },
};

export default nextConfig;
