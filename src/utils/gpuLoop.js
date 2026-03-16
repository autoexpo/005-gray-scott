/**
 * Shared GPU simulation loop utility.
 * Creates a Three.js renderer, GPUSim, Stats, and animation loop
 * for a given container. Returns a cleanup function.
 */
import * as THREE from 'three'
import Stats from 'stats.js'
import { GPUSim } from '../gpu/GPUSim.js'
import { GuiManager } from '../gui/GuiManager.js'

/**
 * @param {HTMLElement} container
 * @param {object} options
 * @param {object} options.params - initial sim params
 * @param {number} [options.size=256] - grid size
 * @param {string} [options.stencil='5pt'] - '5pt' or '9pt'
 * @param {string} [options.vizMode='grayscale'] - visualization mode
 * @param {number} [options.stepsPerFrame=8]
 * @param {boolean} [options.showGui=true]
 * @param {boolean} [options.showStats=true]
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
    vizMode = 'invert',
    stepsPerFrame = 8,
    showGui = true,
    showStats = true,
    mouse = true,
    onGui = null,
    onFrame = null,
  } = options

  // Three.js renderer
  const renderer = new THREE.WebGLRenderer({ antialias: false })
  renderer.setPixelRatio(1) // pixel-perfect for sim
  renderer.setSize(container.clientWidth, container.clientHeight)
  container.appendChild(renderer.domElement)

  // Resize observer
  const ro = new ResizeObserver(() => {
    renderer.setSize(container.clientWidth, container.clientHeight)
  })
  ro.observe(container)

  // GPU sim
  const sim = new GPUSim(renderer, size, stencil)
  const simParams = { ...params }
  sim.reset(simParams)

  // Mouse seeding
  if (mouse) sim.seed.attachTo(renderer.domElement)

  // Stats
  let stats = null
  if (showStats) {
    stats = new Stats()
    stats.showPanel(0) // FPS
    stats.dom.style.cssText = 'position:absolute;top:4px;left:4px;'
    container.appendChild(stats.dom)
    container.style.position = 'relative'
  }

  // GUI
  let currentVizMode = vizMode
  let currentStepsPerFrame = stepsPerFrame
  let paused = false

  if (showGui) {
    const gui = GuiManager.create(container)

    const simFolder = gui.addFolder('Simulation')
    simFolder.add(simParams, 'f', 0.01, 0.12, 0.001).name('f (feed)').onChange(v => { simParams.f = v })
    simFolder.add(simParams, 'k', 0.04, 0.07, 0.001).name('k (kill)').onChange(v => { simParams.k = v })
    simFolder.add(simParams, 'Du', 0.05, 0.5, 0.001).name('Du').onChange(v => { simParams.Du = v })
    simFolder.add(simParams, 'Dv', 0.01, 0.3, 0.001).name('Dv').onChange(v => { simParams.Dv = v })
    simFolder.add(simParams, 'dt', 0.1, 2.0, 0.05).name('dt')

    const vizFolder = gui.addFolder('Visualization')
    const vizCtrl = { mode: currentVizMode }
    vizFolder.add(vizCtrl, 'mode', ['grayscale','invert','dual','contour','edge'])
      .name('mode').onChange(v => { currentVizMode = v })

    const ctrlFolder = gui.addFolder('Control')
    const ctrlObj = { stepsPerFrame: currentStepsPerFrame, paused }
    ctrlFolder.add(ctrlObj, 'stepsPerFrame', 1, 32, 1).name('steps/frame')
      .onChange(v => { currentStepsPerFrame = v })
    ctrlFolder.add(ctrlObj, 'paused').name('pause').onChange(v => { paused = v })
    ctrlFolder.add({ reset: () => sim.reset(simParams) }, 'reset').name('reset')

    simFolder.open()
    vizFolder.open()
    ctrlFolder.open()

    if (onGui) onGui(gui, sim, simParams)
  }

  // Animation loop
  let frameId = null
  let frame = 0
  const animate = () => {
    frameId = requestAnimationFrame(animate)
    if (stats) stats.begin()

    if (!paused) {
      sim.step(simParams, currentStepsPerFrame)
    }
    sim.render(currentVizMode)
    if (onFrame) onFrame(sim, frame)
    frame++

    if (stats) stats.end()
  }
  animate()

  return function cleanup() {
    cancelAnimationFrame(frameId)
    ro.disconnect()
    sim.dispose()
    renderer.dispose()
    container.innerHTML = ''
  }
}
