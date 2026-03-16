/**
 * Step 88: Pattern Wavelength: Dispersion Relation
 */


export default {
  title: 'Pattern Wavelength: Dispersion Relation',
  chapter: 8,

  math: `<div class="math-section"><h3>Dispersion Relation</h3>
<p>The dispersion relation $\\sigma(q^2)$ is a polynomial whose roots give the growth rates.
The wavenumber $q^*$ that grows fastest determines the pattern wavelength:</p>
<div class="math-block">$$\\lambda^* = \\frac{2\\pi}{q^*}$$</div></div>`,

  code: `<div class="code-section"><h3>Step 88 Code</h3>
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
    div.innerHTML = '<pre style="border:none;background:none">Step 88: Pattern Wavelength: Dispersion Relation</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
