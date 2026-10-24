"use client";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Line,
  OrbitControls,
  OrthographicCamera,
  RoundedBox,
} from "@react-three/drei";
import { CanvasTexture, SRGBColorSpace } from "three";
import { Component, useEffect, useMemo, type ReactNode } from "react";
import Image from "next/image";
function SceneFallback() {
  return (
    <div className="scene-fallback">
      <Image
        src="/assets/evidence-landscape.png"
        alt="Document landscape. Select a source with the controls below."
        fill
        sizes="(max-width:768px) 100vw, 70vw"
        style={{ objectFit: "cover" }}
      />
      <p role="status">
        3D is unavailable. The document controls below still work.
      </p>
    </div>
  );
}
function FitCamera() {
  const width = useThree((state) => state.size.width);
  return (
    <OrthographicCamera
      makeDefault
      position={[7, 9, 10]}
      zoom={Math.min(77, width / 10)}
      near={0.1}
      far={1000}
    />
  );
}
const items = [
  {
    id: "bill",
    title: "Hospital bill",
    detail: "Discharge: 12 Oct 2026",
    x: -2,
    z: -1.3,
  },
  {
    id: "discharge",
    title: "Discharge summary",
    detail: "Discharge: 13 Oct 2026",
    x: 1.6,
    z: -1.3,
  },
  {
    id: "receipt",
    title: "Insurer message",
    detail: "Document received",
    x: -2,
    z: 1.6,
  },
  {
    id: "policy",
    title: "Policy clause",
    detail: "Renewal continuity",
    x: 1.6,
    z: 1.6,
  },
];
class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
function DocumentNode({
  item,
  active,
  onSelect,
}: {
  item: (typeof items)[number];
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = active ? "#fff0e6" : "#fffdf8";
    ctx.fillRect(0, 0, 640, 480);
    ctx.fillStyle = active ? "#b94716" : "#52604b";
    ctx.fillRect(44, 56, 44, 5);
    ctx.fillStyle = "#242820";
    ctx.font = "600 49px sans-serif";
    ctx.fillText(item.title, 44, 130);
    ctx.fillStyle = "#59604f";
    ctx.font = "31px sans-serif";
    ctx.fillText(item.detail, 44, 192);
    ctx.fillStyle = "#6b715f";
    ctx.font = "18px monospace";
    ctx.fillText("ILLUSTRATIVE SOURCE / P. 1", 44, 390);
    const result = new CanvasTexture(canvas);
    result.colorSpace = SRGBColorSpace;
    result.anisotropy = 4;
    return result;
  }, [active, item]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <group
      position={[item.x, active ? 0.35 : 0, item.z]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item.id);
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <RoundedBox
          key={i}
          args={[2.4, 0.055, 1.8]}
          position={[0, i * 0.06, 0]}
          radius={0.008}
          smoothness={2}
        >
          <meshStandardMaterial
            color={active ? "#ffe6d5" : "#fffdf8"}
            roughness={0.8}
          />
        </RoundedBox>
      ))}
      <mesh position={[0, 0.23, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.36, 1.76]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}
export default function EvidenceScene({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <SceneBoundary fallback={<SceneFallback />}>
      <Canvas
        orthographic
        camera={{ position: [7, 9, 10], zoom: 77 }}
        dpr={[1, 1.5]}
        frameloop="demand"
        fallback={<SceneFallback />}
        aria-hidden="true"
      >
        <FitCamera />
        <color attach="background" args={["#f5f4ef"]} />
        <ambientLight intensity={1.8} />
        <directionalLight position={[4, 8, 3]} intensity={3} />
        <group position={[0, -0.2, 0]}>
          {items.map((item) => (
            <DocumentNode
              key={item.id}
              item={item}
              active={selected === item.id}
              onSelect={onSelect}
            />
          ))}
          <Line
            points={[
              [-2, 0.28, -1.3],
              [-2, 0.28, 0],
              [0, 0.28, 0],
              [1.6, 0.28, 0],
              [1.6, 0.28, -1.3],
            ]}
            color="#b94716"
            lineWidth={1.4}
          />
        </group>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={0.35}
          maxPolarAngle={1.1}
          minAzimuthAngle={0.2}
          maxAzimuthAngle={1}
          target={[0, 0, 0]}
        />
      </Canvas>
    </SceneBoundary>
  );
}
