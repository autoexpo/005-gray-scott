/**
 * Step 22: Implementing 5-Point Stencil (Periodic BC)
 */


export default {
  title: 'Implementing 5-Point Stencil (Periodic BC)',
  chapter: 3,

  math: `<div class="math-section"><h3>5-Point Stencil (Periodic)</h3>
<p>With periodic BCs, no special treatment at boundaries is needed.
The grid wraps in both x and y directions — it is topologically a torus.</p></div>`,

  code: `<div class="code-section"><h3>Step 22 Code</h3>
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
    div.id = 'text-panel'
    div.style.cssText = 'padding:20px; font-family:SF Mono,monospace; font-size:10pt; overflow-y:auto; height:100%'
    div.innerHTML = '<pre style="border:none;background:none">Step 22: Implementing 5-Point Stencil (Periodic BC)</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
