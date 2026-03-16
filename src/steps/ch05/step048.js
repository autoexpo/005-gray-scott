/**
 * Step 48: Preset System — Named Configurations
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Preset System — Named Configurations',
  chapter: 5,

  math: `
<div class="math-section">
  <h3>Bifurcation Theory — Each Preset Occupies a Different Region</h3>
  <p>Each preset corresponds to a different region in the (f,k) phase diagram. The Gray-Scott
  system exhibits multiple distinct pattern types, each stable in its own parameter region.
  Moving between presets is like moving between different phases of matter.</p>
</div>

<div class="math-section">
  <h3>The 10 Named Regions</h3>
  <p>Based on Pearson (1993) and Munafo's parameter map, we identify these distinct regions:</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li><strong>spots:</strong> Isolated circular spots (f=0.035, k=0.065)</li>
    <li><strong>stripes:</strong> Labyrinthine stripe patterns (f=0.060, k=0.062)</li>
    <li><strong>worms:</strong> Connected worm-like structures (f=0.078, k=0.061)</li>
    <li><strong>mitosis:</strong> Self-replicating spots (f=0.028, k=0.053)</li>
    <li><strong>bubbles:</strong> Growing bubble domains (f=0.098, k=0.057)</li>
    <li><strong>coral:</strong> Dendritic branching patterns (f=0.059, k=0.062)</li>
    <li><strong>solitons:</strong> Traveling wave pulses (f=0.030, k=0.057)</li>
    <li><strong>chaos:</strong> Turbulent dynamics (f=0.026, k=0.051)</li>
    <li><strong>negSpots:</strong> Inverted spot patterns (f=0.039, k=0.058)</li>
    <li><strong>waves:</strong> Outward-propagating spirals (f=0.014, k=0.045)</li>
  </ul>
</div>

<div class="math-section">
  <h3>The Munafo Parameter Map</h3>
  <p>Robert Munafo's systematic exploration of Gray-Scott parameter space revealed
  the rich structure of pattern types. His parameter map divides the (f,k) plane
  into named regions, each characterized by distinctive pattern morphology.</p>
</div>

<div class="math-section">
  <h3>Why Small (f,k) Changes Cause Qualitative Pattern Changes</h3>
  <p>The Gray-Scott system sits at the intersection of multiple instabilities.
  Each instability has its own preferred length scale and growth rate. Small
  parameter changes can shift the balance between competing instabilities,
  causing abrupt transitions between pattern types.</p>
</div>

<div class="math-section">
  <h3>The Pearson Parameter Map</h3>
  <p>John Pearson's 1993 paper established the foundation for understanding
  Gray-Scott patterns. He identified the key parameter regions and connected
  them to Turing's original 1952 theory of biological pattern formation.</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>Complete PRESETS Object from parameters.js</h3>
<pre><code class="language-js">export const PRESETS = {
  spots: {
    label: 'Spots',
    f: 0.035, k: 0.065,
    Du: 0.2097, Dv: 0.105,
    dt: 1.0,
    description: 'Isolated spots (coral-like). Classic Turing pattern.',
  },
  stripes: {
    label: 'Stripes / Labyrinths',
    f: 0.060, k: 0.062,
    Du: 0.2097, Dv: 0.105,
    dt: 1.0,
    description: 'Labyrinthine stripe patterns. Animal coat markings.',
  },
  worms: {
    label: 'Worms',
    f: 0.078, k: 0.061,
    Du: 0.2097, Dv: 0.105,
    dt: 1.0,
    description: 'Worm-like structures filling the space.',
  },
  mitosis: {
    label: 'Mitosis',
    f: 0.028, k: 0.053,
    Du: 0.2097, Dv: 0.105,
    dt: 1.0,
    description: 'Self-replicating spots that divide like cells.',
  },
  // ... (bubbles, coral, solitons, chaos, negSpots, waves)
}

export const PRESET_NAMES = Object.keys(PRESETS)
</code></pre>
</div>

<div class="code-section">
  <h3>getPreset() Function</h3>
<pre><code class="language-js">export function getPreset(name) {
  return PRESETS[name] || PRESETS.spots
}

// Usage example:
const params = getPreset('stripes')
console.log(params.f, params.k)  // 0.060, 0.062

// Safe fallback — if name doesn't exist, returns spots preset
const params2 = getPreset('nonexistent')  // returns PRESETS.spots
</code></pre>
</div>

<div class="code-section">
  <h3>Adding Preset Selector to lil-gui</h3>
<pre><code class="language-js">// In the onGui callback — add preset dropdown
function setupPresetSelector(gui, sim, simParams) {
  const simFolder = gui.folders.find(f => f._title === 'Simulation')

  const presetCtrl = { preset: 'spots' }

  simFolder.add(presetCtrl, 'preset', PRESET_NAMES)
    .name('preset')
    .onChange(presetName => {
      // Load the selected preset
      const preset = getPreset(presetName)

      // Copy all parameters
      Object.assign(simParams, preset)

      // Update all GUI displays to reflect new values
      gui.controllersRecursive().forEach(controller => {
        if (controller.object === simParams) {
          controller.updateDisplay()
        }
      })

      // Reset simulation to clean slate for new pattern
      sim.reset(simParams)
    })
}
</code></pre>
</div>
`,

  init(container) {
    return startGPULoop(container, {
      params: { ...PRESETS.spots },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'bw',
      showGui: true,
      onGui(gui, sim, simParams) {
        // Add preset selector dropdown
        const simFolder = gui.folders.find(f => f._title === 'Simulation')

        if (simFolder) {
          const presetCtrl = { preset: 'spots' }

          simFolder.add(presetCtrl, 'preset', Object.keys(PRESETS))
            .name('preset')
            .onChange(presetName => {
              // Load the selected preset
              const preset = PRESETS[presetName]

              // Copy all parameters
              Object.assign(simParams, preset)

              // Reset simulation for clean pattern development
              sim.reset(simParams)
            })
        }
      }
    })
  }
}
