/**
 * Gray-Scott Reaction Diffusion — Interactive Course
 * Entry point: load KaTeX, hljs, then init navigation.
 */
import { initNav } from './nav.js'

// Load KaTeX from CDN for math rendering
function loadKaTeX() {
  return new Promise(resolve => {
    if (window.renderMathInElement) { resolve(); return }
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js'
    script.onload = () => {
      const autoRender = document.createElement('script')
      autoRender.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js'
      autoRender.onload = resolve
      document.head.appendChild(autoRender)
    }
    document.head.appendChild(script)
  })
}

// Load highlight.js for code syntax highlighting
function loadHljs() {
  return new Promise(resolve => {
    if (window.hljs) { resolve(); return }
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/build/highlight.min.js'
    script.onload = resolve
    document.head.appendChild(script)

    const style = document.createElement('link')
    style.rel = 'stylesheet'
    style.href = 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css'
    document.head.appendChild(style)
  })
}

async function main() {
  // Load external libs in parallel
  await Promise.all([loadKaTeX(), loadHljs()])

  // Init navigation and load first step
  initNav()
}

main().catch(err => {
  console.error('Failed to initialize course:', err)
  document.body.innerHTML = `<pre style="padding:20px;font-family:monospace;color:red">
Error: ${err.message}
Check browser console for details.
  </pre>`
})
