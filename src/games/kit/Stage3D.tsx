// Khung chứa cảnh 3D: dùng WebGL khi trình duyệt hỗ trợ, nếu không hoặc cảnh gặp lỗi thì hiển thị giao diện dự phòng
'use client';

import { Component, type ReactNode } from 'react';
import useWebGLSupport from './useWebGLSupport';
import { cn } from '@/shared/lib/utils';

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function StageLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="animate-pulse text-sm font-semibold text-muted">Đang dựng cảnh 3D...</span>
    </div>
  );
}

interface Stage3DProps {
  scene: ReactNode;
  fallback: ReactNode;
  className?: string;
}

export default function Stage3D({ scene, fallback, className }: Stage3DProps) {
  const supported = useWebGLSupport();

  if (supported === false) return <>{fallback}</>;

  return (
    <div className={cn('relative', className)}>
      {supported === null ? <StageLoading /> : <SceneBoundary fallback={fallback}>{scene}</SceneBoundary>}
    </div>
  );
}
