/**
 * Step 58: Seeding Shader: GPU-Side Paint
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Seeding Shader: GPU-Side Paint',
  chapter: 5,

  math: `<div class="math-section"><h3>GPU Seeding Shader</h3>
<p>The seeding pass runs as an additional render pass before the simulation step.
It writes V=1, U=0 in a circular region centered on the mouse UV coordinate.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">// SeedShader — GPU-side V injection
// Fragment shader (simplified):
uniform vec2 seedPos;    // UV coordinates of click
uniform float seedRadius; // Gaussian spread

void main() {
  vec2 d = vUv - seedPos;
  float dist2 = dot(d, d);
  float sigma2 = seedRadius * seedRadius;
  float strength = exp(-dist2 / (2.0 * sigma2));

  vec4 current = texture2D(uTexture, vUv);
  float v_new = min(1.0, current.g + strength);
  gl_FragColor = vec4(current.r * (1.0 - strength), v_new, 0.0, 1.0);
}
// Custom seeds: change seedPos/Radius or inject patterns (stamps, brushes)
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['coral'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
    })
  }
}
