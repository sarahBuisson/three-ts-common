import * as THREE from 'three'

const vertexShader = /* glsl */ `
  varying float vDistance;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vDistance = length(worldPosition.xyz - cameraPosition);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColorProche;
  uniform vec3 uColorLoin;
  uniform float uNearDistance;
  uniform float uFarDistance;

  varying float vDistance;

  void main() {
    float t = clamp(
      (vDistance - uNearDistance) / (uFarDistance - uNearDistance),
      0.0,
      1.0
    );
    vec3 color = mix(uColorProche, uColorLoin, t);
    gl_FragColor = vec4(color, 1.0);
  }
`

export interface CustomDistanceMaterialParameters {
  /** Couleur quand proche (distance <= nearDistance) */
  proche?: THREE.ColorRepresentation
  /** Couleur quand loin (distance >= farDistance) */
  loin?: THREE.ColorRepresentation
  /** Distance à partir de laquelle on commence à interpoler (défaut: 0) */
  nearDistance?: number
  /** Distance à partir de laquelle on est à fond "loin" (défaut: 10) */
  farDistance?: number
}

export class CustomDistanceMaterial extends THREE.ShaderMaterial {
  constructor(params: CustomDistanceMaterialParameters = {}) {
    const {
      proche = 0xffffff,
      loin = 0x000000,
      nearDistance = 0,
      farDistance = 10,
    } = params

    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColorProche:  { value: new THREE.Color(proche) },
        uColorLoin:    { value: new THREE.Color(loin) },
        uNearDistance: { value: nearDistance },
        uFarDistance:  { value: farDistance },
      },
    })
  }

  get proche(): THREE.Color {
    return this.uniforms['uColorProche'].value as THREE.Color
  }
  set proche(color: THREE.ColorRepresentation) {
    (this.uniforms['uColorProche'].value as THREE.Color).set(color)
  }

  get loin(): THREE.Color {
    return this.uniforms['uColorLoin'].value as THREE.Color
  }
  set loin(color: THREE.ColorRepresentation) {
    (this.uniforms['uColorLoin'].value as THREE.Color).set(color)
  }

  get nearDistance(): number {
    return this.uniforms['uNearDistance'].value as number
  }
  set nearDistance(v: number) {
    this.uniforms['uNearDistance'].value = v
  }

  get farDistance(): number {
    return this.uniforms['uFarDistance'].value as number
  }
  set farDistance(v: number) {
    this.uniforms['uFarDistance'].value = v
  }
}

