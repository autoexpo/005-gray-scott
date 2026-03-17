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
    div.id = 'text-panel'
    div.style.cssText = 'padding:20px; font-family:SF Mono,monospace; font-size:10pt; line-height:1.6; overflow-y:auto; height:100%'

    div.innerHTML = `
      <h3>WebGL Context Setup</h3>

      <h4>Context Creation</h4>
      <pre><code>const canvas = document.createElement('canvas')
const gl = canvas.getContext('webgl2')
if (!gl) {
  console.error('WebGL2 not supported')
  return
}</code></pre>

      <h4>Extension Detection</h4>
      <pre><code>// Essential extensions for compute-style rendering
const extensions = {
  floatTextures: gl.getExtension('EXT_color_buffer_float'),
  textureFilter: gl.getExtension('OES_texture_float_linear'),
  textureHalf: gl.getExtension('EXT_color_buffer_half_float')
}

console.table(extensions)</code></pre>

      <h4>Capability Table</h4>
      <table style="border-collapse:collapse; margin:10px 0; font-size:9pt">
        <tr style="border-bottom:1px solid #ccc">
          <th style="text-align:left; padding:4px">Extension</th>
          <th style="text-align:left; padding:4px">Purpose</th>
        </tr>
        <tr><td style="padding:4px">EXT_color_buffer_float</td><td style="padding:4px">Render to RGBA32F textures</td></tr>
        <tr><td style="padding:4px">OES_texture_float_linear</td><td style="padding:4px">Linear filtering on float textures</td></tr>
        <tr><td style="padding:4px">EXT_color_buffer_half_float</td><td style="padding:4px">16-bit float precision</td></tr>
      </table>

      <p><strong>Gray-Scott Requirements:</strong><br>
      • Float textures for U,V concentration storage<br>
      • Ping-pong rendering between two framebuffers<br>
      • Fragment shader access to neighbor pixels</p>
    `

    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
