/**
 * Step 66: Contour Lines — Iso-Value Rendering
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Contour Lines — Iso-Value Rendering',
  chapter: 6,

  math: `<div class="math-section">
<h3>Contour Line Generation</h3>
<p>Contour lines visualize iso-values (constant levels) in the u field:</p>
<p>$$c = \\text{fract}(u \\times \\text{lines})$$</p>
<p>where $$\\text{lines} = 8$$ creates 8 equally-spaced contour levels.</p>

<h4>Sawtooth to Smooth Bands</h4>
<p>The $$\\text{fract}$$ function creates a sawtooth wave: (0→1, 0→1, ...)</p>
<p>To eliminate sharp jumps and create smooth bands:</p>
<p>$$c = \\text{step}(0.05, \\text{fract}(u \\times \\text{lines})) \\times \\text{step}(\\text{fract}(u \\times \\text{lines}), 0.95)$$</p>

<h4>Topographic Map Analogy</h4>
<p>Like elevation contours on a topographic map:</p>
<p>• Each line represents constant u concentration</p>
<p>• Closely spaced lines = steep gradients (reaction fronts)</p>
<p>• Widely spaced lines = gentle gradients (stable regions)</p>

<h4>Contour Line Spacing</h4>
<p>The number of contour lines affects visualization:</p>
<p>• **Few lines** (lines = 4): broad bands, shows major structure</p>
<p>• **Many lines** (lines = 16): fine detail, can become noisy</p>
<p>• **Optimal** (lines = 8): balances structure and detail</p>
</div>`,

  code: `<div class="code-section">
<h3>Contour Function in VizShader</h3>
<pre><code class="language-glsl">// From VizShader.js contour() function:
float contour(float val) {
  float lines = 8.0;
  float c = fract(val * lines);
  return step(0.05, c) * step(c, 0.95);
}</code></pre>

<h4>Contour Mode Usage</h4>
<pre><code class="language-glsl">// In VizShader.js fragment shader, mode 3:
else if (uMode == 3) {
  // contour lines
  c = contour(u);
}</code></pre>

<h4>Adjustable Contour Lines</h4>
<pre><code class="language-glsl">// To make number of contour lines adjustable:
uniform float uContourLines;

float contour(float val) {
  float c = fract(val * uContourLines);
  return step(0.05, c) * step(c, 0.95);
}

// Alternative: thin line contours
float thinContour(float val) {
  float c = fract(val * uContourLines);
  return step(0.48, c) * step(c, 0.52);  // narrow lines
}</code></pre>

<h4>Alternative Iso-Value Approaches</h4>
<pre><code class="language-glsl">// Zero-crossing detection (more complex):
float derivative = length(vec2(dFdx(val), dFdy(val)));
float modded = fract(val * lines);
return smoothstep(0.0, derivative, abs(modded - 0.5));</code></pre>
</div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS.spots },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'contour',
      showGui: true
    })
  }
}