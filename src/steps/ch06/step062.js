/**
 * Step 62: Dual Channel — U and V Together
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Dual Channel — U and V Together',
  chapter: 6,

  math: `<div class="math-section">
<h3>Dual Visualization</h3>
<p>Dual channel visualization combines both U and V fields:</p>
<p>$$c = u \\times 0.6 + v \\times 0.4$$</p>
<p>The V channel is normally invisible in single-channel renders, but showing both reveals their relationship.</p>

<h4>Channel Relationship</h4>
<p>In Gray-Scott dynamics:</p>
<p>• **V is high where U is low** — they're complementary at the reaction front</p>
<p>• **The reaction front** is where most interesting dynamics occur</p>
<p>• **Stable regions** have either high U (food) or low U+V (depleted)</p>

<h4>Alternative Blend Formulas</h4>
<p>Different blending approaches reveal different aspects:</p>
<p>• **Difference**: $$c = |u - v|$$ — highlights the reaction front</p>
<p>• **Maximum**: $$c = \\max(u, v)$$ — shows active regions</p>
<p>• **False color**: $$(u, v, 0)$$ — RGB encoding (but we keep grayscale here)</p>

<h4>Weight Choice Rationale</h4>
<p>The 0.6/0.4 weights are chosen because:</p>
<p>1. U dominates visually (it contains the main pattern structure)</p>
<p>2. V provides subtle detail about reaction front activity</p>
<p>3. The blend remains interpretable as a grayscale pattern</p>
</div>`,

  code: `<div class="code-section">
<h3>VizShader Dual Branch</h3>
<pre><code class="language-glsl">// From VizShader.js fragment shader, mode 2:
else if (uMode == 2) {
  // dual: u in [0..0.5] range, v offset
  c = u * 0.6 + v * 0.4;
}</code></pre>

<h4>Alternative Blending Formulas</h4>
<pre><code class="language-glsl">// Contrast enhancement:
c = abs(u - v);

// Maximum projection:
c = max(u, v);

// Intensity modulation:
float base = u;
float modulation = v * 0.3;
c = base + modulation;</code></pre>

<h4>Dual Channel Information Theory</h4>
<pre><code class="language-js">// Single grayscale channel capacity: 8 bits = 256 levels
// Encoding 2 channels into 1 perceptually:
// - Weighted sum (current approach): Moiré-free
// - Band separation: u → [0, 0.5], v → [0.5, 1.0]
// - Intensity modulation: base brightness + fine detail</code></pre>
</div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS.coral },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'dual',
      showGui: true
    })
  }
}