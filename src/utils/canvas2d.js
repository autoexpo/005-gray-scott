/**
 * Canvas2D helpers for CPU simulation visualization.
 */

const FIXED_SIZE = 512 // canonical square canvas size for all visualizations

/**
 * Create a fixed 512×512 square 2D canvas centered in the container.
 * The canvas gets id="canvas2d-sim" so CSS can target it directly by ID.
 */
export function makeCanvas2D(container, pixelated = true, onResize = null) {
  const canvas = document.createElement('canvas')
  canvas.width = FIXED_SIZE
  canvas.height = FIXED_SIZE
  canvas.id = 'canvas2d-sim'
  canvas.style.cssText = `display:block; width:${FIXED_SIZE}px; height:${FIXED_SIZE}px; margin:auto; margin-top:20px`
  if (pixelated) {
    canvas.style.imageRendering = 'pixelated'
    canvas.style.imageRendering = 'crisp-edges'
  }
  container.appendChild(canvas)

  // no ResizeObserver needed — canvas is fixed size
  const resize = () => {}
  const disconnect = () => {}

  return { canvas, resize, disconnect }
}

/**
 * Draw a Float32Array u-field to a canvas using ImageData.
 * Scales the grid to fill the canvas.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Float32Array} u - simulation u field
 * @param {number} gW - grid width
 * @param {number} gH - grid height
 * @param {boolean} invert
 */
export function drawGrid(ctx, u, gW, gH, invert = false) {
  const img = ctx.createImageData(gW, gH)
  const d = img.data
  for (let i = 0; i < gW * gH; i++) {
    const v = invert ? 1.0 - u[i] : u[i]
    const c = Math.round(v * 255)
    d[i*4+0] = c
    d[i*4+1] = c
    d[i*4+2] = c
    d[i*4+3] = 255
  }
  // Draw to offscreen, then stretch to canvas
  const off = new OffscreenCanvas(gW, gH)
  const octx = off.getContext('2d')
  octx.putImageData(img, 0, 0)
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(off, 0, 0, ctx.canvas.width, ctx.canvas.height)
}

/**
 * Draw a 1D bar chart of concentration values.
 */
export function drawBarChart(ctx, values, label = '') {
  const W = ctx.canvas.width, H = ctx.canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, W, H)

  const n = values.length
  const barW = W / n
  ctx.fillStyle = '#000'
  for (let i = 0; i < n; i++) {
    const h = values[i] * (H - 20)
    ctx.fillRect(i * barW, H - 20 - h, barW - 0.5, h)
  }

  // Axis
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, H-20); ctx.lineTo(W, H-20)
  ctx.stroke()

  if (label) {
    ctx.fillStyle = '#666'
    ctx.font = '9pt SF Mono, monospace'
    ctx.fillText(label, 4, 12)
  }
}

/**
 * Make a simple Three.js renderer that fills a container.
 */
export function makeThreeRenderer(container) {
  const { THREE } = window
  if (THREE) {
    // If THREE is available globally
  }
}
