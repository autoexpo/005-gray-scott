/**
 * Step 41: Visualization Pass — Screen Output
 */

import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Visualization Pass — Screen Output',
  chapter: 4,

  math: `<div class="math-section">
<h3>Separate Visualization Pass</h3>
<p>The visualization pass is a separate render pass that comes after the simulation step. It reads the simulation texture and maps (u,v) values to grayscale or color for screen display.</p>

<p><strong>Two-Pass Pipeline:</strong></p>
<ol>
  <li><strong>Simulation Pass:</strong> Fragment shader computes next (u,v) state → writes to off-screen texture</li>
  <li><strong>Visualization Pass:</strong> Fragment shader reads (u,v) texture → maps to display color → renders to screen</li>
</ol>

<p><strong>Visualization Mappings:</strong></p>
<ul>
  <li><strong>Grayscale:</strong> $\\text{color} = u$ (u directly as intensity)</li>
  <li><strong>Invert:</strong> $\\text{color} = 1-u$ (dark patterns on bright background)</li>
  <li><strong>Hard B&W:</strong> $\\text{color} = \\text{step}(0.5, u)$ (sharp threshold)</li>
  <li><strong>Contours:</strong> $\\text{color} = \\text{fract}(u \\times 8)$ (iso-contour lines)</li>
</ul>

<p><strong>Sobel Edge Detection:</strong> Uses a 3×3 convolution kernel to detect edges in the u field:</p>
<div class="katex-display">$$G_x = \\begin{bmatrix} -1 & 0 & 1 \\\\ -2 & 0 & 2 \\\\ -1 & 0 & 1 \\end{bmatrix} \\quad G_y = \\begin{bmatrix} -1 & -2 & -1 \\\\ 0 & 0 & 0 \\\\ 1 & 2 & 1 \\end{bmatrix}$$</div>
<div class="katex-display">$$|\\nabla u| = \\sqrt{G_x^2 + G_y^2}$$</div>
</div>`,

  code: `<div class="code-section">
<h3>Complete VizShader.js Fragment Shader</h3>
<p>Here's the complete visualization fragment shader with all modes:</p>
<pre><code class="language-glsl">precision highp float;

uniform sampler2D uState;
uniform vec2 uTexelSize;
uniform int uMode;        // 0=gray, 1=invert, 2=dual, 3=contour, 4=edge, 5=bw

varying vec2 vUv;

// Sobel edge detection on u channel
float sobel() {
  vec2 s = uTexelSize;
  float tl = texture2D(uState, vUv + vec2(-s.x,  s.y)).r;
  float tm = texture2D(uState, vUv + vec2( 0.0,  s.y)).r;
  float tr = texture2D(uState, vUv + vec2( s.x,  s.y)).r;
  float ml = texture2D(uState, vUv + vec2(-s.x,  0.0)).r;
  float mr = texture2D(uState, vUv + vec2( s.x,  0.0)).r;
  float bl = texture2D(uState, vUv + vec2(-s.x, -s.y)).r;
  float bm = texture2D(uState, vUv + vec2( 0.0, -s.y)).r;
  float br = texture2D(uState, vUv + vec2( s.x, -s.y)).r;
  float gx = -tl - 2.0*ml - bl + tr + 2.0*mr + br;
  float gy = -tl - 2.0*tm - tr + bl + 2.0*bm + br;
  return clamp(sqrt(gx*gx + gy*gy) * 4.0, 0.0, 1.0);
}

// Contour lines at fixed iso-values
float contour(float val) {
  float lines = 8.0;
  float c = fract(val * lines);
  return step(0.05, c) * step(c, 0.95);
}

void main() {
  vec4 s = texture2D(uState, vUv);
  float u = s.r;
  float v = s.g;
  float c;

  if (uMode == 0) {
    // grayscale: high u = white (food = white, pattern = dark)
    c = u;
  } else if (uMode == 1) {
    // invert
    c = 1.0 - u;
  } else if (uMode == 2) {
    // dual: u in [0..0.5] range, v offset
    c = u * 0.6 + v * 0.4;
  } else if (uMode == 3) {
    // contour
    c = contour(u);
  } else if (uMode == 4) {
    // Sobel edge
    c = sobel();
  } else if (uMode == 5) {
    // hard B&W threshold: white background, pure black pattern
    c = step(0.5, u);
  } else {
    c = u;
  }

  gl_FragColor = vec4(c, c, c, 1.0);
}</code></pre>

<h3>VizShader.setMode() Method</h3>
<pre><code class="language-js">setMode(mode) {
  const modes = { grayscale: 0, invert: 1, dual: 2, contour: 3, edge: 4, bw: 5 }
  this.material.uniforms.uMode.value = modes[mode] ?? 0
}</code></pre>
</div>`,

  init(container) {
    return startGPULoop(container, {
      params: PRESETS.coral,
      vizMode: 'bw',
      size: 256,
      stepsPerFrame: 8,
      showGui: true
    })
  }
}