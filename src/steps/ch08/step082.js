/**
 * Step 82: Noise Perturbation: Gaussian Noise on U
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Noise Perturbation: Gaussian Noise on U',
  chapter: 8,

  math: `<div class="math-section"><h3>Stochastic Noise</h3>
<p>Adding Gaussian noise to U each step: $U \leftarrow U + \epsilon \cdot \mathcal{N}(0,1)$.
Small noise (ε=0.001) breaks symmetry and accelerates pattern formation.
Large noise disrupts existing patterns.</p></div>`,

  code: `<div class="code-section"><h3>Noise Injection GLSL</h3>
<pre><code class="language-js">// Add noise to U field each timestep
uniform float u_noiseLevel;  // ε = 0.001 typical

// Simple noise function (hash-based pseudorandom)
float noise(vec2 uv, float time) {
  vec2 seed = uv * 12.9898 + vec2(78.233, 37.719) + time;
  return fract(sin(dot(seed, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
}

// In Gray-Scott fragment shader:
void main() {
  // ... compute Gray-Scott terms ...

  // Add noise to U
  float randVal = noise(v_uv, u_time) * u_noiseLevel;
  u_new = clamp(u_new + randVal, 0.0, 1.0);

  fragColor = vec4(u_new, v_new, 0.0, 1.0);
}
</code></pre></div>`,

  init(container, state) {
    // Use chaos preset which has inherent noise sensitivity
    return startGPULoop(container, {
      params: { ...PRESETS['chaos'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
    })
  }
}
