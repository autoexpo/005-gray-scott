/**
 * Step 98: Cloudflare Pages Deployment
 */


export default {
  title: 'Cloudflare Pages Deployment',
  chapter: 9,

  math: `<div class="math-section"><h3>Cloudflare Pages Deployment</h3>
<p>Push to main branch → GitHub Actions runs npm run build → wrangler pages deploy dist.
Cloudflare CDN serves from edge locations globally. Zero cold-start time (static files).
Custom domain via CNAME record in Cloudflare DNS.</p></div>`,

  code: `<div class="code-section"><h3>Step 98 Code</h3>
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
    div.style.cssText = 'padding:24px 28px; font-family:SF Mono,Menlo,monospace; font-size:9pt; line-height:1.7; overflow-y:auto; height:100%; color:#111; background:#fff'
    div.innerHTML = `
  <div style="font-family:SF Mono,Menlo,monospace; font-size:9pt; line-height:1.7;">
    <div style="text-align:center; font-weight:bold; margin-bottom:20px;">
      CLOUDFLARE PAGES DEPLOYMENT
    </div>
    <div style="border-bottom:2px solid #333; margin-bottom:15px;"></div>

    <div style="margin-bottom:10px;">
      <strong>Direct upload (this project):</strong>
    </div>
    <div style="border-bottom:1px solid #666; margin-bottom:10px;"></div>

    <div style="margin-left:15px; margin-bottom:15px; font-family:monospace; background:#f8f8f8; padding:10px;">
      $ vite build<br>
      $ wrangler pages deploy dist \\<br>
      &nbsp;&nbsp;&nbsp;&nbsp;--project-name gray-scott<br><br>

      ✓ Uploaded 47 files<br>
      ✓ Deployment complete!<br>
      ✓ https://gray-scott.pages.dev
    </div>

    <div style="margin-bottom:10px;">
      <strong>What CF Pages provides:</strong>
    </div>
    <div style="border-bottom:1px solid #666; margin-bottom:10px;"></div>

    <div style="margin-left:15px; margin-bottom:15px;">
      ✓ Global CDN (300+ PoPs)<br>
      ✓ Free SSL certificate<br>
      ✓ HTTP/2 + Brotli compression<br>
      ✓ Unlimited bandwidth (free tier)<br>
      ✓ Preview deployments per upload<br>
      ✓ Custom domains
    </div>

    <div style="margin-bottom:10px;">
      <strong>Cache headers (set by Pages):</strong>
    </div>
    <div style="border-bottom:1px solid #666; margin-bottom:10px;"></div>

    <div style="margin-left:15px; margin-bottom:15px; font-family:monospace;">
      /assets/*.js   → Cache-Control: max-age=31536000<br>
      /index.html    → Cache-Control: no-cache<br>
      /step*.js      → Cache-Control: max-age=31536000
    </div>

    <div>
      Hashed filenames → safe to cache forever.<br>
      index.html always fresh → picks up new hashes.
    </div>
  </div>
    `
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
