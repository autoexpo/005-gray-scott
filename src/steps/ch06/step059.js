/**
 * Step 59: Grayscale Mapping — U to Luminance
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Grayscale Mapping — U to Luminance',
  chapter: 6,

  math: `<div class="math-section">
<h3>Linear Mapping: U to Luminance</h3>
<p>The simplest visualization maps the u field directly to grayscale luminance:</p>
<p>$$L = u \\times 255$$</p>
<p>Where u ∈ [0,1] becomes luminance L ∈ [0,255]. This linear mapping works well for Gray-Scott because patterns are naturally high-contrast.</p>

<h4>Display Pipeline</h4>
<p>The GPU rendering pipeline converts floating-point u values to screen pixels:</p>
<p>1. **Float texture**: u stored as 32-bit float in [0,1]</p>
<p>2. **Fragment shader**: $$\\text{color} = (u, u, u, 1)$$</p>
<p>3. **Framebuffer**: clamped to [0,1], multiplied by 255, rounded to Uint8</p>

<h4>Alternative Mappings</h4>
<p>**Gamma correction**: $$L = (u^{1/2.2}) \\times 255$$ — compensates for monitor nonlinearity</p>
<p>**Perceptual lightness**: $$L^* = 116(u^{1/3}) - 16$$ — CIELAB lightness</p>
<p>For Gray-Scott, linear mapping is preferred due to the binary nature of reaction-diffusion patterns.</p>
</div>`,

  code: `<div class="code-section">
<h3>VizShader Grayscale Branch</h3>
<pre><code class="language-glsl">// From VizShader.js fragment shader, mode 0:
if (uMode == 0) {
  // grayscale: high u = white (food = white, pattern = dark)
  c = u;
}

// Final output to screen
gl_FragColor = vec4(c, c, c, 1.0);</code></pre>

<h4>GPU vs Canvas2D Rendering</h4>
<pre><code class="language-js">// GPU approach (current): direct texture sampling
const color = texture2D(uState, vUv).r;
gl_FragColor = vec4(color, color, color, 1.0);

// Canvas2D alternative: pixel-by-pixel
const imageData = ctx.createImageData(256, 256);
for (let i = 0; i < data.length; i++) {
  const gray = Math.floor(simulationData[i] * 255);
  imageData.data[i*4] = gray;     // R
  imageData.data[i*4+1] = gray;   // G
  imageData.data[i*4+2] = gray;   // B
  imageData.data[i*4+3] = 255;    // A
}
ctx.putImageData(imageData, 0, 0);</code></pre>
</div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS.spots },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'grayscale',
      showGui: true
    })
  }
}