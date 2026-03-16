/**
 * Step 59: Grayscale Mapping: U to Luminance
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Grayscale Mapping: U to Luminance',
  chapter: 6,

  math: `<div class="math-section"><h3>Grayscale Mapping</h3>
<p>The simplest visualization: output = (u, u, u, 1). High food = bright white. Pattern regions where V is high and U is depleted appear dark.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-glsl">// VizShader: grayscale mode
// Read U from R channel (u stored in .r, v stored in .g)
float u = texture2D(uTexture, vUv).r;
gl_FragColor = vec4(u, u, u, 1.0);
// Bright → high U (food-rich, V-inactive) | Dark → low U (V active)
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['spots'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'grayscale',
    })
  }
}
