// Vạch ngăn "hoặc" giữa đăng nhập Google và form email
export default function OrDivider() {
  return (
    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-muted">
      <span className="h-px flex-1 bg-line" />
      hoặc
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
