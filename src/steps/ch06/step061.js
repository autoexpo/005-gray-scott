/**
 * Step 61: Hard B&W Threshold
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Hard B&W Threshold',
  chapter: 6,

  math: `<div class="math-section">
<h3>Hard Thresholding</h3>
<p>Hard thresholding creates pure binary output:</p>
<p>$$c = \\text{step}(0.5, u)$$</p>
<p>Where the GLSL step function is defined as:</p>
<p>$$\\text{step}(\\text{edge}, x) = \\begin{cases}
0.0 & \\text{if } x < \\text{edge} \\\\
1.0 & \\text{if } x \\geq \\text{edge}
\\end{cases}$$</p>

<h4>Perfect Heaviside Function</h4>
<p>This creates a 1-bit render with no intermediate gray values—only pure black or white.</p>
<p>The threshold 0.5 sits at the reaction front where u transitions from ~0 (activator region) to ~1 (food region).</p>

<h4>Vector Graphics Aesthetic</h4>
<p>Hard thresholding produces the crispest visual output, matching vector graphics aesthetics.</p>
<p>At simulation resolution (256×256), each pixel covers one cell, so there's no sub-pixel aliasing despite the discontinuous step function.</p>

<h4>Tunable Threshold</h4>
<p>The threshold can be adjusted to emphasize different features:</p>
<p>• **threshold < 0.5**: thicker patterns, emphasizes activator regions</p>
<p>• **threshold > 0.5**: thinner patterns, emphasizes food boundaries</p>
</div>`,

  code: `<div class="code-section">
<h3>VizShader B&W Branch</h3>
<pre><code class="language-glsl">// From VizShader.js fragment shader, mode 5:
else if (uMode == 5) {
  // hard B&W threshold: white background, pure black pattern
  c = step(0.5, u);
}</code></pre>

<h4>Alternative Thresholds</h4>
<pre><code class="language-glsl">// Adjustable threshold as uniform:
uniform float uThreshold;

// In fragment shader:
c = step(uThreshold, u);

// Smooth threshold alternative:
c = smoothstep(uThreshold - 0.05, uThreshold + 0.05, u);</code></pre>

<h4>Comparison with Grayscale</h4>
<pre><code class="language-js">// Grayscale: preserves all u values
c = u;  // smooth gradient

// Hard B&W: binary quantization
c = step(0.5, u);  // sharp edges

// Inverted B&W: white patterns on black background
c = 1.0 - step(0.5, u);</code></pre>
</div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS.spots },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'bw',
      showGui: true
    })
  }
}