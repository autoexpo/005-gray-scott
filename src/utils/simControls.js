/**
 * Standardised pause / replay controls for all simulations.
 *
 * Usage:
 *   const controls = createSimControls(container, {
 *     onPause:  (paused) => { ... },   // called when pause toggled
 *     onReplay: (reset)  => { ... },   // called when replay clicked
 *   })
 *   // later:
 *   controls.remove()
 *
 * The bar is appended directly to `container` below the simulation.
 */
export function createSimControls(container, { onPause, onReplay } = {}) {
  const bar = document.createElement('div')
  bar.className = 'sim-controls'

  const pauseBtn = document.createElement('button')
  pauseBtn.className = 'sim-btn sim-btn-pause'
  pauseBtn.textContent = '⏸ Pause'
  pauseBtn.setAttribute('aria-pressed', 'false')

  const replayBtn = document.createElement('button')
  replayBtn.className = 'sim-btn sim-btn-replay'
  replayBtn.textContent = '↺ Replay'

  bar.appendChild(pauseBtn)
  bar.appendChild(replayBtn)
  container.appendChild(bar)

  let paused = false

  pauseBtn.addEventListener('click', () => {
    paused = !paused
    pauseBtn.textContent = paused ? '▶ Resume' : '⏸ Pause'
    pauseBtn.setAttribute('aria-pressed', String(paused))
    if (onPause) onPause(paused)
  })

  replayBtn.addEventListener('click', () => {
    // Reset pause state when replaying
    if (paused) {
      paused = false
      pauseBtn.textContent = '⏸ Pause'
      pauseBtn.setAttribute('aria-pressed', 'false')
      if (onPause) onPause(false)
    }
    if (onReplay) onReplay()
  })

  return {
    remove() { bar.remove() },
    isPaused() { return paused },
  }
}
