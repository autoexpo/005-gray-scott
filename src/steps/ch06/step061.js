/**
 * Step 61: False Color LUT (B&W Gradient)
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'False Color LUT (B&W Gradient)',
  chapter: 6,

  math: `<div class="math-section"><h3>False Color</h3>
<p>Map u through a lookup table (LUT). A simple B&W gradient: low u → black, high u → white, with a non-linear mapping to enhance contrast in the pattern region.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-glsl">// False color lookup table (concept — extend VizShader to add this):
float u = texture2D(uTexture, vUv).r;
// Multi-stop color ramp: dark blue → cyan → yellow → red
vec3 color = u < 0.33 ? mix(vec3(0,0,0.5), vec3(0,1,1), u/0.33)
           : u < 0.66 ? mix(vec3(0,1,1), vec3(1,1,0), (u-0.33)/0.33)
           :             mix(vec3(1,1,0), vec3(1,0,0), (u-0.66)/0.34);
gl_FragColor = vec4(color, 1.0);
// False color reveals gradients invisible in grayscale
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['stripes'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
    })
  }
}
