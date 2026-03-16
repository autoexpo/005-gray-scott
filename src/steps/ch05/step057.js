/**
 * Step 57: Mouse Interaction: Drawing V
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Mouse Interaction: Drawing V',
  chapter: 5,

  math: `<div class="math-section"><h3>Mouse-Based Seeding</h3>
<p>Drawing V into the simulation by clicking/dragging injects activator locally.
Existing patterns are perturbed; new patterns nucleate from the drawn region.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">// Mouse seeding: SeedShader paints V=1 at mouse position
// Implemented as a third GPU pass (after sim and viz):

// On mousemove: convert canvas coords to UV [0,1]
const uv = { x: event.clientX / canvas.width, y: 1 - event.clientY / canvas.height }

// SeedShader renders a Gaussian spot into the simulation FBO:
// float dist = length(vUv - seedPos);
// float v_seed = exp(-dist*dist / (2.0 * radius * radius));
// gl_FragColor = vec4(0.0, v_seed, 0.0, 1.0);  // inject V

// The reaction processes the seed on the next sim step automatically
// No restart required — Gray-Scott handles new seeds continuously
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['spots'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
    })
  }
}
