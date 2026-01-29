'use client';

import WheelGame from '@/components/features/wheel/WheelGame';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function WheelPage() {
    return (
        <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900">
            {/* Header cố định */}
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
                {/* Nút quay lại trang chủ */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại trang chủ
                    </Link>
                </div>

                {/* Tiêu đề trang Game */}
                <div className="mb-10 text-center">
                    <h1 className="mb-2 text-3xl font-extrabold text-gray-900 md:text-4xl">
                        Vòng Quay May Mắn
                    </h1>
                    <p className="text-gray-500">
                        Thử vận may, nhận quà liền tay! (Hoặc hình phạt 😈)
                    </p>
                </div>

                {/* Component Game chính */}
                <WheelGame />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
