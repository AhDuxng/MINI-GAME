import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';

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
        <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {tagName && (
                    <span
                        className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white ${tagColor || 'bg-blue-500'
                            }`}
                    >
                        {tagName}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
                <p className="mb-6 line-clamp-2 text-sm text-gray-500">{description}</p>

                <Link
                    href={href}
                    className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-gray-100 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200"
                >
                    <Play className="h-4 w-4 fill-current" />
                    Chơi ngay
                </Link>
            </div>
        </div>
    );
}
