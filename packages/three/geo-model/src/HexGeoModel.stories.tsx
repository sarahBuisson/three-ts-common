import type { Meta, StoryObj } from '@storybook/react-vite';
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { Kase2D, HexagonalTableau } from '@electron-three-boiler/model-tableau'
import { hexagonalTableauToBufferGeometry, computeKaseCoordonateHexa } from './hexGeoModel'
import { useMemo } from 'react'

interface HexGeoPreviewProps {
  width: number
  height: number
  color: string
}

function HexGeoPreview({ width, height, color }: HexGeoPreviewProps) {
  const geometry = useMemo(() => {
    const tableau = HexagonalTableau.initialize(
      width,
      height,
      (x, y) => new Kase2D(x, y)
    ) as HexagonalTableau<Kase2D>
    return hexagonalTableauToBufferGeometry(tableau)
  }, [width, height])

  const centerX = (width - 1) / 2
  const centerY = (height - 1) / 2
  const distance = Math.max(width, height) * 1.5

  return (
    <Canvas
      style={{ height: '500px', background: '#1a1a2e' }}
      camera={{ position: [centerX, centerY, distance], fov: 50 }}
    >
      <ambientLight intensity={0.5} />
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={color} />
      </lineSegments>
      {/* Points aux coordonnées de chaque case */}
      <points geometry={geometry}>
        <pointsMaterial color="white" size={0.15} />
      </points>
      <OrbitControls target={[centerX, centerY, 0]} />
      <Grid
        position={[centerX, centerY, -0.01]}
        args={[width + 2, height + 2]}
        cellSize={1}
        cellColor="#333"
        sectionColor="#555"
        infiniteGrid={false}
        fadeDistance={50}
      />
    </Canvas>
  )
}

const meta: Meta<typeof HexGeoPreview> = {
  title: 'Three/HexGeoModel',
  component: HexGeoPreview,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    width: { control: { type: 'range', min: 2, max: 20, step: 1 } },
    height: { control: { type: 'range', min: 2, max: 20, step: 1 } },
    color: { control: 'color' },
  },
}

export default meta
type Story = StoryObj<typeof HexGeoPreview>

export const Default: Story = {
  args: {
    width: 8,
    height: 6,
    color: '#44aaff',
  },
}

export const Small: Story = {
  args: {
    width: 4,
    height: 4,
    color: '#ff6644',
  },
}

export const Large: Story = {
  args: {
    width: 15,
    height: 10,
    color: '#44ff88',
  },
}

interface HexGeoHexaPreviewProps {
  width: number
  height: number
  color: string
  sideSize: number
  orientation: 'flat-top' | 'pointy-top'
}

function HexGeoHexaPreview({ width, height, color, sideSize, orientation }: HexGeoHexaPreviewProps) {
  const geometry = useMemo(() => {
    const tableau = HexagonalTableau.initialize(
      width,
      height,
      (x, y) => new Kase2D(x, y)
    ) as HexagonalTableau<Kase2D>
    return hexagonalTableauToBufferGeometry(
      tableau,
      computeKaseCoordonateHexa(sideSize, orientation),
      () => Math.random(),
    )
  }, [width, height, sideSize, orientation])

  const centerX = (width - 1) * sideSize * (orientation === 'flat-top' ? 1.5 : Math.sqrt(3)) / 2
  const centerY = (height - 1) * sideSize * (orientation === 'flat-top' ? Math.sqrt(3) : 1.5) / 2
  const distance = Math.max(width, height) * sideSize * 2.5

  return (
    <Canvas
      style={{ height: '500px', background: '#1a1a2e' }}
      camera={{ position: [centerX, centerY, distance], fov: 50 }}
    >
      <ambientLight intensity={0.5} />
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={color} />
      </lineSegments>
      <points geometry={geometry}>
        <pointsMaterial color="white" size={0.08 * sideSize} />
      </points>
      <OrbitControls target={[centerX, centerY, 0]} />
    </Canvas>
  )
}

const metaHexa: Meta<typeof HexGeoHexaPreview> = {
  title: 'Three/HexGeoModel/Hexa Coordinates',
  component: HexGeoHexaPreview,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    width:       { control: { type: 'range', min: 2, max: 20, step: 1 } },
    height:      { control: { type: 'range', min: 2, max: 20, step: 1 } },
    sideSize:    { control: { type: 'range', min: 0.5, max: 5, step: 0.1 } },
    color:       { control: 'color' },
    orientation: { control: 'radio', options: ['flat-top', 'pointy-top'] },
  },
}

export const HexaFlatTop: StoryObj<typeof HexGeoHexaPreview> = {
  ...metaHexa,
  args: {
    width: 8,
    height: 6,
    color: '#44aaff',
    sideSize: 1,
    orientation: 'flat-top',
  },
  render: (args) => <HexGeoHexaPreview {...args} />,
}

export const HexaPointyTop: StoryObj<typeof HexGeoHexaPreview> = {
  ...metaHexa,
  args: {
    width: 8,
    height: 6,
    color: '#ff9944',
    sideSize: 1,
    orientation: 'pointy-top',
  },
  render: (args) => <HexGeoHexaPreview {...args} />,
}
