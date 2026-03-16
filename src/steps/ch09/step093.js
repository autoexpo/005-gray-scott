/**
 * Step 93: Web Worker CPU Fallback
 */


export default {
  title: 'Web Worker CPU Fallback',
  chapter: 9,

  math: `<div class="math-section"><h3>Web Workers</h3>
<p>Web Workers run JavaScript in a separate thread, keeping the main thread free
for UI. The CPU simulation runs in a Worker; results are transfered via SharedArrayBuffer.</p></div>`,

  code: `<div class="code-section"><h3>Step 93 Code</h3>
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
    // worker.js (loaded as a separate module)
    /*
    self.onmessage = ({ data }) => {
      if (data.cmd === 'init') {
        // allocate and seed
        u = new Float32Array(data.W * data.H).fill(1)
        v = new Float32Array(data.W * data.H).fill(0)
        // seed center square...
      }
      if (data.cmd === 'step') {
        for (let s = 0; s < data.steps; s++) step2D(u, v, ...)
        // Transfer (not copy) the buffer back:
        self.postMessage({ u: u.buffer }, [u.buffer])
        // u is now detached — must re-attach next step
      }
    }
    */

    const div = document.createElement('div')
    div.style.cssText = 'padding:24px 28px; font-family:SF Mono,Menlo,monospace; font-size:9pt; line-height:1.7; overflow-y:auto; height:100%; color:#111; background:#fff'
    div.innerHTML = `
  <div style="font-family:SF Mono,Menlo,monospace; font-size:9pt; line-height:1.7;">
    <div style="text-align:center; font-weight:bold; margin-bottom:20px;">
      WEB WORKER CPU FALLBACK
    </div>
    <div style="border-bottom:2px solid #333; margin-bottom:15px;"></div>

    <div style="display:flex; gap:40px;">
      <div style="flex:1;">
        <strong>Main Thread</strong>
        <div style="border-bottom:1px solid #666; margin:5px 0;"></div>
        <div style="font-family:monospace; font-size:8pt;">
          new Worker(url)<br>
          &nbsp;&nbsp;&nbsp;&nbsp;│<br>
          &nbsp;&nbsp;&nbsp;&nbsp;├─ postMessage({<br>
          &nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;cmd:'init',<br>
          &nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;W, H, params<br>
          &nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;})<br>
          &nbsp;&nbsp;&nbsp;&nbsp;│<br>
          &nbsp;&nbsp;&nbsp;&nbsp;├─ postMessage({<br>
          &nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;cmd:'step',<br>
          &nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;steps: 8<br>
          &nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;})<br>
          &nbsp;&nbsp;&nbsp;&nbsp;│<br>
          &nbsp;&nbsp;&nbsp;&nbsp;└─ onmessage = ({data}) → render to canvas
        </div>
      </div>

      <div style="flex:1;">
        <strong>Worker Thread</strong>
        <div style="border-bottom:1px solid #666; margin:5px 0;"></div>
        <div style="font-family:monospace; font-size:8pt;">
          <br>
          ←─ init<br>
          <br>
          ─ allocate Float32Arrays<br>
          ─ seed initial conditions<br>
          <br>
          ←─ step<br>
          <br>
          ─ run 8 Euler steps<br>
          ─ postMessage(u.buffer,[u.buffer])<br>
        </div>
      </div>
    </div>

    <div style="margin:20px 0;">
      <strong>Why Workers?</strong>
    </div>
    <div style="border-bottom:1px solid #666; margin-bottom:10px;"></div>

    <div style="margin-left:15px; margin-bottom:15px;">
      ✓ Sim loop off main thread → no UI jank<br>
      ✓ Transferable ArrayBuffers → zero-copy<br>
      ✓ Fallback for devices without WebGL<br>
      ✗ Higher latency (~1 frame delay)<br>
      ✗ More complex code
    </div>
  </div>
    `
    container.appendChild(div)
    return () => { container.innerHTML = '' }
  }
}
