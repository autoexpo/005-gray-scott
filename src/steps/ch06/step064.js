/**
 * Step 64: Temporal Blending — Motion Blur
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Temporal Blending — Motion Blur',
  chapter: 6,

  math: `<div class="math-section">
<h3>Temporal Blending</h3>
<p>Motion blur accumulates frames over time to smooth temporal variations:</p>

<h4>Simple Frame Averaging</h4>
<p>Accumulate N frames and divide by N:</p>
<p>$$c_{\\text{avg}} = \\frac{1}{N} \\sum_{i=0}^{N-1} c_i$$</p>

<h4>Exponential Moving Average</h4>
<p>More efficient approach using exponential decay:</p>
<p>$$c_t = \\alpha \\cdot c_{\\text{current}} + (1-\\alpha) \\cdot c_{\\text{prev}}$$</p>
<p>Where $$\\alpha = 0.1$$ gives approximately a 10-frame average.</p>

<h4>Motion Blur Properties</h4>
<p>For Gray-Scott patterns:</p>
<p>• **Slow pattern changes**: motion blur just softens edges slightly</p>
<p>• **Fast dynamics**: creates trailing effects behind moving fronts</p>
<p>• **Noise reduction**: smooths out high-frequency temporal noise</p>

<h4>Tradeoff: Smoothness vs Latency</h4>
<p>$$\\text{Response time} \\approx \\frac{1}{\\alpha}$$ frames</p>
<p>• Lower α = smoother but more latent</p>
<p>• Higher α = more responsive but noisier</p>
</div>`,

  code: `<div class="code-section">
<h3>Canvas-Based Temporal Blending</h3>
<pre><code class="language-js">// Motion blur requires separate accumulation (not in current GPU pipeline)
// Canvas2D implementation example:

// Two canvas layers approach:
const currentCanvas = document.createElement('canvas');
const accumulationCanvas = document.createElement('canvas');
const ctx = accumulationCanvas.getContext('2d');

function renderWithMotionBlur(currentFrame) {
  // Render current frame to currentCanvas
  renderFrame(currentCanvas, currentFrame);

  // Blend into accumulation buffer
  ctx.globalAlpha = 0.1;  // α = 0.1
  ctx.drawImage(currentCanvas, 0, 0);

  // Display the accumulated result
  displayCanvas.getContext('2d').drawImage(accumulationCanvas, 0, 0);
}</code></pre>

<h4>CSS-Based Motion Blur</h4>
<pre><code class="language-css">/* Stacked canvas approach with CSS opacity */
.canvas-stack {
  position: relative;
}

.current-frame {
  position: absolute;
  opacity: 0.1;
}

.accumulated-frame {
  position: absolute;
  opacity: 0.9;
}</code></pre>

<h4>GPU Motion Blur (Future Enhancement)</h4>
<pre><code class="language-glsl">// Would require additional FBO for accumulation:
// In fragment shader:
vec4 current = texture2D(uCurrentFrame, vUv);
vec4 previous = texture2D(uAccumBuffer, vUv);
gl_FragColor = mix(previous, current, uAlpha);  // α blending</code></pre>
</div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS.waves },
      size: 256,
      stepsPerFrame: 4,
      vizMode: 'bw',
      showGui: true
    })
  }
}