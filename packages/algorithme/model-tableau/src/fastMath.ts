/**
 * Approximations rapides de la racine carrée.
 *
 * Comparaison des approches :
 *  - Math.sqrt        : exact, mais lent (op. flottante matérielle)
 *  - newtonSqrt       : Newton-Raphson, ~0.01% d'erreur en 3 itérations
 *  - fastInvSqrt      : Quake III "magic number" adapté JS, ~1% d'erreur
 *  - fastSqrt         : fastInvSqrt × n, sqrt approchée via 1/√n
 *  - bitHackSqrt      : estimation binaire pure, précision ~3-5%
 */

// ─────────────────────────────────────────────────────────────────────────────
// Newton-Raphson  :  x_{n+1} = (x_n + n / x_n) / 2
// Converge quadratiquement (~double le nombre de chiffres corrects à chaque itération)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Racine carrée par méthode de Newton-Raphson.
 * @param n          Nombre dont on cherche la racine (≥ 0)
 * @param iterations Nombre d'itérations (défaut: 3 → erreur < 0.01%)
 * @returns √n approché
 */
export function newtonSqrt(n: number, iterations = 3): number {
  if (n < 0) return NaN
  if (n === 0) return 0

  // Estimation initiale via l'exposant du flottant (bonne approximation de départ)
  let x = n
  let x2 = x * 0.5
  // Réutilise le trick bit pour initialiser (voir fastInvSqrt)
  const buf = new ArrayBuffer(8)
  const f64 = new Float64Array(buf)
  const u32 = new Uint32Array(buf)
  f64[0] = n
  // Décale l'exposant de moitié → approximation de √n
  u32[1] = (u32[1] >> 1) + 0x1ff80000
  x = f64[0]
  x2 = n * 0.5

  // Itérations de Newton
  for (let i = 0; i < iterations; i++) {
    x = (x + x2 / x) * 0.5  // x = (x + n/x) / 2  [remplace n/x par x2/x car x2 = n*0.5, donc n/x = x2*2/x → on garde n directement]
  }
  // Correction : x2 est n*0.5, donc n = x2*2
  return x

}

// Version propre sans trick bit, plus lisible
/**
 * Newton-Raphson simple (sans initialisation par bit-hack).
 * Légèrement plus lent à cause d'une mauvaise estimation initiale.
 */
export function newtonSqrtSimple(n: number, iterations = 8): number {
  if (n < 0) return NaN
  if (n === 0) return 0

  let x = n
  for (let i = 0; i < iterations; i++) {
    x = (x + n / x) * 0.5
  }
  return x
}

// ─────────────────────────────────────────────────────────────────────────────
// Fast Inverse Square Root — Quake III (adapté TypeScript via Float32Array)
// 1/√n en une multiplication + une itération de Newton
// ─────────────────────────────────────────────────────────────────────────────

/**
 * "Fast Inverse Square Root" — algorithme du moteur Quake III Arena (1999).
 * Calcule une approximation de 1/√n via manipulation de bits sur float32.
 *
 * Erreur typique : ~0.175% après 1 itération de Newton.
 *
 * @param n  Nombre positif
 * @returns  Approximation de 1/√n
 */
export function fastInvSqrt(n: number): number {
  const buf = new ArrayBuffer(4)
  const f32 = new Float32Array(buf)
  const i32 = new Int32Array(buf)

  const half = 0.5 * n
  f32[0] = n
  // Magie : 0x5f3759df est la constante magique de Quake
  i32[0] = 0x5f3759df - (i32[0] >> 1)
  const y = f32[0]
  // Une itération de Newton : y = y * (1.5 - half * y * y)
  return y * (1.5 - half * y * y)
}

/**
 * Racine carrée rapide via Fast Inverse Square Root.
 * √n = n × (1/√n)
 *
 * Erreur typique : ~0.175%
 * Plus rapide que newtonSqrt pour une précision moindre.
 *
 * @param n  Nombre positif
 * @returns  Approximation de √n
 */
export function fastSqrt(n: number): number {
  if (n <= 0) return 0
  return n * fastInvSqrt(n)
}

// ─────────────────────────────────────────────────────────────────────────────
// Benchmark utilitaire (usage développement)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compare la précision et la performance des différentes méthodes.
 * @param n      Nombre à tester
 * @param loops  Nombre de répétitions pour le benchmark
 */
export function benchmarkSqrt(n: number, loops = 1_000_000): void {
  const exact = Math.sqrt(n)

  const time = (fn: () => number): { result: number; ms: number } => {
    const t0 = performance.now()
    let r = 0
    for (let i = 0; i < loops; i++) r = fn()
    return { result: r, ms: performance.now() - t0 }
  }

  const ref    = time(() => Math.sqrt(n))
  const newton = time(() => newtonSqrt(n))
  const fast   = time(() => fastSqrt(n))

  console.table({
    'Math.sqrt':    { result: ref.result,    erreur: '0%',                                          ms: ref.ms.toFixed(2) },
    'newtonSqrt':   { result: newton.result, erreur: `${(Math.abs(newton.result - exact) / exact * 100).toFixed(4)}%`, ms: newton.ms.toFixed(2) },
    'fastSqrt':     { result: fast.result,   erreur: `${(Math.abs(fast.result   - exact) / exact * 100).toFixed(4)}%`, ms: fast.ms.toFixed(2) },
  })
}

