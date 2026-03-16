/**
 * Step 48: Preset System: Named Configurations
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Preset System: Named Configurations',
  chapter: 5,

  math: `<div class="math-section"><h3>Preset Loading</h3>
<p>A preset resets f, k, Du, Dv to known-good values and optionally resets the simulation grid.
Resetting the grid is needed when moving to a very different parameter regime.</p></div>`,

  code: `<div class="code-section">
<pre><code class="language-js">// Preset system: named (f,k,Du,Dv,dt) configurations
import { PRESETS, getPreset } from '../../presets/parameters.js'

function loadPreset(name, sim, params) {
  const p = getPreset(name)
  Object.assign(params, p)  // mutate params in-place
  sim.reset(params)          // restart from clean state
}

// In onGui callback:
const presetCtrl = { name: 'spots' }
gui.add(presetCtrl, 'name', Object.keys(PRESETS))
  .name('preset')
  .onChange(name => loadPreset(name, sim, params))
</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS['spots'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'invert',
      showGui: true,
      onGui: (gui, sim, params) => {
        const presetCtrl = { name: 'spots' };
        gui.add(presetCtrl, 'name', ['spots','stripes','worms','mitosis','bubbles','coral','solitons','chaos'])
          .name('preset')
          .onChange(name => {
            const p = PRESETS[name];
            Object.assign(params, p);
            sim.reset(params)
          })
      }
    })
  }
}
