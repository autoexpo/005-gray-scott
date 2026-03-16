/**
 * Step 39: Full Gray-Scott Update in GLSL
 */

import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Full Gray-Scott Update in GLSL',
  chapter: 4,

  math: `<div class="math-section">
<h3>Complete Gray-Scott PDE in Discrete Form for GPU</h3>
<p>The fragment shader implements the complete Gray-Scott update in GLSL. The core equations in discrete form are:</p>
<div class="katex-display">$$\\frac{\\partial u}{\\partial t} = D_u \\nabla^2 u - u v^2 + f(1-u)$$</div>
<div class="katex-display">$$\\frac{\\partial v}{\\partial t} = D_v \\nabla^2 v + u v^2 - (f+k)v$$</div>

<p>Each term has a specific meaning:</p>
<ul>
  <li><strong>Reaction term:</strong> $uvv = u \\cdot v \\cdot v$ — autocatalytic reaction where v converts u</li>
  <li><strong>Feed term:</strong> $f \\cdot (1-u)$ — constant replenishment of u where it's depleted</li>
  <li><strong>Kill term:</strong> $(f+k) \\cdot v$ — removal of v at rate f+k</li>
  <li><strong>Diffusion terms:</strong> $D_u \\nabla^2 u$ and $D_v \\nabla^2 v$ — spatial spreading</li>
</ul>

<p>The Euler integration step becomes:</p>
<div class="katex-display">$$u^{n+1} = u^n + \\Delta t \\cdot \\left[ D_u \\nabla^2 u^n - (u v^2)^n + f(1-u^n) \\right]$$</div>
<div class="katex-display">$$v^{n+1} = v^n + \\Delta t \\cdot \\left[ D_v \\nabla^2 v^n + (u v^2)^n - (f+k)v^n \\right]$$</div>

<p>We use <code>clamp(x, 0.0, 1.0)</code> to ensure concentrations stay in physical bounds, preventing numerical instabilities that could cause negative concentrations or runaway values.</p>
</div>`,

  code: `<div class="code-section">
<h3>Complete Fragment Shader Implementation</h3>
<p>Here is the complete GLSL fragment shader from SimShader.js that implements the Gray-Scott equations on the GPU:</p>
<pre><code class="language-glsl">precision highp float;

uniform sampler2D uState;
uniform vec2 uTexelSize;   // 1/width, 1/height
uniform float uF;
uniform float uK;
uniform float uDu;
uniform float uDv;
uniform float uDt;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec4 center = texture2D(uState, uv);
  float u = center.r;
  float v = center.g;

  // 5-point Laplacian stencil
  float u_n = texture2D(uState, uv + vec2(0.0,  uTexelSize.y)).r;
  float u_s = texture2D(uState, uv + vec2(0.0, -uTexelSize.y)).r;
  float u_e = texture2D(uState, uv + vec2( uTexelSize.x, 0.0)).r;
  float u_w = texture2D(uState, uv + vec2(-uTexelSize.x, 0.0)).r;

  float v_n = texture2D(uState, uv + vec2(0.0,  uTexelSize.y)).g;
  float v_s = texture2D(uState, uv + vec2(0.0, -uTexelSize.y)).g;
  float v_e = texture2D(uState, uv + vec2( uTexelSize.x, 0.0)).g;
  float v_w = texture2D(uState, uv + vec2(-uTexelSize.x, 0.0)).g;

  float lapU = u_n + u_s + u_e + u_w - 4.0 * u;
  float lapV = v_n + v_s + v_e + v_w - 4.0 * v;

  // Gray-Scott reaction
  float uvv = u * v * v;
  float du = uDu * lapU - uvv + uF * (1.0 - u);
  float dv = uDv * lapV + uvv - (uF + uK) * v;

  // Euler step
  float newU = clamp(u + uDt * du, 0.0, 1.0);
  float newV = clamp(v + uDt * dv, 0.0, 1.0);

  gl_FragColor = vec4(newU, newV, 0.0, 1.0);
}</code></pre>

<p>This shader represents the core of the Gray-Scott simulation. Every pixel computes its next state based on its current state and its 4 neighbors, implementing the complete PDE system in parallel across the entire grid.</p>
</div>`,

  init(container) {
    return startGPULoop(container, {
      params: PRESETS.spots,
      vizMode: 'bw',
      size: 256,
      stepsPerFrame: 8,
      showGui: true
    })
  }
}