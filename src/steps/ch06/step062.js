/**
 * Step 62: Gradient Mapping: Two-Color Interpolation
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Gradient Mapping: Two-Color Interpolation',
  chapter: 6,

  math: `<div class="math-section"><h3>Two-Color Gradient</h3>
<p>Linearly interpolate between two colors (in B&W: two grays) as a function of u.
The effective range [0.3, 0.7] is where most pattern information lives.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-glsl">// VizShader: two-color gradient mapping
float u = texture2D(uTexture, vUv).r;
vec3 colorA = vec3(0.05, 0.05, 0.3);  // deep blue (low U / V-active)
vec3 colorB = vec3(1.0, 0.98, 0.9);   // warm white (high U / background)
gl_FragColor = vec4(mix(colorA, colorB, u), 1.0);
// Same as D3: d3.scaleSequential([colorA, colorB]).domain([0, 1])
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['worms'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
    })
  }
}
