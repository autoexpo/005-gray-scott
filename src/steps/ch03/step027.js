/**
 * Step 27: The 9-Point Isotropic Laplacian
 */


export default {
  title: 'The 9-Point Isotropic Laplacian',
  chapter: 3,

  math: `<div class="math-section"><h3>9-Point Isotropic Laplacian</h3>
<div class="math-block">$$\\nabla^2 u \\approx \\frac{1}{6}\\sum_{\\text{cardinal}} + \\frac{1}{12}\\sum_{\\text{diagonal}} - \\frac{5}{6}u_{ij}$$</div>
<p>Correction weights make the stencil rotationally symmetric to O(h²), reducing directional bias.</p></div>`,

  code: `<div class="code-section"><h3>Step 27 Code</h3>
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
    div.innerHTML = '<pre style="border:none;background:none">Step 27: The 9-Point Isotropic Laplacian</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
