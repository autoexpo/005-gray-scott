/**
 * Step 63: Multi-Band — Visualizing U and V Together
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Multi-Band — Visualizing U and V Together',
  chapter: 6,

  math: `<div class="math-section">
<h3>Multi-Band Rendering</h3>
<p>Multi-band encoding maps both U and V into a single grayscale channel using band separation:</p>
<p>$$c = \\begin{cases}
u/2 & \\text{U band: } [0, 0.5] \\\\
0.5 + v/2 & \\text{V band: } [0.5, 1.0]
\\end{cases}$$</p>

<h4>Intensity Modulation Alternative</h4>
<p>An alternative approach uses intensity modulation:</p>
<p>$$\\text{base} = u$$</p>
<p>$$\\text{modulation} = v \\times 0.3$$</p>
<p>$$c = \\text{base} + \\text{modulation}$$</p>

<h4>Information Capacity</h4>
<p>A single grayscale channel has **8 bits = 256 levels** of information.</p>
<p>To encode 2 channels into 1 perceptually:</p>
<p>• **Weighted sum** (dual mode): Moiré-free, intuitive</p>
<p>• **Band separation**: Clear channel isolation but can cause banding</p>
<p>• **Intensity modulation**: Base pattern + fine detail overlay</p>

<h4>Dual Channel as Moiré-Free Approach</h4>
<p>The weighted sum $$c = u \\times 0.6 + v \\times 0.4$$ avoids visual artifacts because it preserves the natural correlation between U and V in Gray-Scott systems.</p>
</div>`,

  code: `<div class="code-section">
<h3>Adding Custom Viz Modes</h3>
<pre><code class="language-glsl">// To add a custom intensity-modulated dual mode beyond built-in modes:
// In VizShader.js fragment shader, add new mode 6:
else if (uMode == 6) {
  // intensity-modulated dual channel
  float base = u;
  float modulation = v * 0.3;
  c = clamp(base + modulation, 0.0, 1.0);
}</code></pre>

<h4>Multi-Band Encoding</h4>
<pre><code class="language-glsl">// Band separation approach:
if (u > v) {
  // U-dominated region: use U band [0, 0.5]
  c = u * 0.5;
} else {
  // V-dominated region: use V band [0.5, 1.0]
  c = 0.5 + v * 0.5;
}</code></pre>

<h4>Comparing Modes</h4>
<pre><code class="language-js">// User can toggle between dual and grayscale modes via Parameters GUI
// to compare single-channel vs dual-channel visualization:
vizFolder.add(vizCtrl, 'mode', ['bw','grayscale','invert','dual','contour','edge'])
  .name('mode').onChange(v => { currentVizMode = v })</code></pre>
</div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS.stripes },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'dual',
      showGui: true
    })
  }
}