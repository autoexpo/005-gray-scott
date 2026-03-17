/**
 * Step 85: 3D Extension Concept: Volumetric RD
 */

export default {
  title: '3D Extension Concept: Volumetric RD',
  chapter: 8,

  math: `<div class="math-section"><h3>3D Reaction-Diffusion</h3>
<p>Extend to 3D: store U(x,y,z) in a 3D texture. The Laplacian has 6 cardinal neighbours.
Patterns in 3D include: tubes, sheets, spherical shells, and gyroid-like structures.</p></div>`,

  code: `<div class="code-section"><h3>3D GLSL Implementation</h3>
<pre><code class="language-js">// 3D Gray-Scott fragment shader (conceptual)
uniform sampler3D u_state3D;  // 3D texture storing U,V

vec3 laplacian3D(vec3 uvw) {
  float h = 1.0 / float(textureSize(u_state3D, 0).x);

  // 6 cardinal neighbors in 3D
  vec2 center = texture(u_state3D, uvw).rg;
  vec2 xp = texture(u_state3D, uvw + vec3(h,0,0)).rg;
  vec2 xm = texture(u_state3D, uvw - vec3(h,0,0)).rg;
  vec2 yp = texture(u_state3D, uvw + vec3(0,h,0)).rg;
  vec2 ym = texture(u_state3D, uvw - vec3(0,h,0)).rg;
  vec2 zp = texture(u_state3D, uvw + vec3(0,0,h)).rg;
  vec2 zm = texture(u_state3D, uvw - vec3(0,0,h)).rg;

  // 3D Laplacian: 6 neighbors - 6*center
  return (xp + xm + yp + ym + zp + zm - 6.0*center);
}
</code></pre></div>`,

  init(container, state) {
    const div = document.createElement('div')
    div.id = 'text-panel'
    div.style.cssText = 'padding:20px; font-family:SF Mono,monospace; font-size:10pt; line-height:1.6; overflow-y:auto; height:100%'

    div.innerHTML = `
      <h3>3D Volumetric Reaction-Diffusion</h3>

      <h4>3D Pattern Types</h4>
      <pre style="font-size:9pt; line-height:1.2; color:#666">
        Tubes:     ●────●────●      (1D manifolds in 3D)

        Sheets:    ████████████      (2D manifolds in 3D)

        Gyroid:    ∿∿∿∿∿∿∿∿∿∿∿∿      (minimal surface)

        Spheres:      ●   ●          (0D manifolds in 3D)
      </pre>

      <h4>3D Laplacian Stencil</h4>
      <pre style="font-size:9pt; line-height:1.3">
        6-point stencil in 3D:

               ●   (0,0,+1)
               |
        ●──────●──────●    (±1,0,0)
               |
               ●   (0,0,-1)

        Plus:  ●   (0,±1,0)
      </pre>

      <h4>Memory Requirements</h4>
      <table style="border-collapse:collapse; margin:10px 0; font-size:9pt">
        <tr style="border-bottom:1px solid #ccc">
          <th style="text-align:left; padding:4px">Resolution</th>
          <th style="text-align:left; padding:4px">Voxels</th>
          <th style="text-align:left; padding:4px">Memory (RG32F)</th>
        </tr>
        <tr><td style="padding:4px">64³</td><td style="padding:4px">262K</td><td style="padding:4px">2.0 MB</td></tr>
        <tr><td style="padding:4px">128³</td><td style="padding:4px">2.1M</td><td style="padding:4px">16.8 MB</td></tr>
        <tr><td style="padding:4px">256³</td><td style="padding:4px">16.8M</td><td style="padding:4px">134 MB</td></tr>
      </table>

      <h4>Implementation Challenges</h4>
      <p><strong>• GPU Memory:</strong> 256³ × RGBA32F = 1GB+ texture memory<br>
      <strong>• Visualization:</strong> Volume rendering or cross-sections needed<br>
      <strong>• Boundary Conditions:</strong> Periodic in all 3 axes<br>
      <strong>• Performance:</strong> 6 texture lookups per fragment vs 4 in 2D</p>

      <p><em>3D reaction-diffusion creates rich morphologies but requires significant computational resources and specialized rendering techniques.</em></p>
    `

    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
