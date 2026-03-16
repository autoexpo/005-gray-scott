import { Page } from '@playwright/test'

/** Read all pixels from a canvas element (works for both Canvas2D and WebGL via drawImage bridge) */
export async function readPixels(page: Page, selector = '#canvas2d-sim'): Promise<Uint8ClampedArray> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement
    let src: HTMLCanvasElement
    if (el instanceof HTMLCanvasElement) {
      src = el
    } else {
      src = el.querySelector('canvas') as HTMLCanvasElement
    }
    const tmp = document.createElement('canvas')
    tmp.width = src.width || src.offsetWidth || 512
    tmp.height = src.height || src.offsetHeight || 512
    const ctx = tmp.getContext('2d')!
    ctx.drawImage(src, 0, 0, tmp.width, tmp.height)
    return Array.from(ctx.getImageData(0, 0, tmp.width, tmp.height).data) as number[]
  }, selector).then(arr => new Uint8ClampedArray(arr))
}

/** Ratio of pixels with brightness < threshold (0..255) */
export function darkPixelRatio(pixels: Uint8ClampedArray, threshold = 50): number {
  let dark = 0
  for (let i = 0; i < pixels.length; i += 4) {
    const brightness = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3
    if (brightness < threshold) dark++
  }
  return dark / (pixels.length / 4)
}

/** Ratio of pixels with brightness > threshold */
export function brightPixelRatio(pixels: Uint8ClampedArray, threshold = 200): number {
  let bright = 0
  for (let i = 0; i < pixels.length; i += 4) {
    const brightness = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3
    if (brightness > threshold) bright++
  }
  return bright / (pixels.length / 4)
}

/** Variance of pixel brightness — higher means more content/pattern */
export function pixelVariance(pixels: Uint8ClampedArray): number {
  const n = pixels.length / 4
  let sum = 0, sumSq = 0
  for (let i = 0; i < pixels.length; i += 4) {
    const b = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3
    sum += b
    sumSq += b * b
  }
  const mean = sum / n
  return sumSq / n - mean * mean
}

/** Count distinct grey levels (quantized by tolerance) */
export function countDistinctGreyLevels(pixels: Uint8ClampedArray, tolerance = 20): number {
  const buckets = new Set<number>()
  for (let i = 0; i < pixels.length; i += 4) {
    const b = Math.round(((pixels[i] + pixels[i+1] + pixels[i+2]) / 3) / tolerance)
    buckets.add(b)
  }
  return buckets.size
}

/** Peak brightness in a horizontal slice at given y ratio (0..1) */
export function peakBrightnessInSlice(pixels: Uint8ClampedArray, width: number, height: number, yRatio = 0.5): number {
  const y = Math.floor(yRatio * height)
  let peak = 0
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4
    const b = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3
    if (b > peak) peak = b
  }
  return peak / 255
}