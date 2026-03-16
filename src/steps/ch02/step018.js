/**
 * Step 18: Periodic vs Fixed Boundary Conditions in 1D
 */


export default {
  title: 'Periodic vs Fixed Boundary Conditions in 1D',
  chapter: 2,

  math: `<div class="math-section"><h3>Boundary Conditions</h3>
<p><strong>Periodic:</strong> cell 0 neighbours cell N-1. Domain acts as a torus. No edge effects.</p>
<p><strong>Dirichlet:</strong> u=1, v=0 at boundaries (absorbing). Waves reflect differently.</p>
<p><strong>Neumann:</strong> zero flux at boundaries. ∂u/∂n = 0 → reflective walls.</p></div>`,

  code: `<div class="code-section"><h3>Step 18 Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`,

  init(container, state) {
    const div = document.createElement('div')
    div.style.cssText = 'padding:20px; font-family:SF Mono,monospace; font-size:10pt; overflow-y:auto; height:100%'
    div.innerHTML = '<pre style="border:none;background:none">Step 18: Periodic vs Fixed Boundary Conditions in 1D</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
