/**
 * Step 8: Phase space overview — the (f,k) parameter map.
 * Shows a pre-computed grid of pattern thumbnails.
 */
import { makeCanvas2D } from '../../utils/canvas2d.js'

export default {
  title: 'Phase Space: the (f,k) Map',
  chapter: 1,

  math: `
<div class="math-section">
  <h3>The Parameter Phase Diagram</h3>
  <p>The (f,k) parameter space is the primary "control surface" of the Gray-Scott model.
  Different regions produce qualitatively distinct pattern types.</p>
</div>

<div class="math-section">
  <h3>Major Pattern Regions</h3>
  <table style="border-collapse:collapse; margin-top:8px; font-size:9pt">
    <tr style="border-bottom:1px solid #000">
      <th style="padding:3px 8px; text-align:left">Region (f,k)</th>
      <th style="padding:3px 8px; text-align:left">Pattern</th>
    </tr>
    <tr><td style="padding:2px 8px">0.010–0.040, 0.044–0.058</td><td style="padding:2px 8px">Mitosis / self-replication</td></tr>
    <tr><td style="padding:2px 8px">0.030–0.060, 0.055–0.066</td><td style="padding:2px 8px">Spots / coral</td></tr>
    <tr><td style="padding:2px 8px">0.055–0.080, 0.060–0.065</td><td style="padding:2px 8px">Stripes / labyrinths</td></tr>
    <tr><td style="padding:2px 8px">0.070–0.100, 0.055–0.062</td><td style="padding:2px 8px">Worms / bubbles</td></tr>
    <tr><td style="padding:2px 8px">f > 0.10 or k < 0.04</td><td style="padding:2px 8px">No pattern (trivial)</td></tr>
  </table>
</div>

<div class="math-section">
  <h3>Pattern Classification (Pearson 1993)</h3>
  <p>John Pearson's seminal 1993 paper mapped the entire (f,k) space,
  labeling regions by letter (A–H, η, θ, ι, κ, λ, μ):</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li><strong>A</strong>: blue (trivial, V→0)</li>
    <li><strong>B</strong>: red (V fills everything)</li>
    <li><strong>C</strong>: stripes/labyrinths</li>
    <li><strong>D</strong>: spots to stripes transition</li>
    <li><strong>E</strong>: moving spots</li>
    <li><strong>F,G,H</strong>: complex transient dynamics</li>
  </ul>
</div>

<div class="math-section">
  <h3>Exploring the Phase Space</h3>
  <p>In Step 56 we'll build an interactive (f,k) map showing live mini-simulations.
  For now, the visualization shows named presets plotted on the (f,k) plane.</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>Named Presets from the Phase Map</h3>
  <div class="filename">src/presets/parameters.js</div>
<pre><code class="language-js">export const PRESETS = {
  spots:   { f: 0.035, k: 0.065, label: 'Spots' },
  stripes: { f: 0.060, k: 0.062, label: 'Stripes' },
  worms:   { f: 0.078, k: 0.061, label: 'Worms' },
  mitosis: { f: 0.028, k: 0.053, label: 'Mitosis' },
  bubbles: { f: 0.098, k: 0.057, label: 'Bubbles' },
  coral:   { f: 0.059, k: 0.062, label: 'Coral' },
  solitons:{ f: 0.030, k: 0.057, label: 'Solitons' },
  chaos:   { f: 0.026, k: 0.051, label: 'Chaos' },
  // All use Du=0.2097, Dv=0.105
}
</code></pre>
</div>

<div class="code-section">
  <h3>Loading a Preset</h3>
<pre><code class="language-js">function loadPreset(name) {
  const preset = PRESETS[name]
  if (!preset) return

  // Update simulation parameters
  Object.assign(currentParams, preset)

  // Reset simulation with new params
  // (patterns take 1000-5000 steps to form)
  sim.reset(currentParams)

  // Update GUI to reflect new values
  gui.controllers.forEach(c => c.updateDisplay())
}
</code></pre>
</div>
`,

  init(container) {
    const { canvas, disconnect } = makeCanvas2D(container, false)
    const ctx = canvas.getContext('2d')

    const presets = [
      { f: 0.035, k: 0.065, label: 'Spots' },
      { f: 0.060, k: 0.062, label: 'Stripes' },
      { f: 0.078, k: 0.061, label: 'Worms' },
      { f: 0.028, k: 0.053, label: 'Mitosis' },
      { f: 0.098, k: 0.057, label: 'Bubbles' },
      { f: 0.059, k: 0.062, label: 'Coral' },
      { f: 0.030, k: 0.057, label: 'Solitons' },
      { f: 0.026, k: 0.051, label: 'Chaos' },
    ]

    function draw() {
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, W, H)

      const padL = 50, padB = 30, padT = 20, padR = 20
      const pw = W - padL - padR
      const ph = H - padB - padT

      // f range: 0.01 to 0.12, k range: 0.04 to 0.075
      const fMin = 0.01, fMax = 0.12
      const kMin = 0.04, kMax = 0.075

      const fx = f => padL + ((f - fMin) / (fMax - fMin)) * pw
      const ky = k => padT + ph - ((k - kMin) / (kMax - kMin)) * ph

      // Background regions (approximate)
      const regions = [
        { f1:0.01,f2:0.05, k1:0.044,k2:0.060, label:'mitosis', gray:0.92 },
        { f1:0.03,f2:0.07, k1:0.056,k2:0.068, label:'spots/coral', gray:0.80 },
        { f1:0.055,f2:0.09,k1:0.059,k2:0.065, label:'stripes', gray:0.70 },
        { f1:0.07,f2:0.11, k1:0.054,k2:0.062, label:'worms/bubbles', gray:0.85 },
      ]
      regions.forEach(r => {
        const x1 = fx(r.f1), x2 = fx(r.f2)
        const y1 = ky(r.k2), y2 = ky(r.k1)
        const g = Math.round(r.gray * 255)
        ctx.fillStyle = `rgb(${g},${g},${g})`
        ctx.fillRect(x1, y1, x2-x1, y2-y1)
        ctx.fillStyle = '#666'
        ctx.font = '8pt monospace'
        ctx.fillText(r.label, x1+2, y1+11)
      })

      // Axes
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(padL, padT); ctx.lineTo(padL, padT+ph)
      ctx.lineTo(padL+pw, padT+ph)
      ctx.stroke()

      // Axis labels
      ctx.fillStyle = '#000'
      ctx.font = '9pt SF Mono, monospace'
      ctx.fillText('f (feed rate) →', padL + pw/2 - 30, H - 4)
      ctx.save(); ctx.translate(12, padT + ph/2 + 20)
      ctx.rotate(-Math.PI/2); ctx.fillText('k (kill rate) →', 0, 0)
      ctx.restore()

      // Tick marks
      ctx.font = '7pt monospace'
      ctx.fillStyle = '#555'
      for (let f = 0.02; f <= 0.11; f += 0.02) {
        const x = fx(f)
        ctx.beginPath()
        ctx.moveTo(x, padT+ph); ctx.lineTo(x, padT+ph+4)
        ctx.stroke()
        ctx.fillText(f.toFixed(2), x-8, padT+ph+12)
      }
      for (let k = 0.045; k <= 0.07; k += 0.01) {
        const y = ky(k)
        ctx.beginPath()
        ctx.moveTo(padL, y); ctx.lineTo(padL-4, y)
        ctx.stroke()
        ctx.fillText(k.toFixed(3), 0, y+3)
      }

      // Plot preset points
      presets.forEach(p => {
        const x = fx(p.f)
        const y = ky(p.k)
        ctx.fillStyle = '#000'
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI*2)
        ctx.fill()
        ctx.fillStyle = '#000'
        ctx.font = '8pt monospace'
        ctx.fillText(p.label, x+6, y+3)
      })
    }

    draw()
    window.addEventListener('resize', draw)

    return () => {
      window.removeEventListener('resize', draw)
      disconnect()
      container.innerHTML = ''
    }
  }
}
