import{t as e}from"./canvas2d-B696n6ps.js";var t={title:`Phase Space: the (f,k) Map`,chapter:1,math:`
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
`,code:`
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
`,init(t){let{canvas:n,disconnect:r}=e(t,!1),i=n.getContext(`2d`),a=[{f:.035,k:.065,label:`Spots`},{f:.06,k:.062,label:`Stripes`},{f:.078,k:.061,label:`Worms`},{f:.028,k:.053,label:`Mitosis`},{f:.098,k:.057,label:`Bubbles`},{f:.059,k:.062,label:`Coral`},{f:.03,k:.057,label:`Solitons`},{f:.026,k:.051,label:`Chaos`}];function o(){let e=n.width,t=n.height;i.clearRect(0,0,e,t),i.fillStyle=`#fff`,i.fillRect(0,0,e,t);let r=e-50-20,o=t-30-20,s=.01,c=.04,l=e=>50+(e-s)/(.12-s)*r,u=e=>20+o-(e-c)/(.075-c)*o;[{f1:.01,f2:.05,k1:.044,k2:.06,label:`mitosis`,gray:.92},{f1:.03,f2:.07,k1:.056,k2:.068,label:`spots/coral`,gray:.8},{f1:.055,f2:.09,k1:.059,k2:.065,label:`stripes`,gray:.7},{f1:.07,f2:.11,k1:.054,k2:.062,label:`worms/bubbles`,gray:.85}].forEach(e=>{let t=l(e.f1),n=l(e.f2),r=u(e.k2),a=u(e.k1),o=Math.round(e.gray*255);i.fillStyle=`rgb(${o},${o},${o})`,i.fillRect(t,r,n-t,a-r),i.fillStyle=`#666`,i.font=`8pt monospace`,i.fillText(e.label,t+2,r+11)}),i.strokeStyle=`#000`,i.lineWidth=1,i.beginPath(),i.moveTo(50,20),i.lineTo(50,20+o),i.lineTo(50+r,20+o),i.stroke(),i.fillStyle=`#000`,i.font=`9pt SF Mono, monospace`,i.fillText(`f (feed rate) →`,50+r/2-30,t-4),i.save(),i.translate(12,20+o/2+20),i.rotate(-Math.PI/2),i.fillText(`k (kill rate) →`,0,0),i.restore(),i.font=`7pt monospace`,i.fillStyle=`#555`;for(let e=.02;e<=.11;e+=.02){let t=l(e);i.beginPath(),i.moveTo(t,20+o),i.lineTo(t,20+o+4),i.stroke(),i.fillText(e.toFixed(2),t-8,20+o+12)}for(let e=.045;e<=.07;e+=.01){let t=u(e);i.beginPath(),i.moveTo(50,t),i.lineTo(46,t),i.stroke(),i.fillText(e.toFixed(3),0,t+3)}a.forEach(e=>{let t=l(e.f),n=u(e.k);i.fillStyle=`#000`,i.beginPath(),i.arc(t,n,4,0,Math.PI*2),i.fill(),i.fillStyle=`#000`,i.font=`8pt monospace`,i.fillText(e.label,t+6,n+3)})}return requestAnimationFrame(o),window.addEventListener(`resize`,o),()=>{window.removeEventListener(`resize`,o),r(),t.innerHTML=``}}};export{t as default};