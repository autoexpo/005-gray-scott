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
    div.id = 'text-panel'
    div.style.cssText = 'padding:20px; font-family:SF Mono,monospace; font-size:10pt; line-height:1.6; overflow-y:auto; height:100%'

    div.innerHTML = `
      <h3>Float Texture Formats</h3>

      <h4>Format Comparison Table</h4>
      <table style="border-collapse:collapse; margin:10px 0; font-size:9pt; width:100%">
        <tr style="border-bottom:1px solid #ccc; background:#f5f5f5">
          <th style="text-align:left; padding:6px">Format</th>
          <th style="text-align:left; padding:6px">Internal</th>
          <th style="text-align:left; padding:6px">Data Type</th>
          <th style="text-align:left; padding:6px">Range</th>
          <th style="text-align:left; padding:6px">Use Case</th>
        </tr>
        <tr><td style="padding:6px">RGBA8</td><td style="padding:6px">gl.RGBA</td><td style="padding:6px">UNSIGNED_BYTE</td><td style="padding:6px">[0, 255]</td><td style="padding:6px">Display only</td></tr>
        <tr><td style="padding:6px">RG16F</td><td style="padding:6px">gl.RG16F</td><td style="padding:6px">HALF_FLOAT</td><td style="padding:6px">±65504</td><td style="padding:6px">Compact storage</td></tr>
        <tr><td style="padding:6px">RGBA32F</td><td style="padding:6px">gl.RGBA32F</td><td style="padding:6px">FLOAT</td><td style="padding:6px">±3.4×10³⁸</td><td style="padding:6px">Precision compute</td></tr>
      </table>

      <h4>WebGL2 Float Texture Creation</h4>
      <pre><code>// Gray-Scott stores U,V in RG channels of a single texture
const texture = gl.createTexture()
gl.bindTexture(gl.TEXTURE_2D, texture)

gl.texImage2D(
  gl.TEXTURE_2D,
  0,                    // Mip level
  gl.RG32F,            // Internal format: 32-bit float, 2 channels
  width, height,
  0,                    // Border (must be 0)
  gl.RG,               // Input format: Red + Green
  gl.FLOAT,            // Input data type
  null                 // No initial data (empty texture)
)

// Texture parameters
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)</code></pre>

      <h4>Channel Packing Strategy</h4>
      <p><strong>U concentration → Red channel</strong><br>
      <strong>V concentration → Green channel</strong><br>
      <strong>Blue, Alpha → unused (saves memory vs RGBA32F)</strong></p>

      <p><em>Result: Each pixel stores (U,V) as (R,G) float pair. 512×512 grid = 262K pixels = 2MB texture memory.</em></p>
    `

    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
