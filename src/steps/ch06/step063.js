/**
 * Step 63: Multi-Band: Visualizing U and V Together
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Multi-Band: Visualizing U and V Together',
  chapter: 6,

  math: `<div class="math-section"><h3>Dual Channel: U and V</h3>
<p>Visualize both species simultaneously: u contributes to brightness, v to a different visual channel. In B&W: output = u × 0.6 + v × 0.4.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-glsl">// VizShader: dual channel — U drives red, V drives green
vec2 uv_val = texture2D(uTexture, vUv).rg;
float u = uv_val.r;  // food species
float v = uv_val.g;  // activator species
gl_FragColor = vec4(u, v, 0.0, 1.0);
// Anti-correlation: where V is green-bright, U is red-dark
// They cannot both be high simultaneously — the reaction ensures this
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['mitosis'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'dual',
    })
  }
}
