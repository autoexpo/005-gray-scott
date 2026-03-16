/**
 * Shared GPU simulation loop utility.
 * Creates a Three.js renderer, GPUSim, Stats, and animation loop
 * for a given container. Returns a cleanup function.
 */
import * as THREE from 'three'
import Stats from 'stats.js'
import { GPUSim } from '../gpu/GPUSim.js'
import { GuiManager } from '../gui/GuiManager.js'
import { createSimControls } from './simControls.js'

/**
 * @param {HTMLElement} container
 * @param {object} options
 * @param {object} options.params - initial sim params
 * @param {number} [options.size=256] - grid size
 * @param {string} [options.stencil='5pt'] - '5pt' or '9pt'
 * @param {string} [options.vizMode='grayscale'] - visualization mode
 * @param {number} [options.stepsPerFrame=8]
 * @param {boolean} [options.showGui=true]
 * @param {boolean} [options.mouse=true] - enable mouse seeding
 * @param {function} [options.onGui] - callback(gui, sim, params) to add GUI controls
 * @param {function} [options.onFrame] - callback(sim, frame) per frame
 * @returns {function} cleanup
 */
export function startGPULoop(container, options = {}) {
  const {
    params = {},
    size = 256,
    stencil = '5pt',
    vizMode = 'bw',
    stepsPerFrame = 8,
    showGui = true,
    mouse = true,
    onGui = null,
    onFrame = null,
  } = options

  // Centered 512×512 square wrapper
  const S = 512
  const wrap = document.createElement('div')
  wrap.id = 'sim-canvas'
  wrap.style.cssText = `width:${S}px; height:${S}px; margin:auto; margin-top:20px; position:relative; flex-shrink:0`
  container.appendChild(wrap)

  // Three.js renderer sized to the square
  const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true })
  renderer.setPixelRatio(1)
  renderer.setSize(S, S)
  renderer.domElement.id = 'three-canvas'
  wrap.appendChild(renderer.domElement)

  // GPU sim
  const sim = new GPUSim(renderer, size, stencil)
  const simParams = { ...params }
  sim.reset(simParams)

  // Mouse seeding
  if (mouse) sim.seed.attachTo(renderer.domElement)

  // Stats — hidden by default
  const stats = new Stats()
  stats.showPanel(0)
  stats.dom.style.cssText = 'position:absolute;top:4px;left:4px;display:none;'
  wrap.appendChild(stats.dom)

  // GUI — built but hidden by default
  let gui = null
  let currentVizMode = vizMode
  let currentStepsPerFrame = stepsPerFrame

  if (showGui) {
    gui = GuiManager.create(wrap)
    gui.domElement.style.display = 'none'

    const simFolder = gui.addFolder('Simulation')
    simFolder.add(simParams, 'f', 0.01, 0.12, 0.001).name('f (feed)').onChange(v => { simParams.f = v })
    simFolder.add(simParams, 'k', 0.04, 0.07, 0.001).name('k (kill)').onChange(v => { simParams.k = v })
    simFolder.add(simParams, 'Du', 0.05, 0.5, 0.001).name('Du').onChange(v => { simParams.Du = v })
    simFolder.add(simParams, 'Dv', 0.01, 0.3, 0.001).name('Dv').onChange(v => { simParams.Dv = v })
    simFolder.add(simParams, 'dt', 0.1, 2.0, 0.05).name('dt')

    const vizFolder = gui.addFolder('Visualization')
    const vizCtrl = { mode: currentVizMode }
    vizFolder.add(vizCtrl, 'mode', ['bw','grayscale','invert','dual','contour','edge'])
      .name('mode').onChange(v => { currentVizMode = v })

    const ctrlFolder = gui.addFolder('Control')
    ctrlFolder.add({ stepsPerFrame: currentStepsPerFrame }, 'stepsPerFrame', 1, 32, 1).name('steps/frame')
      .onChange(v => { currentStepsPerFrame = v })

    simFolder.open()
    vizFolder.open()
    ctrlFolder.open()

    if (onGui) onGui(gui, sim, simParams)
  }

  // Controls bar: Pause, Replay, + Stats and Parameters toggles
  let paused = false
  const extraButtons = [
    {
      label: 'Stats',
      onToggle: (active) => {
        stats.dom.style.display = active ? 'block' : 'none'
      },
    },
  ]
  if (showGui && gui) {
    extraButtons.push({
      label: 'Parameters',
      onToggle: (active) => {
        gui.domElement.style.display = active ? 'block' : 'none'
      },
    })
  }

  const controls = createSimControls(container, {
    onPause: (p) => { paused = p },
    onReplay: () => { sim.reset(simParams) },
    extraButtons,
  })

  // Animation loop
  let frameId = null
  let frame = 0
  const animate = () => {
    frameId = requestAnimationFrame(animate)
    stats.begin()

    if (!paused) {
      sim.step(simParams, currentStepsPerFrame)
    }
    sim.render(currentVizMode)
    if (onFrame) onFrame(sim, frame)
    frame++

    stats.end()
  }
  animate()

  return function cleanup() {
    cancelAnimationFrame(frameId)
    controls.remove()
    if (gui) gui.destroy()
    sim.dispose()
    renderer.dispose()
    container.innerHTML = ''
  }
}
