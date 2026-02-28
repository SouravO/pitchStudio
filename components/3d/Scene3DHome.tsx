'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Points, PointMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

function HeroElement() {
    const meshRef = useRef<THREE.Mesh>(null!);
    useFrame((state) => {
        meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    });
    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={meshRef}>
                <torusKnotGeometry args={[1.5, 0.4, 256, 32]} />
                <MeshTransmissionMaterial
                    backside
                    thickness={2}
                    chromaticAberration={0.1}
                    anisotropy={1}
                    color="#ffffff"
                />
            </mesh>
        </Float>
    );
}

function DataCloud() {
    const points = useMemo(() => {
        const p = new Float32Array(2000 * 3);
        for (let i = 0; i < 2000; i++) {
            p.set([(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10], i * 3);
        }
        return p;
    }, []);

    const ref = useRef<THREE.Points>(null!);
    useFrame((state) => {
        ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    });

    return (
        <Points ref={ref} positions={points} stride={3}>
            <PointMaterial
                transparent
                color="#ffffff"
                size={0.02}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

export default function Scene3DHome() {
    return (
        <Canvas camera={{ position: [0, 0, 5] }}>
            <Environment preset="studio" />
            <ambientLight intensity={0.5} />
            <group>
                <HeroElement />
                <DataCloud />
            </group>
        </Canvas>
    );
}
