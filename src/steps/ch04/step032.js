/**
 * Step 32: Framebuffer Objects (FBOs)
 */

export default {
  title: 'Framebuffer Objects (FBOs)',
  chapter: 4,

  math: `<div class="math-section"><h3>Framebuffer Objects</h3>
<p>An FBO is a render target — instead of drawing to the screen, we draw into a texture.
That texture can then be read as input on the next pass.</p></div>`,

  code: `<div class="code-section"><h3>Step 32 Code</h3>
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
      <h3>Framebuffer Objects (FBOs)</h3>

      <h4>Concept: Render-to-Texture</h4>
      <pre style="font-size:8pt; line-height:1.2">
        CPU Memory        GPU Framebuffer       GPU Texture
        ┌─────────┐       ┌─────────────┐      ┌─────────────┐
        │ u[512²] │  -->  │   Render    │ -->  │ RGBA32F     │
        │ v[512²] │       │   Target    │      │ 512x512     │
        └─────────┘       └─────────────┘      └─────────────┘
                                |                     |
                                v                     |
                          ┌─────────────┐            |
                          │    Draw     │ <----------┘
                          │    Call     │   (read as input)
                          └─────────────┘
      </pre>

      <h4>FBO Creation Code</h4>
      <pre><code>// Create texture for render target
const texture = gl.createTexture()
gl.bindTexture(gl.TEXTURE_2D, texture)
gl.texImage2D(
  gl.TEXTURE_2D, 0, gl.RGBA32F,  // Internal format: 32-bit float
  width, height, 0,
  gl.RGBA, gl.FLOAT,             // Input format
  null                           // No initial data
)

// Create framebuffer
const fbo = gl.createFramebuffer()
gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
gl.framebufferTexture2D(
  gl.FRAMEBUFFER,
  gl.COLOR_ATTACHMENT0,          // Attachment point
  gl.TEXTURE_2D, texture, 0      // Mip level 0
)

// Verify completeness
if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
  console.error('FBO incomplete')
}</code></pre>

      <h4>Render Cycle</h4>
      <p><strong>1. Bind FBO:</strong> Redirect rendering to texture<br>
      <strong>2. Draw:</strong> Fragment shader outputs to texture<br>
      <strong>3. Unbind:</strong> Use texture as input for next pass<br>
      <strong>4. Repeat:</strong> Ping-pong between two FBOs</p>

      <p><em>This is how Gray-Scott updates U,V fields on GPU: each pass reads previous state and writes new state.</em></p>
    `

    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
