import Image from 'next/image';
import { BsFire, BsPlayFill } from 'react-icons/bs';

export default function Hero() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="glass-lg overflow-hidden rounded-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Nội dung chính */}
                    <div className="flex flex-col justify-center px-6 py-8 sm:px-12 md:py-16 lg:px-16">
                        <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-button px-4 py-1.5 text-xs font-bold text-white shadow-glow">
                            <BsFire className="h-3 w-3" /> Đang Hot
                        </span>
                        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl lg:text-5xl">
                            Thật hay Thách - <br className="hidden lg:block" />
                            <span className="text-orange-600">
                                Khuấy động cuộc vui!
                            </span>
                        </h1>
                        <p className="mb-8 text-sm text-gray-600 sm:text-base lg:text-lg">
                            Trò chơi nhóm thú vị nhất cho mọi bữa tiệc. Khám phá bí mật của bạn bè hoặc thực hiện những thử thách khó đỡ.
                        </p>
                        <div>
                            <button className="btn-glass inline-flex items-center gap-2 rounded-xl">
                                <BsPlayFill className="h-5 w-5" /> Chơi ngay
                            </button>
                        </div>
                    </div>

                    {/* Hình ảnh */}
                    <div className="relative h-64 w-full md:h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-200/30 to-orange-300/30" />
                        <Image
                            src="/assets/images/unnamed.webp"
                            alt="Party Friends"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
