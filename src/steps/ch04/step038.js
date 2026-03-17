/**
 * Step 38: 5-Point Laplacian in GLSL
 */

export default {
  title: '5-Point Laplacian in GLSL',
  chapter: 4,

  math: `<div class="math-section"><h3>GLSL 5-Point Laplacian</h3>
<p>The 5 texture lookups (center + 4 cardinal neighbours) are all done in a single
fragment shader invocation. Texture caches make these fast.</p></div>`,

  code: `<div class="code-section"><h3>Step 38 Code</h3>
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
      <h3>5-Point Laplacian GLSL Implementation</h3>

      <h4>Complete Fragment Shader Function</h4>
      <pre><code style="background:#f8f8f8; padding:12px; border-radius:4px; display:block; overflow-x:auto">
uniform sampler2D u_state;     // Current U,V state (RG texture)
uniform float u_texelSize;     // 1.0 / textureSize
in vec2 v_uv;                  // UV coordinates from vertex shader

// Compute discrete Laplacian: ∇²f ≈ (neighbors_sum - 4*center)
vec2 laplacian(vec2 uv) {
  // UV offsets for 4 cardinal neighbors
  vec2 offsetX = vec2(u_texelSize, 0.0);
  vec2 offsetY = vec2(0.0, u_texelSize);

  // Sample all 5 points
  vec2 center = texture(u_state, uv).rg;           // Current cell
  vec2 left   = texture(u_state, uv - offsetX).rg; // West neighbor
  vec2 right  = texture(u_state, uv + offsetX).rg; // East neighbor
  vec2 down   = texture(u_state, uv - offsetY).rg; // South neighbor
  vec2 up     = texture(u_state, uv + offsetY).rg; // North neighbor

  // 5-point stencil: [0, 1, 0]
  //                  [1,-4, 1]  × 1/h²
  //                  [0, 1, 0]
  return left + right + down + up - 4.0 * center;
}
      </code></pre>

      <h4>Stencil Weight Breakdown</h4>
      <table style="border-collapse:collapse; margin:10px 0; font-size:9pt; width:100%">
        <tr style="border-bottom:1px solid #ccc; background:#f5f5f5">
          <th style="text-align:left; padding:6px">Position</th>
          <th style="text-align:left; padding:6px">Weight</th>
          <th style="text-align:left; padding:6px">GLSL Variable</th>
        </tr>
        <tr><td style="padding:6px">Center (i,j)</td><td style="padding:6px">-4</td><td style="padding:6px"><code>center</code></td></tr>
        <tr><td style="padding:6px">West (i-1,j)</td><td style="padding:6px">+1</td><td style="padding:6px"><code>left</code></td></tr>
        <tr><td style="padding:6px">East (i+1,j)</td><td style="padding:6px">+1</td><td style="padding:6px"><code>right</code></td></tr>
        <tr><td style="padding:6px">South (i,j-1)</td><td style="padding:6px">+1</td><td style="padding:6px"><code>down</code></td></tr>
        <tr><td style="padding:6px">North (i,j+1)</td><td style="padding:6px">+1</td><td style="padding:6px"><code>up</code></td></tr>
      </table>

      <h4>Key Optimizations</h4>
      <p><strong>Vector Operations:</strong> Both U and V Laplacians computed together using <code>vec2</code><br>
      <strong>Texture Repeat:</strong> Wrapping mode handles periodic boundaries automatically<br>
      <strong>Cache Efficiency:</strong> GPU texture cache accelerates neighbor lookups<br>
      <strong>Parallel Execution:</strong> All fragments compute simultaneously</p>

      <p><em>This single function replaces the double-nested CPU loop — 512² fragments execute in parallel on GPU.</em></p>
    `

    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
