/**
 * Step 78: Anti-Aliasing — Bilinear vs Nearest Sampling
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Anti-Aliasing — Bilinear vs Nearest Sampling',
  chapter: 7,

  math: `<div class="math-section"><h3>Texture Sampling Methods</h3>
<p>When displaying simulation data, GPU texture sampling affects visual quality:</p>
<div class="math-block">$$\\text{Nearest-neighbor:} \\quad \\text{value} = T[\\lfloor u \\rfloor, \\lfloor v \\rfloor]$$</div>
<div class="math-block">$$\\text{Bilinear:} \\quad \\text{value} = \\sum_{i,j} w_{ij} \\cdot T[i,j]$$</div>
<p>where weights are:</p>
<div class="math-block">$$w_{ij} = (1-\\alpha)(1-\\beta) \\text{ for } T[u,v], \\quad \\alpha\\beta \\text{ for } T[u+1,v+1]$$</div>
<p><strong>Visual comparison</strong>:</p>
<ul>
<li><strong>Nearest sampling</strong>: Sharp pixel boundaries, pixelated look when zoomed</li>
<li><strong>Bilinear sampling</strong>: Smooth gradients, blurred edges</li>
<li><strong>For B&W threshold mode</strong>: Nearest preserves sharp cell boundaries</li>
<li><strong>For grayscale mode</strong>: Bilinear gives smoother appearance</li>
<li><strong>Scientific visualization</strong>: Nearest shows exact simulation values</li>
<li><strong>Aesthetic rendering</strong>: Bilinear looks more natural</li>
</ul>
<p><strong>Implementation</strong>: Set Three.js texture.magFilter property</p></div>`,

  code: `<div class="code-section"><h3>Three.js Texture Filtering</h3>
<pre><code class="language-js">// Setting texture sampling filters in Three.js
function setupTextureFiltering(texture, useSmoothing = true) {
  if (useSmoothing) {
    // Bilinear interpolation (smooth)
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearFilter
    console.log('Using bilinear filtering (smooth)')
  } else {
    // Nearest-neighbor (pixelated)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    console.log('Using nearest filtering (sharp)')
  }

  texture.needsUpdate = true
  return texture
}

// Compare filtering methods visually
function createFilteringComparison(renderer) {
  const size = 128 // Low-res to see pixelation clearly
  const displaySize = 512 // Upscale 4x to see effect

  // Create test texture with sharp features
  const data = new Float32Array(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      // Checkerboard pattern
      const value = ((x + y) % 20 < 10) ? 1.0 : 0.0
      data[idx] = value     // R
      data[idx + 1] = value // G
      data[idx + 2] = value // B
      data[idx + 3] = 1.0   // A
    }
  }

  // Create two display textures
  const textureNearest = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType)
  textureNearest.magFilter = THREE.NearestFilter
  textureNearest.minFilter = THREE.NearestFilter

  const textureBilinear = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType)
  textureBilinear.magFilter = THREE.LinearFilter
  textureBilinear.minFilter = THREE.LinearFilter

  return { textureNearest, textureBilinear }
}

// Analyze aliasing artifacts
function analyzeAliasing(imageData, width, height) {
  let edgePixels = 0
  let totalEdgeContrast = 0

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4
      const center = imageData[idx]

      // Check 4-connected neighbors
      const neighbors = [
        imageData[((y-1) * width + x) * 4],     // Up
        imageData[((y+1) * width + x) * 4],     // Down
        imageData[(y * width + (x-1)) * 4],     // Left
        imageData[(y * width + (x+1)) * 4]      // Right
      ]

      const maxDiff = Math.max(...neighbors.map(n => Math.abs(center - n)))
      if (maxDiff > 0.1) {
        edgePixels++
        totalEdgeContrast += maxDiff
      }
    }
  }

  return {
    edgePixels,
    avgEdgeContrast: totalEdgeContrast / edgePixels,
    aliasRatio: edgePixels / (width * height)
  }
}

// Dynamic filter switching based on zoom level
function adaptiveFiltering(texture, zoomLevel) {
  // Use nearest when zoomed in to see individual pixels
  // Use linear when zoomed out for smooth appearance
  if (zoomLevel > 2.0) {
    texture.magFilter = THREE.NearestFilter
    return 'nearest (zoomed in)'
  } else {
    texture.magFilter = THREE.LinearFilter
    return 'linear (zoomed out)'
  }
}</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: PRESETS.spots,
      size: 128, // Lower resolution to make pixelation visible
      vizMode: 'bw',
      stepsPerFrame: 8,
      showGui: true
    })
  }
}
