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
    div.id = 'text-panel'
    div.style.cssText = 'padding:20px; font-family:SF Mono,monospace; font-size:10pt; line-height:1.6; overflow-y:auto; height:100%'

    div.innerHTML = `
      <h3>Pass-Through Vertex Shader</h3>

      <h4>Complete GLSL Source</h4>
      <pre><code style="background:#f8f8f8; padding:12px; border-radius:4px; display:block; overflow-x:auto">
#version 300 es

// Input vertex position in NDC [-1,1]²
in vec2 a_position;

// Output UV coordinates [0,1]² for fragment shader
out vec2 v_uv;

void main() {
  // Pass position directly to gl_Position (no transformation)
  gl_Position = vec4(a_position, 0.0, 1.0);

  // Convert NDC [-1,1] to UV [0,1] for texture sampling
  // NDC -1 → UV 0,  NDC +1 → UV 1
  v_uv = (a_position + 1.0) * 0.5;
}
      </code></pre>

      <h4>Line-by-Line Breakdown</h4>
      <table style="border-collapse:collapse; margin:10px 0; font-size:9pt; width:100%">
        <tr style="border-bottom:1px solid #ccc; background:#f5f5f5">
          <th style="text-align:left; padding:6px">Line</th>
          <th style="text-align:left; padding:6px">Purpose</th>
        </tr>
        <tr><td style="padding:6px"><code>in vec2 a_position</code></td><td style="padding:6px">Vertex buffer input: NDC coordinates</td></tr>
        <tr><td style="padding:6px"><code>out vec2 v_uv</code></td><td style="padding:6px">Output to fragment shader: texture UVs</td></tr>
        <tr><td style="padding:6px"><code>gl_Position = ...</code></td><td style="padding:6px">Required output: clip-space position</td></tr>
        <tr><td style="padding:6px"><code>v_uv = (a_position + 1.0) * 0.5</code></td><td style="padding:6px">NDC→UV conversion formula</td></tr>
      </table>

      <h4>Coordinate Conversion</h4>
      <p><strong>Input:</strong> NDC space [-1,+1] (OpenGL standard)<br>
      <strong>Output:</strong> UV space [0,1] (texture coordinates)</p>

      <pre style="font-size:9pt; line-height:1.2">
        NDC     →    UV
        ─────────────────
        (-1,-1) →  (0,0)    bottom-left
        (+1,-1) →  (1,0)    bottom-right
        (+1,+1) →  (1,1)    top-right
        (-1,+1) →  (0,1)    top-left
      </pre>

      <p><em>This shader runs once per vertex. For our 6-vertex full-screen quad, it executes 6 times total.</em></p>
    `

    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
