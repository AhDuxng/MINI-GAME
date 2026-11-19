// Trang tài khoản người dùng
import type { Metadata } from 'next';
import AccountView from './AccountView';

export const metadata: Metadata = { title: 'Tài khoản' };

export default function AccountPage() {
  return (
    <div className="page pb-28 pt-6 md:py-10">
      <h1 className="mb-6 font-display text-3xl font-extrabold text-ink md:text-4xl">Tài khoản</h1>
      <AccountView />
    </div>
  );
}
