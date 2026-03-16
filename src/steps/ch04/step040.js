/**
 * Step 40: Float Precision: Packing u and v into RGBA
 */


export default {
  title: 'Float Precision: Packing u and v into RGBA',
  chapter: 4,

  math: `<div class="math-section"><h3>Float Encoding</h3>
<p>We store u in the R channel and v in the G channel of an RGBA float texture.
B and A are unused. This is efficient — no packing or unpacking needed.</p></div>`,

  code: `<div class="code-section"><h3>Step 40 Code</h3>
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
    div.innerHTML = '<pre style="border:none;background:none">Step 40: Float Precision: Packing u and v into RGBA</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
