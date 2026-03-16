/**
 * Step 68: Tiling: Multi-Scale Rendering
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Tiling: Multi-Scale Rendering',
  chapter: 6,

  math: `<div class="math-section"><h3>Tiled Multi-Scale View</h3>
<p>Render multiple copies of the simulation at different UV scales in a grid.
Shows self-similarity of patterns across scale.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">// Multi-scale tiling: render same texture at 4 different zoom levels
// Divide viewport into 4 quadrants, each with different UV scale:

// Bottom-left: 1× (full field) — vUv unchanged
// Bottom-right: 2× zoom into center
// Top-left: 4× zoom
// Top-right: 8× zoom into center

// In VizShader:
// float scale = gl_FragCoord.x > 256.0 ? 2.0 : 1.0
//             * gl_FragCoord.y > 256.0 ? 2.0 : 1.0;
// vec2 zoomedUV = (vUv - 0.5) / scale + 0.5;

// Reveals: spot spacing is set by reaction-diffusion length scale, not grid
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['coral'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
    })
  }
}
