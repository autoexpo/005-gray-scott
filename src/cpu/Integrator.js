/**
 * Integrator — Euler and RK4 time-steppers for Gray-Scott on CPU.
 *
 * Gray-Scott PDEs:
 *   ∂u/∂t = Du·∇²u − u·v² + f·(1−u)
 *   ∂v/∂t = Dv·∇²v + u·v² − (f+k)·v
 */
import { lap5, lap9 } from './Laplacian.js'

/**
 * Single Euler step.
 * Reads from grid.u/v, writes to grid.u2/v2, then swaps.
 *
 * @param {Grid} grid
 * @param {{ f, k, Du, Dv, dt, stencil }} params
 */
export function eulerStep(grid, params) {
  const { f, k, Du, Dv, dt } = params
  const stencil = params.stencil || '5pt'
  const lapFn = stencil === '9pt' ? lap9 : lap5

  const u = grid.u, v = grid.v
  const u2 = grid.u2, v2 = grid.v2
  const { width: W, height: H } = grid

  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      const i = grid.idx(r, c)
      const ui = u[i]
      const vi = v[i]
      const lu = lapFn(u, grid, r, c)
      const lv = lapFn(v, grid, r, c)
      const uvv = ui * vi * vi

      u2[i] = Math.max(0, Math.min(1, ui + dt * (Du * lu - uvv + f * (1 - ui))))
      v2[i] = Math.max(0, Math.min(1, vi + dt * (Dv * lv + uvv - (f + k) * vi)))
    }
  }
  grid.swap()
}

/**
 * Single RK4 step (4 derivative evaluations).
 *
 * Requires temporary arrays for k-stages; allocates them lazily
 * and caches on the grid object to avoid GC churn.
 *
 * @param {Grid} grid
 * @param {{ f, k, Du, Dv, dt, stencil }} params
 */
export function rk4Step(grid, params) {
  const { f, k, Du, Dv, dt } = params
  const stencil = params.stencil || '5pt'
  const lapFn = stencil === '9pt' ? lap9 : lap5
  const n = grid.n

  // Allocate temp buffers once
  if (!grid._rk4) {
    grid._rk4 = {
      ku1: new Float32Array(n), kv1: new Float32Array(n),
      ku2: new Float32Array(n), kv2: new Float32Array(n),
      ku3: new Float32Array(n), kv3: new Float32Array(n),
      ku4: new Float32Array(n), kv4: new Float32Array(n),
      tu:  new Float32Array(n), tv:  new Float32Array(n),
    }
  }
  const { ku1,kv1, ku2,kv2, ku3,kv3, ku4,kv4, tu, tv } = grid._rk4
  const u = grid.u, v = grid.v
  const { width: W, height: H } = grid

  // Helper: compute derivatives into ku/kv from arbitrary u/v arrays
  const deriv = (ua, va, ku, kv) => {
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        const i = grid.idx(r, c)
        const ui = ua[i], vi = va[i]
        const lu = lapFn(ua, grid, r, c)
        const lv = lapFn(va, grid, r, c)
        const uvv = ui * vi * vi
        ku[i] = Du * lu - uvv + f * (1 - ui)
        kv[i] = Dv * lv + uvv - (f + k) * vi
      }
    }
  }

  // k1 = F(u, v)
  deriv(u, v, ku1, kv1)

  // k2 = F(u + dt/2·k1, v + dt/2·k1)
  for (let i = 0; i < n; i++) { tu[i] = u[i] + 0.5*dt*ku1[i]; tv[i] = v[i] + 0.5*dt*kv1[i] }
  deriv(tu, tv, ku2, kv2)

  // k3 = F(u + dt/2·k2, v + dt/2·k2)
  for (let i = 0; i < n; i++) { tu[i] = u[i] + 0.5*dt*ku2[i]; tv[i] = v[i] + 0.5*dt*kv2[i] }
  deriv(tu, tv, ku3, kv3)

  // k4 = F(u + dt·k3, v + dt·k3)
  for (let i = 0; i < n; i++) { tu[i] = u[i] + dt*ku3[i]; tv[i] = v[i] + dt*kv3[i] }
  deriv(tu, tv, ku4, kv4)

  // Combine: u_new = u + (dt/6)·(k1 + 2k2 + 2k3 + k4)
  for (let i = 0; i < n; i++) {
    grid.u2[i] = Math.max(0, Math.min(1,
      u[i] + (dt/6) * (ku1[i] + 2*ku2[i] + 2*ku3[i] + ku4[i])
    ))
    grid.v2[i] = Math.max(0, Math.min(1,
      v[i] + (dt/6) * (kv1[i] + 2*kv2[i] + 2*kv3[i] + kv4[i])
    ))
  }
  grid.swap()
}

/**
 * Run multiple steps per frame.
 * @param {Grid} grid
 * @param {object} params - includes integrator: 'euler'|'rk4'
 * @param {number} count
 */
export function multiStep(grid, params, count) {
  const fn = params.integrator === 'rk4' ? rk4Step : eulerStep
  for (let i = 0; i < count; i++) fn(grid, params)
}
