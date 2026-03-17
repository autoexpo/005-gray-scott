/**
 * Step 25: Rendering 2D Output to Canvas ImageData
 */
import { createSimControls } from '../../utils/simControls.js'

export default {
  title: 'Rendering 2D Output to Canvas ImageData',
  chapter: 3,

  math: `<div class="math-section"><h3>ImageData Rendering</h3>
<p>CanvasRenderingContext2D.createImageData() creates a pixel buffer.
Each pixel is RGBA (4 bytes). We map u[i] → grayscale byte and write all four channels.</p>
<p>The ImageData buffer is then drawn via putImageData() and scaled to canvas size.</p></div>`,

  code: `<div class="code-section"><h3>Explicit ImageData Usage</h3>
<pre><code class="language-js">function renderImageData(ctx, u, W, H) {
  // Create ImageData buffer (W×H pixels, 4 bytes each)
  const imageData = ctx.createImageData(W, H)
  const data = imageData.data

  // Fill pixel buffer
  for (let i = 0; i < W * H; i++) {
    const gray = Math.round(u[i] * 255)
    data[i*4 + 0] = gray  // R
    data[i*4 + 1] = gray  // G
    data[i*4 + 2] = gray  // B
    data[i*4 + 3] = 255   // A
  }

  // Draw to canvas (scales to fill)
  ctx.putImageData(imageData, 0, 0)
}
</code></pre></div>`,

  init(container, state) {
    // Create manual canvas since this step explicitly demonstrates ImageData
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    canvas.id = 'canvas2d-sim'
    canvas.style.cssText = 'display:block; width:512px; height:512px; margin:auto; margin-top:20px; image-rendering:pixelated; image-rendering:crisp-edges'
    container.appendChild(canvas)

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

    function renderImageData() {
      // Create new ImageData for every frame (explicit approach)
      const imageData = new ImageData(new Uint8ClampedArray(W * H * 4), W, H)
      const data = imageData.data

      // Fill pixel buffer manually
      for (let i = 0; i < W * H; i++) {
        const gray = Math.round(u[i] * 255)
        data[i*4 + 0] = gray  // R
        data[i*4 + 1] = gray  // G
        data[i*4 + 2] = gray  // B
        data[i*4 + 3] = 255   // A
      }

      // Draw to canvas at native resolution
      ctx.putImageData(imageData, 0, 0)
    }

    function animate() {
      animId = requestAnimationFrame(animate)
      if (!paused) {
        // 4 sub-steps per frame for stability
        for (let i = 0; i < 4; i++) step2D()
      }
      // Render using explicit ImageData technique
      renderImageData()
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      controls.remove()
      canvas.remove()
    }
  }
}
