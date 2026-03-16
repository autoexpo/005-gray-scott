/**
 * Step 96: Progress Persistence: localStorage
 */


export default {
  title: 'Progress Persistence: localStorage',
  chapter: 9,

  math: `<div class="math-section"><h3>localStorage Persistence</h3>
<p>localStorage.setItem('gs-step', index) persists progress across sessions.
Read on startup to resume where the user left off.
~5KB budget for step index + UI state.</p></div>`,

  code: `<div class="code-section"><h3>Step 96 Code</h3>
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
      PROGRESS PERSISTENCE: localStorage
    </div>
    <div style="border-bottom:2px solid #333; margin-bottom:15px;"></div>

    <div style="margin-bottom:10px;">
      <strong>localStorage is a key-value store:</strong>
    </div>
    <div style="border-bottom:1px solid #666; margin-bottom:10px;"></div>

    <div style="margin-left:15px; margin-bottom:15px; font-family:monospace;">
      setItem(key, value)   → persist string<br>
      getItem(key)          → retrieve or null<br>
      removeItem(key)       → delete<br>
      clear()               → reset all
    </div>

    <div style="margin-bottom:10px;">
      <strong>Schema used:</strong>
    </div>
    <div style="border-bottom:1px solid #666; margin-bottom:10px;"></div>

    <div style="margin-left:15px; margin-bottom:15px; font-family:monospace;">
      key: 'gray-scott-progress'<br>
      value: JSON.stringify({<br>
      &nbsp;&nbsp;completed: [1,2,3,5,7,...],  // step numbers<br>
      &nbsp;&nbsp;lastVisited: 42,<br>
      &nbsp;&nbsp;savedAt: '2025-03-15T10:22:00Z'<br>
      })
    </div>

    <div style="margin-bottom:10px;">
      <strong>Usage:</strong>
    </div>
    <div style="border-bottom:1px solid #666; margin-bottom:10px;"></div>

    <div style="margin-left:15px; margin-bottom:15px; font-family:monospace;">
      // Mark step complete:<br>
      const prog = loadProgress()<br>
      if (!prog.completed.includes(n)) {<br>
      &nbsp;&nbsp;prog.completed.push(n)<br>
      &nbsp;&nbsp;saveProgress(prog)<br>
      }<br><br>

      // Show completion badge in nav:<br>
      const pct = prog.completed.length / 100 * 100<br>
      navBar.style.setProperty('--progress', pct + '%')
    </div>

    <div style="margin-bottom:10px;">
      <strong>Limits:</strong>
    </div>
    <div style="border-bottom:1px solid #666; margin-bottom:10px;"></div>

    <div style="margin-left:15px;">
      5MB per origin. ~100 step IDs = ~0.5KB.<br>
      Private browsing: may be blocked.
    </div>
  </div>
    `
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
