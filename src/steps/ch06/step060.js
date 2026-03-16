/**
 * Step 60: Inverted Grayscale — White Background
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Inverted Grayscale — White Background',
  chapter: 6,

  math: `<div class="math-section">
<h3>Color Inversion</h3>
<p>Inversion flips the color mapping:</p>
<p>$$c = 1.0 - u$$</p>
<p>This creates a white background with dark patterns, matching scientific paper conventions.</p>

<h4>Complementary Interpretation</h4>
<p>In inverted rendering:</p>
<p>• **White areas** = high food concentration (u ≈ 1)</p>
<p>• **Dark areas** = high activator concentration (v ≈ 1, u ≈ 0)</p>
<p>This interpretation aligns with biological intuition: nutrients are the background, organisms are the pattern.</p>

<h4>Perceptual Advantages</h4>
<p>Dark-on-white rendering offers several benefits:</p>
<p>1. **Print compatibility**: matches paper/ink aesthetics</p>
<p>2. **Eye strain**: white backgrounds reduce fatigue in bright environments</p>
<p>3. **Scientific convention**: most pattern formation papers use this format</p>
<p>4. **Contrast perception**: dark features pop against bright backgrounds</p>
</div>`,

  code: `<div class="code-section">
<h3>VizShader Invert Branch</h3>
<pre><code class="language-glsl">// From VizShader.js fragment shader, mode 1:
else if (uMode == 1) {
  // invert: white background, dark pattern
  c = 1.0 - u;
}</code></pre>

<h4>Adding Mode Toggle in GUI</h4>
<pre><code class="language-js">// In gpuLoop.js, the GUI automatically includes mode selection:
const vizFolder = gui.addFolder('Visualization')
const vizCtrl = { mode: currentVizMode }
vizFolder.add(vizCtrl, 'mode', ['bw','grayscale','invert','dual','contour','edge'])
  .name('mode').onChange(v => { currentVizMode = v })</code></pre>

<h4>VizShader Mode Mapping</h4>
<pre><code class="language-js">// From VizShader.js setMode() method:
setMode(mode) {
  const modes = { grayscale: 0, invert: 1, dual: 2, contour: 3, edge: 4, bw: 5 }
  this.material.uniforms.uMode.value = modes[mode] ?? 0
}</code></pre>
</div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS.spots },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
      showGui: true
    })
  }
}