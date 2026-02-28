'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    MeshTransmissionMaterial, PerspectiveCamera, Environment, Float,
    MeshDistortMaterial, ContactShadows
} from '@react-three/drei';

function VoidMonolith({ step, mouse }: { step: number; mouse: React.RefObject<number[]> }) {
    const meshRef = useRef<any>(null);
    const coreRef = useRef<any>(null);
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.y = t * (0.05 + (step * 0.01));
            meshRef.current.position.x = (mouse.current as number[])[0] * 0.5;
            meshRef.current.position.y = (mouse.current as number[])[1] * 0.5;
        }
        if (coreRef.current) {
            coreRef.current.distort = 0.2 + (step * 0.03);
            coreRef.current.speed = 1 + (step * 0.1);
        }
    });
    return (
        <group>
            <mesh ref={coreRef}><sphereGeometry args={[0.8, 64, 64]} /><MeshDistortMaterial color="#000" speed={2} distort={0.4} metalness={1} roughness={0.01} /></mesh>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh ref={meshRef}><octahedronGeometry args={[1.6, 0]} /><MeshTransmissionMaterial backside samples={8} thickness={2} chromaticAberration={0.02} color="#fff" transmission={1} /></mesh>
            </Float>
            <ContactShadows position={[0, -3, 0]} opacity={0.6} scale={10} blur={2} />
        </group>
    );
}

export default function Scene3DForm({ step, mouse }: { step: number; mouse: React.RefObject<number[]> }) {
    return (
        <Canvas dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 0, 6]} />
            <Environment preset="night" />
            <VoidMonolith step={step} mouse={mouse} />
        </Canvas>
    );
}
