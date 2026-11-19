// Màn báo lỗi của từng trang: khi một phần của trang gặp sự cố thì hiện lời xin lỗi thân thiện, cho thử lại ngay hoặc về trang chủ thay vì trắng màn hình
'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { FaRotateRight } from 'react-icons/fa6';
import Button, { buttonStyles } from '@/shared/ui/Button';

export default function PageError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page flex flex-col items-start gap-5 py-20">
      <p className="text-ramp font-display text-6xl font-extrabold leading-none">Ối!</p>
      <h1 className="font-display text-3xl font-bold text-ink">Có trục trặc nhỏ</h1>
      <p className="max-w-md text-muted">Trang này vừa gặp lỗi. Bạn thử tải lại phần này, nếu vẫn chưa được thì quay về trang chủ chọn trò khác nhé.</p>
      <div className="flex flex-wrap gap-2">
        <Button size="lg" onClick={reset}>
          <FaRotateRight className="h-4 w-4" />
          Thử lại
        </Button>
        <Link href="/" className={buttonStyles({ size: 'lg', variant: 'secondary' })}>
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
