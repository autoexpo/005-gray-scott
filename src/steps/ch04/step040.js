/**
 * Step 40: Float Precision: Packing u and v into RGBA
 */

export default {
  title: 'Float Precision: Packing u and v into RGBA',
  chapter: 4,

  math: `<div class="math-section"><h3>Float Encoding</h3>
<p>We store u in the R channel and v in the G channel of an RGBA float texture.
B and A are unused. This is efficient — no packing or unpacking needed.</p></div>`,

  code: `<div class="code-section"><h3>Step 40 Code</h3>
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
      <h3>Float Precision and Channel Packing</h3>

      <h4>Precision Comparison</h4>
      <table style="border-collapse:collapse; margin:10px 0; font-size:9pt; width:100%">
        <tr style="border-bottom:1px solid #ccc; background:#f5f5f5">
          <th style="text-align:left; padding:6px">Format</th>
          <th style="text-align:left; padding:6px">Bits/Channel</th>
          <th style="text-align:left; padding:6px">Range</th>
          <th style="text-align:left; padding:6px">Precision</th>
          <th style="text-align:left; padding:6px">Memory/Pixel</th>
        </tr>
        <tr><td style="padding:6px">UNSIGNED_BYTE</td><td style="padding:6px">8</td><td style="padding:6px">[0, 255]</td><td style="padding:6px">Integer</td><td style="padding:6px">4 bytes</td></tr>
        <tr><td style="padding:6px">HALF_FLOAT</td><td style="padding:6px">16</td><td style="padding:6px">±65504</td><td style="padding:6px">11-bit mantissa</td><td style="padding:6px">8 bytes</td></tr>
        <tr><td style="padding:6px">FLOAT</td><td style="padding:6px">32</td><td style="padding:6px">±3.4×10³⁸</td><td style="padding:6px">23-bit mantissa</td><td style="padding:6px">16 bytes</td></tr>
      </table>

      <h4>Channel Packing Strategy</h4>
      <pre style="background:#f8f8f8; padding:12px; border-radius:4px; font-size:9pt">
        RGBA32F Texture Layout (per pixel):
        ┌─────────┬─────────┬─────────┬─────────┐
        │    R    │    G    │    B    │    A    │
        │ 32-bit  │ 32-bit  │ 32-bit  │ 32-bit  │
        │ float   │ float   │ float   │ float   │
        ├─────────┼─────────┼─────────┼─────────┤
        │  U      │  V      │ unused  │ unused  │
        │ conc.   │ conc.   │   0.0   │   1.0   │
        └─────────┴─────────┴─────────┴─────────┘
      </pre>

      <h4>GLSL Access Patterns</h4>
      <pre><code style="background:#f8f8f8; padding:12px; border-radius:4px; display:block">
// Reading current state
vec4 pixel = texture(u_state, v_uv);
float u = pixel.r;  // U concentration from Red channel
float v = pixel.g;  // V concentration from Green channel
// pixel.b and pixel.a are ignored

// Writing new state
fragColor = vec4(u_new, v_new, 0.0, 1.0);
//               ↑      ↑       ↑    ↑
//               U      V    unused unused
</code></pre>

      <h4>Memory Analysis</h4>
      <p><strong>512×512 RGBA32F texture:</strong><br>
      • Total pixels: 262,144<br>
      • Bytes per pixel: 16 (4 × 32-bit floats)<br>
      • Total memory: 4.0 MB<br>
      • Effective usage: 50% (only RG channels used)</p>

      <h4>Alternative: RG32F Format</h4>
      <pre><code>// More memory-efficient: only 2 channels
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, W, H, 0, gl.RG, gl.FLOAT, null)
// Memory usage: 2.0 MB (50% savings)</code></pre>

      <p><em>For production code, RG32F is preferred. RGBA32F shown here for educational clarity.</em></p>
    `

    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
