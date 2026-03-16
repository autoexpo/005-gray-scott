/**
 * Step 70: Capturing Frames: PNG Export
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Capturing Frames: PNG Export',
  chapter: 6,

  math: `<div class="math-section"><h3>PNG Export</h3>
<p>canvas.toDataURL('image/png') captures the current frame.
For the WebGL canvas, this requires preserveDrawingBuffer: true.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">// PNG export requires preserveDrawingBuffer: true
const renderer = new THREE.WebGLRenderer({
  preserveDrawingBuffer: true  // prevents canvas clear after each frame
  // WARNING: disables double-buffering → slight performance cost (~5-10%)
  // Only enable when export is needed
})

// Export current frame:
function exportPNG() {
  const url = renderer.domElement.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = 'gray-scott-frame.png'
  a.click()
}

// Without preserveDrawingBuffer: toDataURL() returns blank (buffer already swapped)
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['spots'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
      onGui: (gui, sim, params) => {
        gui.add({ export: () => {
          const url = sim.renderer.domElement.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = url
          a.download = 'gray-scott.png'
          a.click()
        } }, 'export').name('Export PNG')
      }
    })
  }
}
