/**
 * Step 25: Rendering 2D Output to Canvas ImageData
 */


export default {
  title: 'Rendering 2D Output to Canvas ImageData',
  chapter: 3,

  math: `<div class="math-section"><h3>ImageData Rendering</h3>
<p>CanvasRenderingContext2D.createImageData() creates a pixel buffer.
Each pixel is RGBA (4 bytes). We map u[i] → grayscale byte and write all four channels.</p></div>`,

  code: `<div class="code-section"><h3>Step 25 Code</h3>
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
    div.innerHTML = '<pre style="border:none;background:none">Step 25: Rendering 2D Output to Canvas ImageData</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
