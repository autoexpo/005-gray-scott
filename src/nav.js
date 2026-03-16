/**
 * Navigation — goto/next/prev, URL hash sync, keyboard listeners.
 */
import { state, TOTAL_STEPS } from './state.js'
import { loadStep } from './steps/index.js'
import { GuiManager } from './gui/GuiManager.js'

let _currentStepModule = null

export async function goto(idx) {
  if (idx < 0 || idx >= TOTAL_STEPS) return

  // Cleanup current
  state.runCleanup()
  GuiManager.destroy()
  clearVizContainer()

  // Scroll cols to top
  document.getElementById('col-math').scrollTop = 0
  document.getElementById('col-code').scrollTop = 0

  const mod = await loadStep(idx)
  _currentStepModule = mod

  // Populate left + middle columns
  renderMath(mod.math)
  renderCode(mod.code)

  // Init viz
  const vizContainer = document.getElementById('viz-container')
  const cleanup = mod.init ? mod.init(vizContainer, state) : null
  state.setStep(idx, cleanup)

  // Update header
  updateHeader(idx, mod.title)

  // Sync hash
  history.replaceState(null, '', `#${idx + 1}`)
}

export function next() {
  goto(state.stepIndex + 1)
}

export function prev() {
  goto(state.stepIndex - 1)
}

function updateHeader(idx, title) {
  document.getElementById('step-indicator').textContent = `${idx + 1} / ${TOTAL_STEPS}`
  document.getElementById('step-title-display').textContent = title || ''
  document.getElementById('progress-fill').style.width = `${((idx + 1) / TOTAL_STEPS) * 100}%`
  document.getElementById('btn-prev').disabled = idx === 0
  document.getElementById('btn-next').disabled = idx === TOTAL_STEPS - 1
}

function renderMath(math) {
  const el = document.getElementById('math-content')
  el.innerHTML = math || ''
  // KaTeX auto-render if loaded
  if (window.renderMathInElement) {
    window.renderMathInElement(el, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ]
    })
  }
}

function renderCode(codeBlocks) {
  const el = document.getElementById('code-content')
  if (!codeBlocks) { el.innerHTML = ''; return }
  el.innerHTML = typeof codeBlocks === 'string' ? codeBlocks : ''
  // Highlight code blocks
  el.querySelectorAll('pre code').forEach(block => {
    if (window.hljs) window.hljs.highlightElement(block)
  })
}

function clearVizContainer() {
  const c = document.getElementById('viz-container')
  // Remove all children except persistent stats
  while (c.firstChild) c.removeChild(c.firstChild)
}

export function initNav() {
  document.getElementById('btn-next').addEventListener('click', next)
  document.getElementById('btn-prev').addEventListener('click', prev)

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
    if (e.key === 'ArrowRight') next()
    if (e.key === 'ArrowLeft') prev()
    if (e.key === ' ') {
      e.preventDefault()
      state.params.paused = !state.params.paused
    }
  })

  // Hash-based deep linking
  const hash = parseInt(window.location.hash.replace('#', ''))
  const startStep = (isFinite(hash) && hash >= 1 && hash <= TOTAL_STEPS)
    ? hash - 1
    : (parseInt(localStorage.getItem('gs-step') || '0') || 0)

  goto(startStep)

  // Persist progress
  state.addEventListener('stepchange', e => {
    localStorage.setItem('gs-step', String(e.detail.index))
  })
}
