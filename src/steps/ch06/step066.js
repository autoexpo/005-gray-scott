/**
 * Step 66: Contour Lines: Iso-Value Rendering
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Contour Lines: Iso-Value Rendering',
  chapter: 6,

  math: `<div class="math-section"><h3>Contour Lines</h3>
<p>Iso-value lines are rendered by detecting zero-crossings of (u - threshold).
In GLSL: if fract(u × N) < 0.05, draw a line. Creates a topographic map effect.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-glsl">// VizShader: iso-contour rendering using fract()
float u = texture2D(uTexture, vUv).r;
float contours = 10.0;        // number of contour lines
float t = fract(u * contours); // periodic sawtooth 0→1 per contour band
// Draw thin dark line at each contour level:
float line = smoothstep(0.0, 0.05, t) * smoothstep(1.0, 0.95, t);
gl_FragColor = vec4(vec3(line), 1.0);
// Each contour line = locus of cells where U = n/contours (n=0,1,2...)
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['stripes'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'contour',
    })
  }
}
