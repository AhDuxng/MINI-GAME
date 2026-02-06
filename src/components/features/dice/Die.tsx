'use client';

import { DICE_FACES } from './DiceMeanings';

interface DieProps {
    result: number; // 1-6
    isRolling: boolean;
}

export default function Die({ result, isRolling }: DieProps) {
    // Mapping kết quả (1-6) sang góc xoay 3D
    const getRotation = (faceId: number) => {
        switch (faceId) {
            case 1: return { x: 0, y: 0 };
            case 2: return { x: 0, y: -90 };
            case 3: return { x: 0, y: 180 };
            case 4: return { x: 0, y: 90 };
            case 5: return { x: -90, y: 0 };
            case 6: return { x: 90, y: 0 };
            default: return { x: 0, y: 0 };
        }
    };

    const targetRot = getRotation(result);

    // Animation cải thiện
    const style = isRolling
        ? {
            transform: `rotateX(${1080 + Math.random() * 720}deg) rotateY(${1080 + Math.random() * 720}deg) rotateZ(${360 + Math.random() * 360}deg)`
        }
        : {
            transform: `rotateX(${targetRot.x}deg) rotateY(${targetRot.y}deg) rotateZ(0deg)`
        };

    return (
        <div className="scene w-48 h-48 mx-auto" style={{ perspective: '1000px' }}>
            <div
                className="cube relative w-full h-full"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: style.transform,
                    transition: isRolling
                        ? 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                        : 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
            >
                {/* 6 Mặt của Xí Ngầu với Glass Effect */}
                {DICE_FACES.map((face) => {
                    let transform = '';
                    switch (face.id) {
                        case 1: transform = 'translateZ(96px)'; break;
                        case 2: transform = 'rotateY(90deg) translateZ(96px)'; break;
                        case 3: transform = 'rotateY(180deg) translateZ(96px)'; break;
                        case 4: transform = 'rotateY(-90deg) translateZ(96px)'; break;
                        case 5: transform = 'rotateX(90deg) translateZ(96px)'; break;
                        case 6: transform = 'rotateX(-90deg) translateZ(96px)'; break;
                    }

                    return (
                        <div
                            key={face.id}
                            className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/90 backdrop-blur-sm border border-white/50 shadow-glass"
                            style={{
                                transform: transform,
                                backfaceVisibility: 'hidden',
                                width: '192px',
                                height: '192px',
                            }}
                        >
                            <div className="flex flex-col items-center gap-2 p-2 text-center">
                                <face.icon className={`h-16 w-16 ${face.color}`} />
                                <span className={`text-xl font-bold ${face.color}`}>{face.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
