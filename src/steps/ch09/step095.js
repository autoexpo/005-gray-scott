/**
 * Step 95: URL Hash Navigation: Deep Linking
 */

import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'URL Hash Navigation: Deep Linking',
  chapter: 9,

  math: `<div class="math-section">
    <h3>URL Hash Navigation Architecture</h3>

    <p><strong>Hash-based routing</strong> enables client-side navigation without server round-trips:</p>

    <ul>
      <li><code>window.location.hash = '#N'</code> — navigates to step N without page reload</li>
      <li><code>window.addEventListener('hashchange', handler)</code> — detects URL changes</li>
      <li><code>history.pushState()</code> vs <code>replaceState()</code> — add vs modify history entries</li>
      <li>Hash routing vs path routing: <code>site.com/#42</code> vs <code>site.com/step/42</code></li>
    </ul>

    <p><strong>Why hash routing for static sites?</strong></p>
    <p>Path routing (<code>/step/42</code>) requires server configuration to serve <code>index.html</code>
    for all routes. With hash routing (<code>/#42</code>), the browser always loads the root page,
    then JavaScript parses the hash client-side. Perfect for Cloudflare Pages deployment.</p>

    <p><strong>URL state mapping:</strong></p>
    <pre>gray-scott.pages.dev/          → step 1 (default)
gray-scott.pages.dev/#42       → step 42
gray-scott.pages.dev/#ch5      → chapter 5 overview
gray-scott.pages.dev/#preset/coral → preset demo</pre>

    <p><strong>Deep linking benefits:</strong></p>
    <ul>
      <li>Bookmarkable URLs for any course step</li>
      <li>Shareable links to specific content</li>
      <li>Browser back/forward navigation works</li>
      <li>SEO-friendly (search engines parse fragments)</li>
    </ul>
  </div>`,

  code: `<div class="code-section">
    <h3>Hash Navigation Implementation</h3>

    <pre><code class="language-js">// nav.js - Hash-based step navigation
class StepNavigator {
  constructor(stepLoader) {
    this.stepLoader = stepLoader
    this.currentStep = 1

    // Parse initial hash on page load
    this.parseHash()

    // Listen for hash changes (back/forward, direct URL entry)
    window.addEventListener('hashchange', () => {
      this.parseHash()
    })
  }

  parseHash() {
    const hash = window.location.hash.slice(1) // Remove '#'

    if (!hash) {
      this.goToStep(1) // Default to step 1
      return
    }

    // Parse different hash formats
    const stepNum = parseInt(hash, 10)
    if (!isNaN(stepNum) && stepNum >= 1 && stepNum <= 100) {
      this.goToStep(stepNum, false) // Don't update hash (already set)
    } else {
      // Could handle other formats: #ch5, #preset/coral
      console.warn('Invalid hash:', hash)
      this.goToStep(1)
    }
  }

  goToStep(stepIndex, updateHash = true) {
    if (stepIndex === this.currentStep) return

    // Load the step module dynamically
    this.stepLoader.loadStep(stepIndex)
    this.currentStep = stepIndex

    // Update URL hash (creates history entry)
    if (updateHash) {
      window.location.hash = stepIndex.toString()
    }
  }

  // Generate shareable URL for current step
  getCurrentURL() {
    return \`\${window.location.origin}\${window.location.pathname}#\${this.currentStep}\`
  }
}

// steps/index.js - Step loader integration
export function loadStep(stepIndex) {
  // Clear current content
  cleanup()

  // Update navigation state
  navigator.goToStep(stepIndex)

  // Dynamic import with error handling
  import(\`./ch\${Math.ceil(stepIndex/10).toString().padStart(2,'0')}/step\${stepIndex.toString().padStart(3,'0')}.js\`)
    .then(module => {
      currentCleanup = module.default.init(container, state)
    })
    .catch(err => {
      console.error(\`Failed to load step \${stepIndex}:\`, err)
      showError(\`Step \${stepIndex} could not be loaded.\`)
    })
}</code></pre>

    <p><strong>Deep-link button implementation:</strong></p>
    <pre><code class="language-js">// Add to any step's onGui callback
function addDeepLinkButton(gui) {
  const linkFolder = gui.addFolder('Sharing')

  const actions = {
    'Copy Link': () => {
      const url = window.location.href

      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          console.log('URL copied:', url)
          // Could show toast notification
        })
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = url
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
    }
  }

  linkFolder.add(actions, 'Copy Link')
  linkFolder.open()
}</code></pre>
  </div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: PRESETS.spots,
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'bw',
      showGui: true,
      onGui: (gui, sim, params) => {
        // Add deep-link functionality
        const linkFolder = gui.addFolder('Deep Linking')

        const actions = {
          'Copy Link': () => {
            const url = window.location.href

            if (navigator.clipboard) {
              navigator.clipboard.writeText(url).then(() => {
                console.log('Current URL copied to clipboard:', url)
              }).catch(err => {
                console.error('Failed to copy URL:', err)
              })
            } else {
              // Fallback for older browsers
              const textArea = document.createElement('textarea')
              textArea.value = url
              document.body.appendChild(textArea)
              textArea.select()
              try {
                document.execCommand('copy')
                console.log('Current URL copied to clipboard (fallback):', url)
              } catch (err) {
                console.error('Failed to copy URL (fallback):', err)
              }
              document.body.removeChild(textArea)
            }
          }
        }

        linkFolder.add(actions, 'Copy Link')
        linkFolder.open()
      }
    })
  }
}