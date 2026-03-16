/**
 * Step 65: Edge Detection: Sobel Filter
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Edge Detection: Sobel Filter',
  chapter: 6,

  math: `<div class="math-section"><h3>Sobel Edge Detection</h3>
<p>The Sobel operator computes the gradient magnitude of u, highlighting boundaries between pattern and background.
$$|\\nabla u| = \\sqrt{G_x^2 + G_y^2}$$</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-glsl">// VizShader: Sobel edge detection
// Sample 8 neighbours (3×3 kernel)
float tl = texture2D(t, vUv + vec2(-dx,  dy)).r;
float t0 = texture2D(t, vUv + vec2(  0,  dy)).r;
float tr = texture2D(t, vUv + vec2( dx,  dy)).r;
float ml = texture2D(t, vUv + vec2(-dx,   0)).r;
float mr = texture2D(t, vUv + vec2( dx,   0)).r;
float bl = texture2D(t, vUv + vec2(-dx, -dy)).r;
float b0 = texture2D(t, vUv + vec2(  0, -dy)).r;
float br = texture2D(t, vUv + vec2( dx, -dy)).r;

float gx = -tl - 2.0*ml - bl + tr + 2.0*mr + br;  // horizontal
float gy = -tl - 2.0*t0 - tr + bl + 2.0*b0 + br;  // vertical
float edge = sqrt(gx*gx + gy*gy);
gl_FragColor = vec4(edge, edge, edge, 1.0);
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['spots'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'edge',
    })
  }
}
