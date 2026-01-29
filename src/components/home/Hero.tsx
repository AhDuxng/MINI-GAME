import Image from 'next/image';

export default function Hero() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="flex flex-col justify-center px-6 py-8 sm:px-12 md:py-16 lg:px-16">
                        <span className="mb-3 inline-flex w-fit items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                            🔥 Đang Hot Nhất
                        </span>
                        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                            Thật hay Thách - <br className="hidden lg:block" />
                            Khuấy động cuộc vui!
                        </h1>
                        <p className="mb-6 text-sm text-gray-500 sm:text-base lg:text-lg">
                            Trò chơi nhóm thú vị nhất cho mọi bữa tiệc. Khám phá bí mật của bạn bè hoặc thực hiện những thử thách khó đỡ.
                        </p>
                        <div>
                            <button className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-transform hover:scale-105 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 active:scale-95 sm:px-8 sm:py-3 sm:text-base">
                                ▶ Chơi ngay
                            </button>
                        </div>
                    </div>

                    <div className="relative h-64 w-full bg-gray-100 md:h-full">
                        {/* Placeholder for Hero Image */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
                            <Image
                                src="/assets/images/unnamed.webp"
                                alt="Party Friends"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
