/**
 * Step 95: URL Hash Navigation: Deep Linking
 */


export default {
  title: 'URL Hash Navigation: Deep Linking',
  chapter: 9,

  math: `<div class="math-section"><h3>URL Hash Navigation</h3>
<p>window.location.hash = '#42' sets the URL without a page reload.
On load, parse the hash to restore the user's last-visited step.
Share a URL to send someone directly to any step.</p></div>`,

  code: `<div class="code-section"><h3>Step 95 Code</h3>
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
      URL HASH NAVIGATION
    </div>
    <div style="border-bottom:2px solid #333; margin-bottom:15px;"></div>

    <div style="margin-bottom:15px;">
      <strong>URL:</strong> https://gray-scott.pages.dev/#42
    </div>

    <div style="margin-left:15px; margin-bottom:15px; font-family:monospace;">
      window.location.hash  →  "#42"<br>
      parseInt(hash.slice(1))  →  42<br>
      router.goto(42)
    </div>

    <div style="margin-bottom:10px;">
      <strong>On load:</strong>
    </div>
    <div style="border-bottom:1px solid #666; margin-bottom:10px;"></div>

    <div style="margin-left:15px; margin-bottom:15px; font-family:monospace;">
      const step = parseInt(location.hash.slice(1)) || 1<br>
      loadStep(step)
    </div>

    <div style="margin-bottom:10px;">
      <strong>On navigation (prev/next buttons):</strong>
    </div>
    <div style="border-bottom:1px solid #666; margin-bottom:10px;"></div>

    <div style="margin-left:15px; margin-bottom:15px; font-family:monospace;">
      function goto(n) {<br>
      &nbsp;&nbsp;history.pushState(null, '', \`#\${n}\`)<br>
      &nbsp;&nbsp;loadStep(n)<br>
      }
    </div>

    <div style="margin-bottom:10px;">
      <strong>On browser back/forward:</strong>
    </div>
    <div style="border-bottom:1px solid #666; margin-bottom:10px;"></div>

    <div style="margin-left:15px; margin-bottom:15px; font-family:monospace;">
      window.addEventListener('popstate', () => {<br>
      &nbsp;&nbsp;const n = parseInt(location.hash.slice(1)) || 1<br>
      &nbsp;&nbsp;loadStep(n)<br>
      })
    </div>

    <div style="margin-bottom:10px;">
      <strong>Benefits:</strong>
    </div>
    <div style="border-bottom:1px solid #666; margin-bottom:10px;"></div>

    <div style="margin-left:15px;">
      ✓ Bookmarkable — share link to any step<br>
      ✓ Browser history works (back/forward)<br>
      ✓ No server-side routing needed<br>
      ✓ Works on static hosts (CF Pages, GitHub Pages)
    </div>
  </div>
    `
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
