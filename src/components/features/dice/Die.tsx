'use client';

import { DICE_FACES } from './DiceMeanings';

interface DieProps {
    result: number; // 1-6
    isRolling: boolean;
}

export default function Die({ result, isRolling }: DieProps) {
    // Mapping kết quả (1-6) sang góc xoay 3D (x, y) để mặt đó hướng ra trước
    // Căn chỉnh để mặt số 1 là rotation(0,0)
    const getRotation = (faceId: number) => {
        switch (faceId) {
            case 1: return { x: 0, y: 0 };       // Front
            case 2: return { x: 0, y: -90 };     // Right
            case 3: return { x: 0, y: 180 };     // Back
            case 4: return { x: 0, y: 90 };      // Left
            case 5: return { x: -90, y: 0 };     // Top
            case 6: return { x: 90, y: 0 };      // Bottom
            default: return { x: 0, y: 0 };
        }
    };

    const targetRot = getRotation(result);

    const style = isRolling
        ? { transform: `rotateX(${720 + Math.random() * 360}deg) rotateY(${720 + Math.random() * 360}deg)` }
        : { transform: `rotateX(${targetRot.x}deg) rotateY(${targetRot.y}deg)` };

    return (
        <div className="scene w-48 h-48 mx-auto" style={{ perspective: '1000px' }}>
            <div
                className="cube relative w-full h-full"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: style.transform,
                    transition: isRolling ? 'transform 0.5s ease-in' : 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
                }}
            >
                {/* 6 Mặt của Xí Ngầu */}
                {DICE_FACES.map((face) => {
                    // Logic vị trí transform cho từng mặt
                    let transform = '';
                    switch (face.id) {
                        case 1: transform = 'translateZ(96px)'; break;
                        case 2: transform = 'rotateY(90deg) translateZ(96px)'; break; // Right
                        case 3: transform = 'rotateY(180deg) translateZ(96px)'; break; // Back
                        case 4: transform = 'rotateY(-90deg) translateZ(96px)'; break; // Left
                        case 5: transform = 'rotateX(90deg) translateZ(96px)'; break; // Top
                        case 6: transform = 'rotateX(-90deg) translateZ(96px)'; break; // Bottom
                    }

                    return (
                        <div
                            key={face.id}
                            className="absolute inset-0 flex items-center justify-center bg-white shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]"
                            style={{
                                transform: transform,
                                backfaceVisibility: 'hidden', // Che mặt sau
                                width: '192px', // w-48
                                height: '192px', // h-48
                            }}
                        >
                            <div className="flex flex-col items-center gap-2 p-2 text-center">
                                <face.icon className={`h-16 w-16 ${face.color}`} />
                                <span className={`text-sm font-black uppercase ${face.color}`}>{face.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
