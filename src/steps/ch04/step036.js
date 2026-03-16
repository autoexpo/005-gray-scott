/**
 * Step 36: The Vertex Shader: Pass-Through
 */


export default {
  title: 'The Vertex Shader: Pass-Through',
  chapter: 4,

  math: `<div class="math-section"><h3>Pass-Through Vertex Shader</h3>
<p>The vertex shader for a full-screen quad just passes position through unchanged
and computes UV coordinates for the fragment shader to sample from.</p></div>`,

  code: `<div class="code-section"><h3>Step 36 Code</h3>
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
    div.innerHTML = '<pre style="border:none;background:none">Step 36: The Vertex Shader: Pass-Through</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
