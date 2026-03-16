/**
 * Step 31: WebGL Context and Extension Detection
 */


export default {
  title: 'WebGL Context and Extension Detection',
  chapter: 4,

  math: `<div class="math-section"><h3>WebGL Context</h3>
<p>Three.js creates a WebGLRenderer which internally initializes the GL context.
We detect capabilities using gl.getExtension().</p></div>`,

  code: `<div class="code-section"><h3>Step 31 Code</h3>
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
    div.innerHTML = '<pre style="border:none;background:none">Step 31: WebGL Context and Extension Detection</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
