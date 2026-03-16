/**
 * Standardised pause / replay controls for all simulations.
 *
 * Usage:
 *   const controls = createSimControls(container, {
 *     onPause:  (paused) => { ... },
 *     onReplay: () => { ... },
 *     extraButtons: [
 *       { label: 'Stats', onToggle: (active) => { ... } },
 *     ],
 *   })
 *   controls.remove()
 *
 * The bar is appended directly to `container` below the simulation.
 */
export function createSimControls(container, { onPause, onReplay, extraButtons = [] } = {}) {
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

  // Extra toggle buttons (e.g. Stats, Parameters)
  for (const { label, onToggle } of extraButtons) {
    const btn = document.createElement('button')
    btn.className = 'sim-btn sim-btn-toggle'
    btn.textContent = label
    btn.setAttribute('aria-pressed', 'false')
    btn.addEventListener('click', () => {
      const active = btn.getAttribute('aria-pressed') === 'true'
      btn.setAttribute('aria-pressed', String(!active))
      if (onToggle) onToggle(!active)
    })
    bar.appendChild(btn)
  }

  container.appendChild(bar)

  let paused = false

  pauseBtn.addEventListener('click', () => {
    paused = !paused
    pauseBtn.textContent = paused ? '▶ Resume' : '⏸ Pause'
    pauseBtn.setAttribute('aria-pressed', String(paused))
    if (onPause) onPause(paused)
  })

  replayBtn.addEventListener('click', () => {
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
