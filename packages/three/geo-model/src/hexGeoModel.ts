import * as THREE from 'three'
import { type Kase2D, HexagonalTableau, hexToOrtho } from '@electron-three-boiler/model-tableau'

const computeKaseCoordonateSquare = (kase: Kase2D, height: number): [number, number, number] => {
  return [kase.x, height, kase.y]
}

/**
 * Convertit les coordonnées axiales d'une case en coordonnées orthogonales
 * en utilisant la géométrie réelle des hexagones (côté R).
 * @param R  Longueur d'un côté de l'hexagone (défaut: 1)
 * @param orientation  'flat-top' | 'pointy-top' (défaut: 'flat-top')
 */
export function computeKaseCoordonateHexa(
  R = 1,
  orientation: 'flat-top' | 'pointy-top' = 'flat-top',
) {
  return (kase: Kase2D, height: number): [number, number, number] => {
    const { x, y } = hexToOrtho(kase.x, kase.y, R, orientation)
    return [x, height, y]
  }
}

/**
 * Génère un BufferGeometry (LineSegments) depuis un HexagonalTableau.
 * Chaque case devient un vertex à (x, y, 0),
 * chaque paire de cases voisines forme une arête.
 * @param tableau HexagonalTableau
 * @param computeKaseCoordonate : compute les coordonnées x z de la case
 * @param computeKaseHeight : compute la hauteur de la case
 * @returns BufferGeometry
 */
export function hexagonalTableauToBufferGeometry<T extends Kase2D>(
    tableau: HexagonalTableau<T>,
    computeKaseCoordonate: (kase: T, height: number) => [number, number, number] = computeKaseCoordonateSquare,
    computeKaseHeight: (kase: T) => number = ()=>Math.random()
): THREE.BufferGeometry {
    const kases = tableau.allKases()

    // Map positionKey -> index dans le tableau de vertices
    const indexMap = new Map<string, number>()
    const positions: number[] = []


    kases.forEach((kase, i) => {
        indexMap.set(kase.positionKey(), i)

        const coordonate = computeKaseCoordonate(kase,computeKaseHeight(kase))
        positions.push(...coordonate)
    })

    // Arêtes entre cases voisines (sans doublon)
    const indices: number[] = []
    const visited = new Set<string>()

    kases.forEach((kase) => {
        const a = indexMap.get(kase.positionKey())!
        tableau.neighbors(kase).forEach((neighbor) => {
            const b = indexMap.get(neighbor.positionKey())!
            const edgeKey = a < b ? `${a}-${b}` : `${b}-${a}`
            if (!visited.has(edgeKey)) {
                visited.add(edgeKey)
                indices.push(a, b)
            }
        })
    })

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setIndex(indices)

    return geometry
}

