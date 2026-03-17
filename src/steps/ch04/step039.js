/**
 * Step 39: Full Gray-Scott Update in GLSL
 */

export default {
  title: 'Full Gray-Scott Update in GLSL',
  chapter: 4,

  math: `<div class="math-section"><h3>Full Gray-Scott GLSL</h3>
<p>The fragment shader combines the Laplacian computation with the reaction-diffusion
equations and Euler integration, writing the new (u,v) to gl_FragColor.</p></div>`,

  code: `<div class="code-section"><h3>Step 39 Code</h3>
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
      <h3>Complete Gray-Scott Fragment Shader</h3>

      <h4>Full GLSL Implementation</h4>
      <pre><code style="background:#f8f8f8; padding:12px; border-radius:4px; display:block; overflow-x:auto; font-size:9pt; line-height:1.3">
#version 300 es
precision highp float;

// Uniforms
uniform sampler2D u_state;     // Current (U,V) state
uniform float u_texelSize;     // 1.0 / resolution
uniform float u_Du;            // U diffusion rate (0.2097)
uniform float u_Dv;            // V diffusion rate (0.105)
uniform float u_f;             // Feed rate (0.037)
uniform float u_k;             // Kill rate (0.06)
uniform float u_dt;            // Time step (1.0)

in vec2 v_uv;                  // UV from vertex shader
out vec4 fragColor;            // Output: new (U,V,0,1)

// Compute 5-point discrete Laplacian
vec2 laplacian(vec2 uv) {
  vec2 offsetX = vec2(u_texelSize, 0.0);
  vec2 offsetY = vec2(0.0, u_texelSize);

  vec2 center = texture(u_state, uv).rg;
  vec2 left   = texture(u_state, uv - offsetX).rg;
  vec2 right  = texture(u_state, uv + offsetX).rg;
  vec2 down   = texture(u_state, uv - offsetY).rg;
  vec2 up     = texture(u_state, uv + offsetY).rg;

  return left + right + down + up - 4.0 * center;
}

void main() {
  // Current state at this fragment
  vec2 state = texture(u_state, v_uv).rg;
  float u = state.r;
  float v = state.g;

  // Laplacian terms
  vec2 lap = laplacian(v_uv);
  float lapU = lap.r;
  float lapV = lap.g;

  // Reaction term
  float uvv = u * v * v;

  // Gray-Scott equations
  float dudt = u_Du * lapU - uvv + u_f * (1.0 - u);
  float dvdt = u_Dv * lapV + uvv - (u_f + u_k) * v;

  // Forward Euler step
  float u_new = clamp(u + u_dt * dudt, 0.0, 1.0);
  float v_new = clamp(v + u_dt * dvdt, 0.0, 1.0);

  // Output new state
  fragColor = vec4(u_new, v_new, 0.0, 1.0);
}
      </code></pre>

      <h4>Term Breakdown</h4>
      <table style="border-collapse:collapse; margin:10px 0; font-size:9pt; width:100%">
        <tr style="border-bottom:1px solid #ccc; background:#f5f5f5">
          <th style="text-align:left; padding:6px">GLSL Variable</th>
          <th style="text-align:left; padding:6px">Mathematical Term</th>
          <th style="text-align:left; padding:6px">Physical Meaning</th>
        </tr>
        <tr><td style="padding:6px"><code>u_Du * lapU</code></td><td style="padding:6px">D<sub>u</sub>∇²u</td><td style="padding:6px">U diffusion</td></tr>
        <tr><td style="padding:6px"><code>u_Dv * lapV</code></td><td style="padding:6px">D<sub>v</sub>∇²v</td><td style="padding:6px">V diffusion</td></tr>
        <tr><td style="padding:6px"><code>uvv</code></td><td style="padding:6px">uv²</td><td style="padding:6px">Autocatalysis</td></tr>
        <tr><td style="padding:6px"><code>u_f * (1.0 - u)</code></td><td style="padding:6px">f(1-u)</td><td style="padding:6px">U replenishment</td></tr>
        <tr><td style="padding:6px"><code>(u_f + u_k) * v</code></td><td style="padding:6px">(f+k)v</td><td style="padding:6px">V removal</td></tr>
        <tr><td style="padding:6px"><code>clamp(..., 0.0, 1.0)</code></td><td style="padding:6px">max(0,min(1,·))</td><td style="padding:6px">Concentration bounds</td></tr>
      </table>

      <p><em>This single fragment shader replaces ~200 lines of CPU nested loops. Each GPU core executes one texel in parallel.</em></p>
    `

    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
