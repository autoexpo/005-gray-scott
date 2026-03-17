/**
 * Step 24: Running the 2D CPU Simulation
 */
import { makeCanvas2D, drawGrid } from '../../utils/canvas2d.js'
import { createSimControls } from '../../utils/simControls.js'

export default {
  title: 'Running the 2D CPU Simulation',
  chapter: 3,

  math: `<div class="math-section"><h3>2D CPU Step</h3>
<p>The 2D step is O(N²) per step, making it O(N²·T) total for T steps.
For N=128: 16,384 cells × 1000 steps = 16M operations — feasible on CPU.</p>
<p>Each cell needs 5-point Laplacian: 4 neighbors + center = 5 memory reads per equation.</p></div>`,

  code: `<div class="code-section"><h3>2D CPU Gray-Scott</h3>
<pre><code class="language-js">function step2D(u, v, u2, v2, W, H, params) {
  const { f, k, Du, Dv, dt } = params
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = y * W + x

      // 5-point Laplacian with periodic BCs
      const xp = (x + 1) % W, xm = (x + W - 1) % W
      const yp = (y + 1) % H, ym = (y + H - 1) % H

      const lapU = u[ym*W + x] + u[yp*W + x] + u[y*W + xm] + u[y*W + xp] - 4*u[idx]
      const lapV = v[ym*W + x] + v[yp*W + x] + v[y*W + xm] + v[y*W + xp] - 4*v[idx]

      const uvv = u[idx] * v[idx] * v[idx]
      u2[idx] = Math.max(0, Math.min(1, u[idx] + dt*(Du*lapU - uvv + f*(1-u[idx]))))
      v2[idx] = Math.max(0, Math.min(1, v[idx] + dt*(Dv*lapV + uvv - (f+k)*v[idx])))
    }
  }
}
</code></pre></div>`,

  init(container, state) {
    const { canvas, resize, disconnect } = makeCanvas2D(container)
    const ctx = canvas.getContext('2d')

    const W = 128, H = 128
    const N = W * H

    // Create simulation arrays
    let u = new Float32Array(N).fill(1)
    let v = new Float32Array(N).fill(0)
    let u2 = new Float32Array(N)
    let v2 = new Float32Array(N)

    // Initialize with center spot
    const cx = Math.floor(W/2), cy = Math.floor(H/2)
    const r = 8
    for (let y = cy-r; y <= cy+r; y++) {
      for (let x = cx-r; x <= cx+r; x++) {
        if (x >= 0 && x < W && y >= 0 && y < H) {
          const d = Math.sqrt((x-cx)**2 + (y-cy)**2)
          if (d <= r) {
            const idx = y * W + x
            u[idx] = 0.1
            v[idx] = 0.9
          }
        }
      }
    }

    const params = { f: 0.055, k: 0.062, Du: 0.2097, Dv: 0.105, dt: 1.0 }
    let t = 0, animId, paused = false

    function reset() {
      u.fill(1); v.fill(0)
      // Re-initialize center spot
      for (let y = cy-r; y <= cy+r; y++) {
        for (let x = cx-r; x <= cx+r; x++) {
          if (x >= 0 && x < W && y >= 0 && y < H) {
            const d = Math.sqrt((x-cx)**2 + (y-cy)**2)
            if (d <= r) {
              const idx = y * W + x
              u[idx] = 0.1
              v[idx] = 0.9
            }
          }
        }
      }
      t = 0
    }

    const controls = createSimControls(container, {
      onPause: (p) => { paused = p },
      onReplay: () => { reset() },
    })

    function step2D() {
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const idx = y * W + x

          // 5-point Laplacian with periodic BCs
          const xp = (x + 1) % W, xm = (x + W - 1) % W
          const yp = (y + 1) % H, ym = (y + H - 1) % H

          const lapU = u[ym*W + x] + u[yp*W + x] + u[y*W + xm] + u[y*W + xp] - 4*u[idx]
          const lapV = v[ym*W + x] + v[yp*W + x] + v[y*W + xm] + v[y*W + xp] - 4*v[idx]

          const uvv = u[idx] * v[idx] * v[idx]
          u2[idx] = Math.max(0, Math.min(1, u[idx] + params.dt*(params.Du*lapU - uvv + params.f*(1-u[idx]))))
          v2[idx] = Math.max(0, Math.min(1, v[idx] + params.dt*(params.Dv*lapV + uvv - (params.f+params.k)*v[idx])))
        }
      }
      // Swap buffers
      ;[u, u2] = [u2, u]; [v, v2] = [v2, v]
      t++
    }

    function animate() {
      animId = requestAnimationFrame(animate)
      if (!paused) {
        // 4 sub-steps per frame for stability
        for (let i = 0; i < 4; i++) step2D()
      }
      // Render using drawGrid utility
      drawGrid(ctx, u, W, H, false)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      controls.remove()
      disconnect()
      canvas.remove()
    }
  }
}
