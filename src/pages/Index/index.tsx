import { useEffect, useRef, type ComponentProps } from "react";
import styled from "styled-components";
import {
  Canvas,
  useFrame,
  extend,
  type ThreeElements,
} from "@react-three/fiber";
import { Image } from "@react-three/drei";
import {
  Color,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Texture,
  Vector2,
  Vector3,
} from "three";
import { useNavigate } from "react-router";
import Bg from "./bg";

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

class BentPlaneGeometry extends PlaneGeometry {
  constructor(
    radius: number,
    width: number,
    height: number,
    widthSegments?: number,
    heightSegments?: number
  ) {
    super(width, height, widthSegments, heightSegments);
    let p = this.parameters;
    let hw = p.width * 0.5;
    let a = new Vector2(-hw, 0);
    let b = new Vector2(0, radius);
    let c = new Vector2(hw, 0);
    let ab = new Vector2().subVectors(a, b);
    let bc = new Vector2().subVectors(b, c);
    let ac = new Vector2().subVectors(a, c);
    let r =
      (ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac)));
    let center = new Vector2(0, radius - r);
    let baseV = new Vector2().subVectors(a, center);
    let baseAngle = baseV.angle() - Math.PI * 0.5;
    let arc = baseAngle * 2;
    let uv = this.attributes.uv;
    let pos = this.attributes.position;
    let mainV = new Vector2();
    for (let i = 0; i < uv.count; i++) {
      let uvRatio = uv.getX(i);
      let y = pos.getY(i);
      mainV.copy(c).rotateAround(center, arc * uvRatio);
      pos.setXYZ(i, mainV.x, y, -mainV.y);
    }
    pos.needsUpdate = true;
  }
}

const BentPlaneGeometryEl = extend(BentPlaneGeometry);

export default function Index() {
  const navigator = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigator("/demo2");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigator]);

  return (
    <Wrapper>
      <Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
        <fog attach="fog" args={["#6e6e6e", 8.5, 12]} />
        <Rig rotation={[0, 0, 0.15]}>
          <Carousel />
        </Rig>
        <Bg />
      </Canvas>
    </Wrapper>
  );
}

function Rig(props: ThreeElements["group"]) {
  const ref = useRef<Group>(null!);
  const vector3 = useRef(new Vector3(1, 1, 1));

  useFrame((state, delta) => {
    // 匀速自动旋转
    ref.current.rotation.y -= delta * 0.5;
    // 圆环绕X轴前后摆动（中心点不变）
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.2) * 0.35;
    state.events.update?.();
    vector3.current.set(-state.pointer.x * 2, state.pointer.y + 1.5, 10);
    state.camera.position.lerp(vector3.current, 1 - Math.exp(-8 * delta));
    state.camera.lookAt(0, 0, 0);
  });

  return <group ref={ref} {...props} />;
}

function Carousel({ radius = 1.4, count = 8 }) {
  const navigator = useNavigate();

  return Array.from({ length: count }, (_, i) => (
    <Card
      key={i}
      url={`/sc-datav/demo_${i + 1}.jpg`}
      position={[
        Math.sin((i / count) * Math.PI * 2) * radius,
        0,
        Math.cos((i / count) * Math.PI * 2) * radius,
      ]}
      rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
      onClick={(e) => {
        e.stopPropagation();
        navigator("/demo2");
      }}
    />
  ));
}

export interface ImageMaterial extends ShaderMaterial {
  scale?: number[];
  imageBounds?: number[];
  radius?: number;
  resolution?: number;
  color?: Color;
  map: Texture;
  zoom?: number;
  grayscale?: number;
}

function Card(props: ComponentProps<typeof Image>) {
  const ref = useRef<Mesh<BentPlaneGeometry, ImageMaterial>>(null!);
  const vector3 = useRef(new Vector3(1, 1, 1));
  const targetRadius = useRef(0.1);
  const targetZoom = useRef(1.5);

  useFrame((_, delta) => {
    ref.current.scale.lerp(vector3.current, 1 - Math.exp(-10 * delta));
    ref.current.material.radius = MathUtils.lerp(
      ref.current.material.radius!,
      targetRadius.current,
      1 - Math.exp(-8 * delta)
    );

    ref.current.material.zoom = MathUtils.lerp(
      ref.current.material.zoom!,
      targetZoom.current,
      1 - Math.exp(-8 * delta)
    );
  });

  return (
    <Image
      ref={ref}
      transparent
      toneMapped={false}
      side={DoubleSide}
      onPointerOver={(e) => {
        e.stopPropagation();
        vector3.current.setScalar(1.15);
        targetRadius.current = 0.25;
        targetZoom.current = 1;
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        vector3.current.setScalar(1);
        targetRadius.current = 0.1;
        targetZoom.current = 1.5;
        document.body.style.cursor = "auto";
      }}
      {...props}>
      <BentPlaneGeometryEl args={[0.1, 1, 1, 20, 20]} />
    </Image>
  );
}
