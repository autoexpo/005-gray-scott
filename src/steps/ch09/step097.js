/**
 * Step 97: Vite Production Build: Asset Hashing
 */


export default {
  title: 'Vite Production Build: Asset Hashing',
  chapter: 9,

  math: `<div class="math-section"><h3>Vite Production Build</h3>
<p>vite build produces: index.html + hashed JS bundle + hashed CSS.
Asset hashing ensures CDN caches are invalidated on updates.
Total bundle: ~150KB gzipped (Three.js dominates).</p></div>`,

  code: `<div class="code-section"><h3>Step 97 Code</h3>
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
      VITE PRODUCTION BUILD
    </div>
    <div style="border-bottom:2px solid #333; margin-bottom:15px;"></div>

    <div style="margin-left:15px; margin-bottom:15px; font-family:monospace; background:#f8f8f8; padding:10px;">
      $ vite build<br><br>

      vite v5.x building for production...<br>
      ✓ 100 modules transformed.<br><br>

      dist/<br>
      ├── index.html<br>
      ├── assets/<br>
      │&nbsp;&nbsp;&nbsp;├── index-[hash8].js&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← bundle<br>
      │&nbsp;&nbsp;&nbsp;├── index-[hash8].css&nbsp;&nbsp;&nbsp;&nbsp;← styles<br>
      │&nbsp;&nbsp;&nbsp;└── vendor-[hash8].js&nbsp;&nbsp;&nbsp;&nbsp;← node_modules<br>
      └── step*.js (code-split by step)
    </div>

    <div style="margin-bottom:10px;">
      <strong>Content-based hashing:</strong>
    </div>
    <div style="border-bottom:1px solid #666; margin-bottom:10px;"></div>

    <div style="margin-left:15px; margin-bottom:15px;">
      File content → SHA → first 8 chars → filename<br>
      <span style="font-family:monospace;">index-a3f2b1c9.js</span>
    </div>

    <div style="margin-bottom:10px;">
      <strong>Benefits:</strong>
    </div>
    <div style="border-bottom:1px solid #666; margin-bottom:10px;"></div>

    <div style="margin-left:15px; margin-bottom:15px;">
      ✓ CDN cache forever (hash changes only if<br>
      &nbsp;&nbsp;content changes)<br>
      ✓ Rollup tree-shaking → dead code removed<br>
      ✓ Code splitting → load only current step
    </div>

    <div style="margin-bottom:10px;">
      <strong>vite.config.js:</strong>
    </div>
    <div style="border-bottom:1px solid #666; margin-bottom:10px;"></div>

    <div style="margin-left:15px; font-family:monospace; background:#f8f8f8; padding:10px;">
      export default defineConfig({<br>
      &nbsp;&nbsp;build: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;target: 'es2020',<br>
      &nbsp;&nbsp;&nbsp;&nbsp;rollupOptions: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;output: { manualChunks: ... }<br>
      &nbsp;&nbsp;&nbsp;&nbsp;}<br>
      &nbsp;&nbsp;}<br>
      })
    </div>
  </div>
    `
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
