import{n as e,t}from"./linear-BCfk2I7B.js";import{n,t as r}from"./axis-DtUEpaBV.js";import{o as i}from"./src-51qo7f6l.js";var a={title:`Phase Space: the (f,k) Map`,chapter:1,math:`
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
`,init(a){let o={top:30,right:120,bottom:60,left:60},s=512-o.left-o.right,c=512-o.top-o.bottom,l=i(a).append(`svg`).attr(`id`,`d3-sim`).attr(`width`,512).attr(`height`,512).style(`display`,`block`).style(`margin`,`20px auto 0`).append(`g`).attr(`transform`,`translate(${o.left},${o.top})`),u=t().domain([.01,.12]).range([0,s]),d=t().domain([.04,.075]).range([c,0]);return[{f1:.01,f2:.05,k1:.044,k2:.06,label:`mitosis`,gray:.92},{f1:.03,f2:.07,k1:.056,k2:.068,label:`spots/coral`,gray:.8},{f1:.055,f2:.09,k1:.059,k2:.065,label:`stripes`,gray:.7},{f1:.07,f2:.11,k1:.054,k2:.062,label:`worms/bubbles`,gray:.85}].forEach(e=>{let t=Math.round(e.gray*255);l.append(`rect`).attr(`x`,u(e.f1)).attr(`y`,d(e.k2)).attr(`width`,u(e.f2)-u(e.f1)).attr(`height`,d(e.k1)-d(e.k2)).attr(`fill`,`rgb(${t},${t},${t})`),l.append(`text`).attr(`x`,u(e.f1)+2).attr(`y`,d(e.k2)+11).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`8pt`).attr(`fill`,`#666`).text(e.label)}),l.append(`g`).attr(`transform`,`translate(0,${c})`).call(r(u).tickFormat(e(`.2f`))),l.append(`g`).call(n(d).tickFormat(e(`.3f`))),l.selectAll(`.domain, .tick line`).attr(`stroke`,`#000`),l.selectAll(`.tick text`).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`7pt`).attr(`fill`,`#555`),l.append(`text`).attr(`x`,s/2).attr(`y`,c+50).style(`text-anchor`,`middle`).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).text(`f (feed rate) →`),l.append(`text`).attr(`x`,-40).attr(`y`,c/2).style(`text-anchor`,`middle`).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`9pt`).attr(`transform`,`rotate(-90, -40, ${c/2})`).text(`k (kill rate) →`),[{f:.035,k:.065,label:`Spots`},{f:.06,k:.062,label:`Stripes`},{f:.078,k:.061,label:`Worms`},{f:.028,k:.053,label:`Mitosis`},{f:.098,k:.057,label:`Bubbles`},{f:.059,k:.062,label:`Coral`},{f:.03,k:.057,label:`Solitons`},{f:.026,k:.051,label:`Chaos`}].forEach(e=>{l.append(`circle`).attr(`cx`,u(e.f)).attr(`cy`,d(e.k)).attr(`r`,4).attr(`fill`,`#000`),l.append(`text`).attr(`x`,u(e.f)+6).attr(`y`,d(e.k)+3).style(`font-family`,`SF Mono, Menlo, monospace`).style(`font-size`,`8pt`).attr(`fill`,`#000`).text(e.label)}),()=>{i(a).select(`#d3-sim`).remove()}}};export{a as default};