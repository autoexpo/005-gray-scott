/**
 * Step 60: Inverted Grayscale: White Background
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Inverted Grayscale: White Background',
  chapter: 6,

  math: `<div class="math-section"><h3>Inverted Grayscale</h3>
<p>output = (1-u, 1-u, 1-u, 1). Now pattern regions appear bright white on a black background. This is the most popular visualization for Gray-Scott.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-glsl">// VizShader: inverted grayscale (conventional Gray-Scott display)
float u = texture2D(uTexture, vUv).r;
float display = 1.0 - u;  // invert: V-active regions become bright
gl_FragColor = vec4(display, display, display, 1.0);
// Bright → high V (patterns) | Dark → background (U≈1)
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
