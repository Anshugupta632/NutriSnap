import React, { useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment } from '@react-three/drei';
import { Dumbbell, ShieldAlert, Zap, Flame, Heart } from 'lucide-react';
import * as THREE from 'three';

// ---- Colour palette per state ----
const PALETTES = {
  weak: { skin: '#8B9A8C', accent: '#EF4444', suit: '#3A2E2E', glow: '#EF444444' },
  normal: { skin: '#4FB8C4', accent: '#06B6D4', suit: '#1E2A2E', glow: '#06B6D444' },
  pumped: { skin: '#34D399', accent: '#10B981', suit: '#123028', glow: '#10B98144' },
};

function LowPolyHuman({ proteinRatio }) {
  const group = useRef();
  const isWeak = proteinRatio < 0.5;
  const isPumped = proteinRatio >= 1.0;
  const key = isWeak ? 'weak' : isPumped ? 'pumped' : 'normal';
  const c = PALETTES[key];

  const bulk = isWeak ? 0.72 : isPumped ? 1.28 : 1.0;
  const torsoBulk = isWeak ? 0.65 : isPumped ? 1.4 : 1.0;

  const skinMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: c.skin, flatShading: true, roughness: 0.7, metalness: 0.08 }),
    [c.skin]
  );
  const suitMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: c.suit, flatShading: true, roughness: 0.8, metalness: 0.12 }),
    [c.suit]
  );
  const accentMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: c.accent, flatShading: true, roughness: 0.3, metalness: 0.5, emissive: c.accent, emissiveIntensity: 0.4 }),
    [c.accent]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.position.y = Math.sin(t * (isWeak ? 0.8 : 1.4)) * 0.015 - 1.1;
      group.current.rotation.y = Math.sin(t * 0.25) * 0.1;
      const torso = group.current.getObjectByName('torso');
      if (torso) {
        const breathe = 1 + Math.sin(t * (isWeak ? 1.0 : 1.6)) * 0.01;
        torso.scale.set(torsoBulk * breathe, 1, torsoBulk * breathe);
      }
    }
  });

  return (
    <group ref={group} castShadow receiveShadow>
      <mesh position={[0, 1.65, 0]} material={skinMat} castShadow>
        <icosahedronGeometry args={[0.28, 0]} />
      </mesh>

      <mesh position={[0, 1.4, 0]} material={skinMat} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.12, 6]} />
      </mesh>

      <mesh name="torso" position={[0, 1.05, 0]} material={suitMat} castShadow>
        <coneGeometry args={[0.38, 0.75, 8]} />
      </mesh>

      <mesh position={[0, 1.25, 0.25]} material={accentMat} castShadow>
        <boxGeometry args={[0.32 * torsoBulk, 0.25, 0.08]} />
      </mesh>

      <mesh position={[-0.38 * bulk, 1.4, 0]} material={skinMat} castShadow>
        <sphereGeometry args={[0.15 * bulk, 8, 6]} />
      </mesh>
      <mesh position={[0.38 * bulk, 1.4, 0]} material={skinMat} castShadow>
        <sphereGeometry args={[0.15 * bulk, 8, 6]} />
      </mesh>

      <mesh position={[-0.42 * bulk, 1.15, 0]} rotation={[0, 0, 0.2]} material={skinMat} castShadow>
        <capsuleGeometry args={[0.095 * bulk, 0.38, 5, 8]} />
      </mesh>
      <mesh position={[0.42 * bulk, 1.15, 0]} rotation={[0, 0, -0.2]} material={skinMat} castShadow>
        <capsuleGeometry args={[0.095 * bulk, 0.38, 5, 8]} />
      </mesh>

      <mesh position={[-0.48 * bulk, 0.85, 0.05]} rotation={[0.15, 0, 0.1]} material={skinMat} castShadow>
        <capsuleGeometry args={[0.075 * bulk, 0.3, 4, 6]} />
      </mesh>
      <mesh position={[0.48 * bulk, 0.85, 0.05]} rotation={[0.15, 0, -0.1]} material={skinMat} castShadow>
        <capsuleGeometry args={[0.075 * bulk, 0.3, 4, 6]} />
      </mesh>

      <mesh position={[0, 0.65, 0]} material={suitMat} castShadow>
        <boxGeometry args={[0.38 * torsoBulk, 0.2, 0.25]} />
      </mesh>

      <mesh position={[-0.18, 0.38, 0]} material={suitMat} castShadow>
        <capsuleGeometry args={[0.12 * bulk, 0.4, 5, 8]} />
      </mesh>
      <mesh position={[0.18, 0.38, 0]} material={suitMat} castShadow>
        <capsuleGeometry args={[0.12 * bulk, 0.4, 5, 8]} />
      </mesh>

      <mesh position={[-0.2, -0.15, 0.05]} material={skinMat} castShadow>
        <capsuleGeometry args={[0.09 * bulk, 0.4, 5, 8]} />
      </mesh>
      <mesh position={[0.2, -0.15, 0.05]} material={skinMat} castShadow>
        <capsuleGeometry args={[0.09 * bulk, 0.4, 5, 8]} />
      </mesh>

      <mesh position={[-0.18, -0.55, 0.1]} material={accentMat} castShadow>
        <boxGeometry args={[0.15, 0.12, 0.3]} />
      </mesh>
      <mesh position={[0.18, -0.55, 0.1]} material={accentMat} castShadow>
        <boxGeometry args={[0.15, 0.12, 0.3]} />
      </mesh>
    </group>
  );
}

export default function Avatar3D({ user, level = 1, macros = { protein: 48 } }) {
  const actualProtein = macros?.protein ?? 48;
  const targetProtein = user?.daily_protein_target || 120;

  const [simulatedProtein, setSimulatedProtein] = useState(actualProtein);
  const [isSimulating, setIsSimulating] = useState(false);

  const activeProtein = isSimulating ? simulatedProtein : actualProtein;
  const proteinRatio = Math.min(1.5, activeProtein / (targetProtein || 1));
  const isWeak = proteinRatio < 0.5;
  const isSuperPumped = proteinRatio >= 1.0;

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden bg-gradient-to-b from-[var(--color-dabba)] to-[var(--color-steel)] border border-white/[0.05]">
      <div
        className="absolute inset-0 opacity-30 pointer-events-none transition-all duration-700"
        style={{
          background: isWeak
            ? 'radial-gradient(circle at 55% 40%, #EF4444 0%, transparent 70%)'
            : isSuperPumped
            ? 'radial-gradient(circle at 55% 40%, #10B981 0%, transparent 75%)'
            : 'radial-gradient(circle at 55% 40%, #06B6D4 0%, transparent 70%)',
        }}
      />

      {/* ---- Canvas: ONLY three.js elements go inside here ---- */}
      <Canvas
        camera={{ position: [0, 1.2, 3.5], fov: 35 }}
        shadows
        className="w-full h-full"
      >
        <ambientLight intensity={0.6} color="#f0f4f8" />
        <directionalLight position={[4, 7, 4]} intensity={1.8} castShadow />
        <directionalLight position={[-4, 3, -3]} intensity={0.7} color="#93c5fd" />
        <pointLight position={[0, 2, 1]} intensity={0.5} color={isWeak ? '#EF4444' : isSuperPumped ? '#10B981' : '#06B6D4'} />

        <Float speed={isWeak ? 0.5 : 1.2} rotationIntensity={0.08} floatIntensity={0.1}>
          <LowPolyHuman proteinRatio={proteinRatio} />
        </Float>

        <ContactShadows position={[0, -1.6, 0]} opacity={0.4} scale={5} blur={3} far={4} />
      </Canvas>
      {/* ---- Canvas ends here — everything below is normal HTML/JSX ---- */}

      {/* Top HUD */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[rgba(26,30,40,0.8)] backdrop-blur-xl border border-white/[0.06] text-xs font-mono font-bold text-cream shadow-lg">
          <span>LVL {level}</span>
          <span className="text-white/40">|</span>
          <span className="capitalize text-emerald-400">{user?.body_type || 'Mesomorph'} Human</span>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl backdrop-blur-xl border ${
            isWeak
              ? 'border-rose-500/50 text-rose-300'
              : isSuperPumped
              ? 'border-emerald-500/50 text-emerald-300 animate-pulse'
              : 'border-cyan-500/50 text-cyan-300'
          } border-white/[0.08]`}
        >
          {isWeak ? (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>WEAK & DEPLETED</span>
            </>
          ) : isSuperPumped ? (
            <>
              <Flame className="w-3.5 h-3.5 text-emerald-400" />
              <span>BEAST MODE / PUMPED</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>STRONG & MAINTAINED</span>
            </>
          )}
        </div>
      </div>

      {/* Bottom stats */}
      <div className="absolute bottom-3 inset-x-3 flex items-center justify-between p-3 rounded-2xl bg-[rgba(26,30,40,0.8)] backdrop-blur-md border border-white/[0.06] text-xs pointer-events-none">
        <div>
          <span className="text-[10px] text-cream/40 uppercase font-mono block">Protein Intake</span>
          <span className="font-bold text-cream font-mono">
            {Math.round(activeProtein)}g / {targetProtein}g ({Math.round(proteinRatio * 100)}%)
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-cream/40 uppercase font-mono block">Muscle State</span>
          <span className={`font-bold font-mono ${isWeak ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isWeak ? 'Catabolic (-15%)' : isSuperPumped ? 'Peak Pump (+25%)' : 'Anabolic (+10%)'}
          </span>
        </div>
      </div>

      {/* Progress overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-24 h-2 bg-black/60 rounded-full border border-white/10 flex items-center justify-center">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${proteinRatio * 100}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="h-full rounded-full transition-all duration-1.5 bg-gradient-to-r from-[var(--color-haldi)] to-[var(--color-curry)]"
        />
      </div>
    </div>
  );
}