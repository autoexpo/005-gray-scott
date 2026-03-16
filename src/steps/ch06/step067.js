/**
 * Step 67: Zoom and Pan: UV Offset/Scale Uniforms
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Zoom and Pan: UV Offset/Scale Uniforms',
  chapter: 6,

  math: `<div class="math-section"><h3>Zoom and Pan</h3>
<p>A UV offset and scale uniform in the visualization shader allows zooming into
regions of interest without changing the simulation resolution.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">// Zoom/pan via UV uniforms in VizShader (not SimShader)
// Scale: zoom > 1 = zoom in (smaller UV range → fewer cells displayed)
// Offset: pan to different region

// In VizShader:
// vec2 zoomedUV = (vUv - 0.5) / zoom + 0.5 + panOffset;
// float u = texture2D(uTexture, zoomedUV).r;

// Example: 4× zoom into center
const zoom = 4.0
const panX = 0.0  // centered
const panY = 0.0

// Reveals concentration gradient at spot boundary:
// U transitions from ≈1 (background) to ≈0 (spot center) over ~5 cells
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['spots'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
    })
  }
}
