// Lưới an toàn quanh từng trò chơi: một game gặp lỗi thì chỉ phần bàn chơi hiện thông báo kèm nút chơi lại, phần còn lại của trang và các game khác vẫn dùng bình thường
'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { FaRotateRight } from 'react-icons/fa6';
import Button from '@/shared/ui/Button';

interface GameErrorBoundaryState {
  failed: boolean;
  attempt: number;
}

export default class GameErrorBoundary extends Component<{ children: ReactNode }, GameErrorBoundaryState> {
  state: GameErrorBoundaryState = { failed: false, attempt: 0 };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  restart = () => this.setState((current) => ({ failed: false, attempt: current.attempt + 1 }));

  render() {
    if (!this.state.failed) return <div key={this.state.attempt}>{this.props.children}</div>;
    return (
      <div role="alert" className="surface flex flex-col items-center gap-4 px-6 py-14 text-center">
        <p className="text-ramp font-display text-5xl font-extrabold">Ối!</p>
        <p className="font-display text-2xl font-bold text-ink">Trò chơi vừa gặp trục trặc</p>
        <p className="max-w-sm text-muted">Bấm chơi lại để bắt đầu ván mới. Danh sách người chơi vẫn được giữ nguyên.</p>
        <Button size="lg" onClick={this.restart}>
          <FaRotateRight className="h-4 w-4" />
          Chơi lại
        </Button>
      </div>
    );
  }
}
