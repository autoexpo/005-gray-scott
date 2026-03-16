/**
 * Step 96: Progress Persistence: localStorage
 */

import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Progress Persistence: localStorage',
  chapter: 9,

  math: `<div class="math-section">
    <h3>localStorage API for Course Progress</h3>

    <p><strong>Browser storage comparison:</strong></p>
    <ul>
      <li><code>localStorage</code> — persistent, ~5MB limit, synchronous key-value store</li>
      <li><code>sessionStorage</code> — cleared when tab closes, same API as localStorage</li>
      <li><code>IndexedDB</code> — async, larger storage (GB+), complex objects</li>
      <li><code>WebSQL</code> — deprecated, don't use</li>
    </ul>

    <p><strong>Storage limitations:</strong></p>
    <pre>localStorage.setItem('key', 'string value') // Only strings!
localStorage.getItem('key') // Returns string or null

// For objects, use JSON:
const data = { step: 42, visited: [1,2,3] }
localStorage.setItem('progress', JSON.stringify(data))
const restored = JSON.parse(localStorage.getItem('progress') || '{}')</pre>

    <p><strong>Course progress data model:</strong></p>
    <pre>interface CourseProgress {
  lastStep: number              // Last step viewed
  visited: number[]             // Array of visited step numbers
  customParams: {               // User's modified parameters
    [stepId]: GrayScottParams
  }
  timestamp: number             // Last update time
  version: string               // Data format version
}</pre>

    <p><strong>Set serialization:</strong></p>
    <p>JavaScript <code>Set</code> objects don't serialize to JSON directly:</p>
    <pre>// Wrong: Set → JSON loses data
const visited = new Set([1, 5, 12])
JSON.stringify(visited) // "{}" (empty object)

// Correct: Set ↔ Array conversion
const visitedArray = [...visited]           // Set to Array
const visitedSet = new Set(visitedArray)    // Array to Set</pre>

    <p><strong>Storage quota handling:</strong></p>
    <p>localStorage throws <code>QuotaExceededError</code> when full (~5MB). Handle gracefully:</p>
    <pre>try {
  localStorage.setItem('progress', JSON.stringify(data))
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    // Clean old data or warn user
    console.warn('Storage quota exceeded')
  }
}</pre>

    <p><strong>Privacy considerations:</strong></p>
    <ul>
      <li>localStorage is origin-scoped: <code>site.com</code> ≠ <code>www.site.com</code></li>
      <li>Private/incognito mode may disable localStorage</li>
      <li>Users can clear browser data, wiping localStorage</li>
      <li>Never store sensitive data (passwords, tokens) in localStorage</li>
    </ul>
  </div>`,

  code: `<div class="code-section">
    <h3>Progress Persistence Implementation</h3>

    <pre><code class="language-js">// progress.js - Course progress management
class ProgressManager {
  constructor() {
    this.storageKey = 'gray-scott-course-progress'
    this.visited = new Set()
    this.lastStep = 1
    this.customParams = {}

    this.load()
  }

  // Save progress to localStorage
  save() {
    const data = {
      lastStep: this.lastStep,
      visited: [...this.visited],  // Set → Array for JSON
      customParams: this.customParams,
      timestamp: Date.now(),
      version: '1.0'
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data))
      console.log('Progress saved:', data)
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded, cannot save progress')
        this.cleanup()  // Remove old data
      } else {
        console.error('Failed to save progress:', error)
      }
    }
  }

  // Load progress from localStorage
  load() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (!stored) return

      const data = JSON.parse(stored)

      // Validate data structure
      if (data.version !== '1.0') {
        console.warn('Progress data version mismatch, resetting')
        return
      }

      this.lastStep = data.lastStep || 1
      this.visited = new Set(data.visited || [])  // Array → Set
      this.customParams = data.customParams || {}

      console.log('Progress loaded:', data)
    } catch (error) {
      console.error('Failed to load progress:', error)
      this.reset()
    }
  }

  // Mark step as visited
  visitStep(stepIndex) {
    this.visited.add(stepIndex)
    this.lastStep = stepIndex
    this.save()
  }

  // Check if step was visited
  hasVisited(stepIndex) {
    return this.visited.has(stepIndex)
  }

  // Get visited count
  getVisitedCount() {
    return this.visited.size
  }

  // Get completion percentage
  getCompletion() {
    const totalSteps = 100
    return Math.round((this.visited.size / totalSteps) * 100)
  }

  // Save custom parameters for a step
  saveParams(stepIndex, params) {
    this.customParams[stepIndex] = { ...params }
    this.save()
  }

  // Load custom parameters for a step
  loadParams(stepIndex) {
    return this.customParams[stepIndex] || null
  }

  // Export progress as downloadable JSON
  export() {
    const data = {
      lastStep: this.lastStep,
      visited: [...this.visited],
      customParams: this.customParams,
      timestamp: Date.now(),
      version: '1.0',
      exportDate: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'gray-scott-progress.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Import progress from JSON file
  import(file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        this.lastStep = data.lastStep || 1
        this.visited = new Set(data.visited || [])
        this.customParams = data.customParams || {}
        this.save()
        console.log('Progress imported successfully')
      } catch (error) {
        console.error('Failed to import progress:', error)
      }
    }
    reader.readAsText(file)
  }

  // Clean up old data to free storage
  cleanup() {
    // Keep only recent custom params
    const recentSteps = [...this.visited].slice(-20)
    const newCustomParams = {}

    recentSteps.forEach(step => {
      if (this.customParams[step]) {
        newCustomParams[step] = this.customParams[step]
      }
    })

    this.customParams = newCustomParams
    this.save()
  }

  // Reset all progress
  reset() {
    this.lastStep = 1
    this.visited.clear()
    this.customParams = {}
    localStorage.removeItem(this.storageKey)
    console.log('Progress reset')
  }
}

// Global progress manager instance
const progress = new ProgressManager()</code></pre>

    <p><strong>Progress UI integration:</strong></p>
    <pre><code class="language-js">// Add to navigation component
function updateProgressBadge() {
  const badge = document.getElementById('progress-badge')
  const completion = progress.getCompletion()
  const visited = progress.getVisitedCount()

  badge.textContent = \`\${visited}/100 (\${completion}%)\`
  badge.className = completion === 100 ? 'complete' : 'in-progress'
}

// Mark current step as visited
function onStepLoad(stepIndex) {
  progress.visitStep(stepIndex)
  updateProgressBadge()

  // Highlight visited steps in navigation
  document.querySelectorAll('[data-step]').forEach(el => {
    const step = parseInt(el.dataset.step)
    el.classList.toggle('visited', progress.hasVisited(step))
  })
}</code></pre>
  </div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: PRESETS.stripes,
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'bw',
      showGui: true,
      onGui: (gui, sim, params) => {
        // Demo localStorage persistence
        const progressFolder = gui.addFolder('Progress Demo')

        // Mock progress data for demonstration
        const mockProgress = {
          visitedSteps: new Set([1, 2, 5, 15, 42, 95, 96]),
          lastStep: 96
        }

        const stats = {
          visited: mockProgress.visitedSteps.size,
          completion: Math.round((mockProgress.visitedSteps.size / 100) * 100) + '%'
        }

        // Read-only display
        progressFolder.add(stats, 'visited').name('Steps Visited').listen()
        progressFolder.add(stats, 'completion').name('Completion').listen()

        const actions = {
          'Export Progress': () => {
            const data = {
              lastStep: mockProgress.lastStep,
              visited: [...mockProgress.visitedSteps],
              customParams: { 96: params },
              timestamp: Date.now(),
              version: '1.0'
            }

            const blob = new Blob([JSON.stringify(data, null, 2)], {
              type: 'application/json'
            })

            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'gray-scott-progress.json'
            a.click()
            URL.revokeObjectURL(url)

            console.log('Progress exported:', data)
          },

          'Save Params': () => {
            try {
              localStorage.setItem('step96-params', JSON.stringify(params))
              console.log('Parameters saved to localStorage')
            } catch (e) {
              console.error('Failed to save parameters:', e)
            }
          },

          'Load Params': () => {
            try {
              const stored = localStorage.getItem('step96-params')
              if (stored) {
                const loadedParams = JSON.parse(stored)
                Object.assign(params, loadedParams)
                console.log('Parameters loaded from localStorage')
                // Refresh GUI to show loaded values
                gui.updateDisplay()
              }
            } catch (e) {
              console.error('Failed to load parameters:', e)
            }
          }
        }

        progressFolder.add(actions, 'Export Progress')
        progressFolder.add(actions, 'Save Params')
        progressFolder.add(actions, 'Load Params')
        progressFolder.open()
      }
    })
  }
}