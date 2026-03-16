/**
 * Step 41: Visualization Pass: Screen Output
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Visualization Pass: Screen Output',
  chapter: 4,

  math: `<div class="math-section"><h3>Visualization Pass</h3>
<p>After simulation, a second full-screen pass reads the (u,v) texture and
converts it to displayable RGB. This separation allows multiple viz modes.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">// Two-pass GPU architecture:
// Pass 1 — SimShader: compute new (u,v) → write to FBO
// Pass 2 — VizShader: read (u,v) texture → output RGB to screen

// VizShader grayscale mode:
// float u = texture2D(uTexture, vUv).r;
// gl_FragColor = vec4(u, u, u, 1.0);  // U maps to luminance

// Separation: change vizMode without touching physics
sim.render('grayscale')   // bright = high U (food-rich)
sim.render('invert')      // bright = high V (activator-rich)
sim.render('edge')        // bright = pattern boundaries
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
