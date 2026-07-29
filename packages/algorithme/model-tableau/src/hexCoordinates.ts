/**
 * Conversion de coordonnées hexagonales axiales (q, r) vers coordonnées orthogonales (x, y).
 *
 * Le système de coordonnées de HexagonalTableau utilise des coordonnées axiales :
 *   q = colonne (axe x du tableau)
 *   r = ligne   (axe y du tableau)
 *
 * R = longueur d'un côté de l'hexagone (= rayon du cercle circumscrit)
 */

export interface OrthoCoords {
  x: number
  y: number
}

/**
 * Hexagones à sommet plat (flat-top) :
 *
 *       ___
 *      /   \
 *     /     \
 *     \     /
 *      \___/
 *
 *   x = R * 3/2 * q
 *   y = R * sqrt(3) * (r + q/2)
 */
export function hexAxialToOrthoFlatTop(q: number, r: number, R: number): OrthoCoords {
  return {
    x: R * (3 / 2) * q,
    y: R * Math.sqrt(3) * (r + q / 2),
  }
}

/**
 * Hexagones à sommet pointu (pointy-top) :
 *
 *     /\
 *    /  \
 *    \  /
 *     \/
 *
 *   x = R * sqrt(3) * (q + r/2)
 *   y = R * 3/2 * r
 */
export function hexAxialToOrthoPointyTop(q: number, r: number, R: number): OrthoCoords {
  return {
    x: R * Math.sqrt(3) * (q + r / 2),
    y: R * (3 / 2) * r,
  }
}

/**
 * Alias générique — flat-top par défaut.
 * @param q  coordonnée axiale q (= kase.x dans HexagonalTableau)
 * @param r  coordonnée axiale r (= kase.y dans HexagonalTableau)
 * @param R  longueur d'un côté de l'hexagone
 * @param orientation  'flat-top' (défaut) | 'pointy-top'
 */
export function hexToOrtho(
  q: number,
  r: number,
  R: number,
  orientation: 'flat-top' | 'pointy-top' = 'flat-top',
): OrthoCoords {
  return orientation === 'pointy-top'
    ? hexAxialToOrthoPointyTop(q, r, R)
    : hexAxialToOrthoFlatTop(q, r, R)
}

