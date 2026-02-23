'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from "next/link";
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Points, PointMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Rocket, Shield, ArrowRight, Sparkles, Command, Cpu, Hash, Activity } from "lucide-react";

// --- 3D ELEMENT: THE GRAVITY WELL (Hero) ---
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

// --- 3D ELEMENT: THE DATA CLOUD (Stats/Bg) ---
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

// --- MAIN COMPONENT ---
export default function PitchStudioNoir() {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });



  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: '"Poppins", sans-serif' }}>

      {/* 1. BRUTALIST LOADER */}
      <AnimatePresence>
        {loading && (
          <motion.div
            exit={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              background: '#000',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 0.5, repeatType: 'reverse' }}
              >
                <Command size={40} />
              </motion.div>
              <div style={{ marginTop: '20px', fontWeight: 700, letterSpacing: '2px' }}>
              <img src="/assets/logo.png" alt="Logo" width={100} height={100} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PERSISTENT 3D BACKGROUND */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Environment preset="studio" />
          <ambientLight intensity={0.5} />
          <group>
            <HeroElement />
            <DataCloud />
          </group>
        </Canvas>
      </div>

      {/* 3. NAVIGATION */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        padding: '30px 40px',
        backdropFilter: 'blur(10px)',
        background: 'rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'start',  }}>
          {/* <Rocket size={24} /> */}
          <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
            <img src="/assets/logo.png" alt="Logo" width={120} height={120} />
          </span>
        </div>
        <Link href="/admin/login" style={{
          fontSize: '0.75rem',
          border: '1px solid #fff',
          padding: '8px 20px',
          borderRadius: '4px',
          textDecoration: 'none',
          color: '#fff',
          fontWeight: 600,
          letterSpacing: '1px'
        }}>
          INVESTOR AUTH
        </Link>
      </nav>

      {/* 4. HERO SECTION */}
      <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 40px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ background: '#fff', color: '#000', padding: '6px 16px', fontSize: '0.7rem', fontWeight: 700, marginBottom: '30px', borderRadius: '2px' }}
        >
          DROP SEQUENCE 2026
        </motion.div>

        <motion.h1
          style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', fontWeight: 800, lineHeight: 0.9, letterSpacing: '-2px', textTransform: 'uppercase' }}
        >
          Unfold <br /> The Void
        </motion.h1>

        <motion.p style={{ maxWidth: '600px', marginTop: '40px', fontSize: '1.1rem', opacity: 0.6, lineHeight: 1.6, fontWeight: 300 }}>
          Engineering the bridge between raw ideas and institutional capital through high-fidelity pitch sequences.
        </motion.p>

        <div style={{ marginTop: '60px', display: 'flex', gap: '20px' }}>
          <Link href="/forms" className="btn-zebra-primary">START APPLICATION</Link>
          <a href="#how" className="btn-zebra-outline">HOW IT WORKS</a>
        </div>
      </section>

    

      {/* 6. HOW IT WORKS - UPDATED VISIBILITY */}
      <section id="how" style={{
        padding: '160px 60px',
        position: 'relative',
        zIndex: 10,
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7), transparent)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 800,
              marginBottom: '100px',
              letterSpacing: '-2px'
            }}
          >
            PROCESS
          </motion.h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px'
          }}>
            {[
              { t: 'SUBMIT', d: 'Input your core data into the encrypted studio terminal.' },
              { t: 'VALIDATE', d: 'Investor-tier review protocols verify growth potential.' },
              { t: 'CONNECT', d: 'Direct uplink to verified venture capital nodes.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                style={{
                  borderLeft: '1px solid rgba(255,255,255,0.4)',
                  padding: '40px',
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '0 8px 8px 0'
                }}
              >
                <div style={{
                  fontSize: '0.8rem',
                  color: '#888',
                  marginBottom: '20px',
                  fontWeight: 700,
                  fontFamily: 'monospace'
                }}>
                  0{i + 1}
                </div>
                <h3 style={{
                  fontSize: '2.2rem',
                  fontWeight: 700,
                  marginBottom: '20px',
                  color: '#fff'
                }}>
                  {item.t}
                </h3>
                <p style={{
                  opacity: 0.8,
                  lineHeight: 1.8,
                  fontWeight: 300,
                  fontSize: '1.1rem',
                  color: '#ccc'
                }}>
                  {item.d}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer style={{ borderTop: '1px solid #111', padding: '80px 60px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '0.75rem', opacity: 0.3, marginBottom: '20px', letterSpacing: '2px' }}>END OF TRANSMISSION</div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>© 2026 PITCH_STUDIO | ALL RIGHTS RESERVED</div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap');

        html { scroll-behavior: smooth; }
        
        .btn-zebra-primary {
          background: #fff;
          color: #000;
          padding: 18px 36px;
          font-weight: 700;
          text-decoration: none;
          transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
          display: inline-block;
          border-radius: 4px;
        }
        .btn-zebra-primary:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(255,255,255,0.1);
        }
        .btn-zebra-outline {
          border: 1px solid #333;
          color: #fff;
          padding: 18px 36px;
          font-weight: 700;
          text-decoration: none;
          transition: 0.3s;
          display: inline-block;
          border-radius: 4px;
        }
        .btn-zebra-outline:hover {
          background: #fff;
          color: #000;
          border-color: #fff;
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </div>
  );
}