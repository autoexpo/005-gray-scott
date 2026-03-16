/**
 * Step 65: Edge Detection — Sobel Filter
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Edge Detection — Sobel Filter',
  chapter: 6,

  math: `<div class="math-section">
<h3>Sobel Operator</h3>
<p>The Sobel operator computes the gradient magnitude of the u field:</p>
<p>$$|\\nabla u| = \\sqrt{G_x^2 + G_y^2}$$</p>

<h4>Sobel Kernels</h4>
<p>The horizontal and vertical gradient kernels are:</p>
<p>$$G_x = \\begin{bmatrix} -1 & 0 & 1 \\\\ -2 & 0 & 2 \\\\ -1 & 0 & 1 \\end{bmatrix} * u$$</p>
<p>$$G_y = \\begin{bmatrix} -1 & -2 & -1 \\\\ 0 & 0 & 0 \\\\ 1 & 2 & 1 \\end{bmatrix} * u$$</p>

<h4>Reaction Front Visualization</h4>
<p>For Gray-Scott patterns, Sobel edge detection:</p>
<p>• **Traces the reaction front** where u changes rapidly</p>
<p>• **Creates wire-frame view** of pattern boundaries</p>
<p>• **Highlights active regions** where chemical dynamics are strongest</p>

<h4>Scaling Factor</h4>
<p>The gradient magnitude is multiplied by 4 for visibility:</p>
<p>$$c = \\text{clamp}(4 \\times |\\nabla u|, 0, 1)$$</p>
<p>This scaling compensates for the typically small gradient values in smooth reaction-diffusion patterns.</p>
</div>`,

  code: `<div class="code-section">
<h3>Sobel Implementation in VizShader</h3>
<pre><code class="language-glsl">// From VizShader.js sobel() function:
float sobel() {
  vec2 s = uTexelSize;
  float tl = texture2D(uState, vUv + vec2(-s.x,  s.y)).r;  // top-left
  float tm = texture2D(uState, vUv + vec2( 0.0,  s.y)).r;  // top-middle
  float tr = texture2D(uState, vUv + vec2( s.x,  s.y)).r;  // top-right
  float ml = texture2D(uState, vUv + vec2(-s.x,  0.0)).r;  // middle-left
  float mr = texture2D(uState, vUv + vec2( s.x,  0.0)).r;  // middle-right
  float bl = texture2D(uState, vUv + vec2(-s.x, -s.y)).r;  // bottom-left
  float bm = texture2D(uState, vUv + vec2( 0.0, -s.y)).r;  // bottom-middle
  float br = texture2D(uState, vUv + vec2( s.x, -s.y)).r;  // bottom-right

  // Gx: horizontal gradient
  float gx = -tl - 2.0*ml - bl + tr + 2.0*mr + br;

  // Gy: vertical gradient
  float gy = -tl - 2.0*tm - tr + bl + 2.0*bm + br;

  // Magnitude with scaling
  return clamp(sqrt(gx*gx + gy*gy) * 4.0, 0.0, 1.0);
}</code></pre>

<h4>Edge Mode Usage</h4>
<pre><code class="language-glsl">// In VizShader.js fragment shader, mode 4:
else if (uMode == 4) {
  // Sobel edge detection
  c = sobel();
}</code></pre>
</div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS.spots },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'edge',
      showGui: true
    })
  }
}