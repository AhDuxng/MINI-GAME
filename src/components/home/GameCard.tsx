import Image from 'next/image';
import Link from 'next/link';
import { BsPlayFill } from 'react-icons/bs';

interface GameCardProps {
    title: string;
    description: string;
    image: string;
    tagColor?: string;
    tagName?: string;
    href: string;
}

export default function GameCard({ title, description, image, tagColor, tagName, href }: GameCardProps) {
    return (
        <div className="group glass rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-glow-orange">
            {/* Hình ảnh */}
            <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Tag */}
                {tagName && (
                    <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white backdrop-blur-sm ${tagColor || 'bg-orange-500/80'}`}>
                        {tagName}
                    </span>
                )}
            </div>

            {/* Nội dung */}
            <div className="p-5">
                <h3 className="mb-2 text-lg font-bold text-gray-800">{title}</h3>
                <p className="mb-4 line-clamp-2 text-sm text-gray-500">{description}</p>

                <Link
                    href={href}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-50 py-2.5 text-sm font-medium text-orange-600 transition-all hover:bg-gradient-button hover:text-white hover:shadow-glow"
                >
                    <BsPlayFill className="h-5 w-5" />
                    Chơi ngay
                </Link>
            </div>
        </div>
    );
}
