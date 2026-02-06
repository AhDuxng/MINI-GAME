'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DICE_FACES } from './DiceMeanings';

interface Die3DProps {
    result: number;
    isRolling: boolean;
}

// Component con của xí ngầu (phải nằm trong Canvas)
function DiceMesh({ result, isRolling }: Die3DProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const velocityRef = useRef({ x: 0, y: 0, z: 0 });
    const targetRotationRef = useRef({ x: 0, y: 0, z: 0 });

    // Xác định rotation target dựa vào result
    useMemo(() => {
        const rotations = [
            { x: 0, y: 0, z: 0 },           // 1: Front
            { x: 0, y: Math.PI / 2, z: 0 }, // 2: Right
            { x: 0, y: Math.PI, z: 0 },     // 3: Back
            { x: 0, y: -Math.PI / 2, z: 0 },// 4: Left
            { x: -Math.PI / 2, y: 0, z: 0 },// 5: Top
            { x: Math.PI / 2, y: 0, z: 0 }, // 6: Bottom
        ];
        targetRotationRef.current = rotations[result - 1];
    }, [result]);

    // Animation loop
    useFrame((state, delta) => {
        if (!meshRef.current) return;

        if (isRolling) {
            // Tăng tốc xoay ngẫu nhiên (physics giả lập)
            velocityRef.current.x += (Math.random() - 0.5) * 0.5;
            velocityRef.current.y += (Math.random() - 0.5) * 0.5;
            velocityRef.current.z += (Math.random() - 0.5) * 0.5;

            // Giới hạn vận tốc
            const maxVel = 0.5;
            velocityRef.current.x = Math.max(-maxVel, Math.min(maxVel, velocityRef.current.x));
            velocityRef.current.y = Math.max(-maxVel, Math.min(maxVel, velocityRef.current.y));
            velocityRef.current.z = Math.max(-maxVel, Math.min(maxVel, velocityRef.current.z));

            // Apply rotation
            meshRef.current.rotation.x += velocityRef.current.x;
            meshRef.current.rotation.y += velocityRef.current.y;
            meshRef.current.rotation.z += velocityRef.current.z;

            // Thêm bounce nhẹ
            const bounceY = Math.sin(state.clock.elapsedTime * 10) * 0.3;
            meshRef.current.position.y = bounceY;
        } else {
            // Smooth transition đến target rotation
            const speed = 0.1;
            meshRef.current.rotation.x += (targetRotationRef.current.x - meshRef.current.rotation.x) * speed;
            meshRef.current.rotation.y += (targetRotationRef.current.y - meshRef.current.rotation.y) * speed;
            meshRef.current.rotation.z += (targetRotationRef.current.z - meshRef.current.rotation.z) * speed;

            // Reset position về 0
            meshRef.current.position.y += (0 - meshRef.current.position.y) * speed;

            // Reset velocity
            velocityRef.current = { x: 0, y: 0, z: 0 };
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
        </mesh>
    );
}

// Component wrapper
export default function Die3D({ result, isRolling }: Die3DProps) {
    return (
        <div className="h-48 w-48 mx-auto">
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                {/* Lighting */}
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
                <pointLight position={[-5, -5, -5]} intensity={0.3} />

                {/* Xí ngầu */}
                <DiceMesh result={result} isRolling={isRolling} />
            </Canvas>
        </div>
    );
}

