'use client';

import WheelGame from '@/components/features/wheel/WheelGame';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa6';

export default function WheelPage() {
    return (
        <div className="flex min-h-screen flex-col bg-animated">
            <Header />

            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors"
                    >
                        <FaArrowLeft className="h-4 w-4" />
                        Quay lại trang chủ
                    </Link>
                </div>

                {/* Page Title */}
                <div className="mb-10 text-center">
                    <h1 className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">
                        Vòng Quay May Mắn
                    </h1>
                    <p className="text-gray-500">
                        Thử vận may, nhận quà! (Hoặc hình phạt)
                    </p>
                </div>

                {/* Game */}
                <WheelGame />
            </main>

            <Footer />
        </div>
    );
}
