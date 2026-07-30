import type { Meta, StoryObj } from "@storybook/react-vite"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { CustomDistanceMaterial } from "./CustomDistanceMaterial"
interface DistancePreviewProps {
  proche: string
  loin: string
  nearDistance: number
  farDistance: number
}
function Scene({ proche, loin, nearDistance, farDistance }: DistancePreviewProps) {
  const [material] = useState<CustomDistanceMaterial>(
    () => new CustomDistanceMaterial({ proche, loin, nearDistance, farDistance })
  )
  useEffect(() => {
    material.uniforms['uColorProche'].value.set(proche)
    material.uniforms['uColorLoin'].value.set(loin)
    material.uniforms['uNearDistance'].value = nearDistance
    material.uniforms['uFarDistance'].value = farDistance
  }, [material, proche, loin, nearDistance, farDistance])
  const positions: [number, number, number][] = [
    [0, 0, 0], [0, 0, -5], [0, 0, -10], [0, 0, -15], [0, 0, -20],
    [-5, 0, -5], [5, 0, -5], [-5, 0, -15], [5, 0, -15],
  ]
  return (
    <>
      <ambientLight intensity={0.3} />
      {positions.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} material={material}>
          <sphereGeometry args={[0.8, 32, 32]} />
        </mesh>
      ))}
      <OrbitControls />
    </>
  )
}
function DistancePreview(props: DistancePreviewProps) {
  return (
    <Canvas style={{ height: "500px", background: "#0d0d1a" }} camera={{ position: [0, 3, 8], fov: 60 }}>
      <Scene {...props} />
    </Canvas>
  )
}
function AnimatedScene({ proche, loin, nearDistance, farDistance }: DistancePreviewProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [material] = useState<CustomDistanceMaterial>(
    () => new CustomDistanceMaterial({ proche, loin, nearDistance, farDistance })
  )
  useEffect(() => {
    material.uniforms['uColorProche'].value.set(proche)
    material.uniforms['uColorLoin'].value.set(loin)
    material.uniforms['uNearDistance'].value = nearDistance
    material.uniforms['uFarDistance'].value = farDistance
  }, [material, proche, loin, nearDistance, farDistance])
  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime() * 0.3
  })
  const positions: [number, number, number][] = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2
    return [Math.cos(angle) * 6, 0, Math.sin(angle) * 6]
  })
  return (
    <>
      <group ref={groupRef}>
        {positions.map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} material={material}>
            <sphereGeometry args={[0.6, 32, 32]} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0]} material={material}>
          <sphereGeometry args={[1.2, 32, 32]} />
        </mesh>
      </group>
      <OrbitControls />
    </>
  )
}
interface LongBoxPreviewProps extends DistancePreviewProps {
  boxLength: number
}

function LongBoxScene({ proche, loin, nearDistance, farDistance, boxLength }: LongBoxPreviewProps) {
  const [material] = useState<CustomDistanceMaterial>(
    () => new CustomDistanceMaterial({ proche, loin, nearDistance, farDistance })
  )
  useEffect(() => {
    material.uniforms['uColorProche'].value.set(proche)
    material.uniforms['uColorLoin'].value.set(loin)
    material.uniforms['uNearDistance'].value = nearDistance
    material.uniforms['uFarDistance'].value = farDistance
  }, [material, proche, loin, nearDistance, farDistance])

  return (
    <>
      <ambientLight intensity={0.2} />
      <mesh position={[0, 0, -boxLength / 2]} material={material}>
        <boxGeometry args={[1, 1, boxLength, 1, 1, Math.ceil(boxLength * 4)]} />
      </mesh>
      <OrbitControls />
    </>
  )
}

function LongBoxPreview(props: LongBoxPreviewProps) {
  return (
    <Canvas
      style={{ height: "500px", background: "#0d0d1a" }}
      camera={{ position: [2, 2, 2], fov: 60 }}
    >
      <LongBoxScene {...props} />
    </Canvas>
  )
}

function AnimatedPreview(props: DistancePreviewProps) {
  return (
    <Canvas style={{ height: "500px", background: "#0d0d1a" }} camera={{ position: [0, 5, 12], fov: 60 }}>
      <AnimatedScene {...props} />
    </Canvas>
  )
}
const meta: Meta<typeof DistancePreview> = {
  title: "Three/CustomDistanceMaterial",
  component: DistancePreview,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    proche:       { control: "color" },
    loin:         { control: "color" },
    nearDistance: { control: { type: "range", min: 0,  max: 30, step: 0.5 } },
    farDistance:  { control: { type: "range", min: 1,  max: 50, step: 0.5 } },
  },
}
export default meta
type Story = StoryObj<typeof DistancePreview>
export const Default: Story = {
  args: { proche: "#ffffff", loin: "#ff2200", nearDistance: 0, farDistance: 20 },
}
export const Ocean: Story = {
  args: { proche: "#00ffee", loin: "#001a4d", nearDistance: 2, farDistance: 30 },
}
export const Fire: Story = {
  args: { proche: "#ffee00", loin: "#660000", nearDistance: 0, farDistance: 15 },
}
export const Animated: StoryObj<typeof AnimatedPreview> = {
  ...meta,
  render: (args) => <AnimatedPreview {...args} />,
  args: { proche: "#44ffaa", loin: "#220066", nearDistance: 0, farDistance: 12 },
}

export const LongBox: StoryObj<typeof LongBoxPreview> = {
  ...meta,
  render: (args) => <LongBoxPreview {...(args as LongBoxPreviewProps)} />,
  argTypes: {
    ...meta.argTypes,
    boxLength: { control: { type: "range", min: 5, max: 100, step: 1 } },
  },
  args: { proche: "#00ffff", loin: "#220033", nearDistance: 0, farDistance: 40, boxLength: 40 },
}

