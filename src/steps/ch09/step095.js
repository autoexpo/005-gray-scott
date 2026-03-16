/**
 * Step 95: URL Hash Navigation: Deep Linking
 */


export default {
  title: 'URL Hash Navigation: Deep Linking',
  chapter: 9,

  math: `<div class="math-section"><h3>URL Hash Navigation</h3>
<p>window.location.hash = '#42' sets the URL without a page reload.
On load, parse the hash to restore the user's last-visited step.
Share a URL to send someone directly to any step.</p></div>`,

  code: `<div class="code-section"><h3>Step 95 Code</h3>
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
    div.innerHTML = '<pre style="border:none;background:none">Step 95: URL Hash Navigation: Deep Linking</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
