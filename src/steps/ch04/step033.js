/**
 * Step 33: Creating Float Textures (WebGL1/2)
 */


export default {
  title: 'Creating Float Textures (WebGL1/2)',
  chapter: 4,

  math: `<div class="math-section"><h3>Float Textures</h3>
<p>By default, WebGL textures store 8-bit integers per channel. For simulation accuracy
we need 32-bit floats. This requires OES_texture_float (WebGL1) or is built-in (WebGL2).</p></div>`,

  code: `<div class="code-section"><h3>Step 33 Code</h3>
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
    div.innerHTML = '<pre style="border:none;background:none">Step 33: Creating Float Textures (WebGL1/2)</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
