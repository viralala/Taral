"use client";
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function flowerGeometry(petals = 5, depth = 0.35) {
  const s = new THREE.Shape();
  const N = 120;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2;
    const r = 0.62 + 0.38 * Math.pow(Math.abs(Math.cos((petals * t) / 2)), 0.8);
    const x = Math.cos(t) * r;
    const y = Math.sin(t) * r;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  return new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelSize: 0.08,
    bevelThickness: 0.1,
    bevelSegments: 5,
    curveSegments: 4,
  });
}

const PALETTE = ["#ec8c8c", "#f4a7a7", "#bfe3e4", "#f3d77a", "#b8d4a8", "#f6c6c6"];

type Item = {
  p: [number, number, number];
  s: number;
  c: string;
  kind: "flower" | "sphere" | "pill";
  sp: number;
};
const ITEMS: Item[] = [
  { p: [-4.2, 1.8, -1], s: 1.3, c: PALETTE[0], kind: "flower", sp: 0.4 },
  { p: [4.4, 2.0, -2], s: 1.0, c: PALETTE[2], kind: "flower", sp: -0.3 },
  { p: [-2.2, -2.2, 0], s: 0.8, c: PALETTE[3], kind: "flower", sp: 0.5 },
  { p: [3.0, -1.8, 0.5], s: 1.5, c: PALETTE[1], kind: "flower", sp: -0.35 },
  { p: [0.3, 3.0, -3], s: 0.9, c: PALETTE[4], kind: "flower", sp: 0.25 },
  { p: [-5.4, -0.6, -3], s: 1.1, c: PALETTE[5], kind: "flower", sp: -0.2 },
  { p: [5.6, -0.2, -3], s: 0.8, c: PALETTE[0], kind: "flower", sp: 0.3 },
  { p: [-0.8, -3.4, -2], s: 1.0, c: PALETTE[2], kind: "flower", sp: -0.4 },
  { p: [1.6, 1.2, 1.5], s: 0.35, c: PALETTE[3], kind: "sphere", sp: 0 },
  { p: [-3.4, 0.4, 1], s: 0.28, c: PALETTE[0], kind: "sphere", sp: 0 },
  { p: [2.4, -3.0, 1], s: 0.4, c: PALETTE[4], kind: "sphere", sp: 0 },
  { p: [-1.4, 2.4, 0.5], s: 0.7, c: PALETTE[2], kind: "pill", sp: 0.5 },
  { p: [4.0, 0.4, 1.2], s: 0.6, c: PALETTE[1], kind: "pill", sp: -0.4 },
];

function Thing({ it, geo, reduce }: { it: Item; geo: THREE.BufferGeometry; reduce: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((st, dt) => {
    if (!ref.current || reduce) return;
    ref.current.rotation.z += dt * it.sp * 0.6;
    ref.current.rotation.y = Math.sin(st.clock.elapsedTime * 0.5 + it.p[0]) * 0.5 + st.pointer.x * 0.4;
    ref.current.rotation.x = Math.cos(st.clock.elapsedTime * 0.4 + it.p[1]) * 0.35 - st.pointer.y * 0.4;
  });
  return (
    <Float speed={reduce ? 0 : 1.4} floatIntensity={reduce ? 0 : 1.2} rotationIntensity={0}>
      <group position={it.p} scale={it.s}>
        <group ref={ref}>
          {it.kind === "flower" && (
            <>
              <mesh geometry={geo} position={[0, 0, -0.2]}>
                <meshToonMaterial color={it.c} />
              </mesh>
              <mesh position={[0, 0, 0.32]}>
                <sphereGeometry args={[0.2, 24, 24]} />
                <meshToonMaterial color="#f3d77a" />
              </mesh>
            </>
          )}
          {it.kind === "sphere" && (
            <mesh>
              <sphereGeometry args={[1, 32, 32]} />
              <meshToonMaterial color={it.c} />
            </mesh>
          )}
          {it.kind === "pill" && (
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <capsuleGeometry args={[0.35, 1.1, 8, 24]} />
              <meshToonMaterial color={it.c} />
            </mesh>
          )}
        </group>
      </group>
    </Float>
  );
}

function Rig({ reduce }: { reduce: boolean }) {
  useFrame((st) => {
    if (reduce) return;
    st.camera.position.x += (st.pointer.x * 1.2 - st.camera.position.x) * 0.05;
    st.camera.position.y += (st.pointer.y * 0.8 - st.camera.position.y) * 0.05;
    st.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene() {
  const geo = useMemo(() => flowerGeometry(), []);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} />
      <Rig reduce={reduce} />
      {ITEMS.map((it, i) => (
        <Thing key={i} it={it} geo={geo} reduce={reduce} />
      ))}
    </Canvas>
  );
}
