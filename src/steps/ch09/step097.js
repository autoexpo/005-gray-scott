/**
 * Step 97: Vite Production Build: Asset Hashing
 */

import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Vite Production Build: Asset Hashing',
  chapter: 9,

  math: `<div class="math-section">
    <h3>Content-Addressed Assets & Caching Strategy</h3>

    <p><strong>Asset hashing mathematics:</strong></p>
    <pre>hash = SHA-256(file_content).slice(0, 8)
filename = "chunk-[hash].js"

// Examples:
main-B4j4fEp6.js  ← Main app bundle
step095-NPe9zL39.js ← Step 95 chunk
three-A8k2Hf9D.js  ← Three.js vendor bundle</pre>

    <p><strong>Cache invalidation strategy:</strong></p>
    <ul>
      <li><strong>Content unchanged</strong> → Same hash → Browser cache hit (instant load)</li>
      <li><strong>Content modified</strong> → New hash → Browser fetches fresh file</li>
      <li><strong>HTML updates</strong> → References new hashed filenames → Automatic cache bust</li>
    </ul>

    <p><strong>Gray-Scott course bundle analysis:</strong></p>
    <table style="border-collapse: collapse; width: 100%;">
    <tr><th style="border: 1px solid #ccc; padding: 8px;">Asset</th><th style="border: 1px solid #ccc; padding: 8px;">Size</th><th style="border: 1px solid #ccc; padding: 8px;">Change Frequency</th><th style="border: 1px solid #ccc; padding: 8px;">Cache Strategy</th></tr>
    <tr><td style="border: 1px solid #ccc; padding: 8px;">Three.js</td><td style="border: 1px solid #ccc; padding: 8px;">~600KB</td><td style="border: 1px solid #ccc; padding: 8px;">Never</td><td style="border: 1px solid #ccc; padding: 8px;">Cache forever</td></tr>
    <tr><td style="border: 1px solid #ccc; padding: 8px;">Step modules</td><td style="border: 1px solid #ccc; padding: 8px;">5-20KB each</td><td style="border: 1px solid #ccc; padding: 8px;">Often</td><td style="border: 1px solid #ccc; padding: 8px;">Cache per version</td></tr>
    <tr><td style="border: 1px solid #ccc; padding: 8px;">GPU shaders</td><td style="border: 1px solid #ccc; padding: 8px;">~2KB each</td><td style="border: 1px solid #ccc; padding: 8px;">Rarely</td><td style="border: 1px solid #ccc; padding: 8px;">Long-term cache</td></tr>
    <tr><td style="border: 1px solid #ccc; padding: 8px;">Course data</td><td style="border: 1px solid #ccc; padding: 8px;">~50KB</td><td style="border: 1px solid #ccc; padding: 8px;">Occasionally</td><td style="border: 1px solid #ccc; padding: 8px;">Medium-term cache</td></tr>
    </table>

    <p><strong>Code splitting benefits:</strong></p>
    <ul>
      <li><strong>Initial load:</strong> ~200KB (index + Three.js) → Fast startup</li>
      <li><strong>Step navigation:</strong> 5-20KB per step → Instant loading</li>
      <li><strong>Lazy chapters:</strong> Load chapter 5 only when accessed</li>
      <li><strong>Parallel loading:</strong> Browser can fetch multiple chunks simultaneously</li>
    </ul>

    <p><strong>HTTP/2 optimization:</strong></p>
    <p>With HTTP/2 multiplexing, loading many small chunks is more efficient than one large bundle:</p>
    <pre>// HTTP/1.1: Sequential loading (slow)
GET /bundle.js (2MB) → Wait 3s → Complete

// HTTP/2: Parallel loading (fast)
GET /main-B4j4.js (200KB) ┐
GET /step095-NPe9.js (15KB) ├→ All parallel → Complete in 800ms
GET /three-A8k2.js (600KB) ┘</pre>

    <p><strong>Cache hit rate calculation:</strong></p>
    <p>For a 100-step course with regular content updates:</p>
    <pre>Stable assets (Three.js, shaders): 95% cache hit
Modified steps: 20% cache hit (5 steps updated weekly)
Overall cache hit rate: ~85% (excellent performance)</pre>
  </div>`,

  code: `<div class="code-section">
    <h3>Vite Build Configuration</h3>

    <p><strong>Current vite.config.js:</strong></p>
    <pre><code class="language-js">export default {
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  assetsInclude: ['**/*.glsl', '**/*.frag', '**/*.vert'],
}</code></pre>

    <p><strong>Enhanced production configuration:</strong></p>
    <pre><code class="language-js">// vite.config.js - Optimized for Gray-Scott course
export default {
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',

    // Code splitting configuration
    rollupOptions: {
      output: {
        // Chunk naming with content hashes
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name || 'chunk'
          return \`\${name}-[hash].js\`
        },

        // Asset naming (CSS, images, shaders)
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name.split('.').pop()
          return \`assets/[name]-[hash].\${ext}\`
        },

        // Manual chunk splitting for optimal caching
        manualChunks: {
          // Vendor libraries (rarely change)
          'vendor': ['three', 'stats.js'],

          // Core simulation (stable)
          'sim-core': [
            'src/gpu/GPUSim.js',
            'src/gpu/SimShader.js',
            'src/gpu/VizShader.js'
          ],

          // UI components (moderate changes)
          'ui': [
            'src/gui/GuiManager.js',
            'src/utils/simControls.js'
          ],

          // Step modules split automatically by chapter
          ...generateChapterChunks()
        }
      }
    },

    // Asset optimization
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,    // Remove console.log in production
        drop_debugger: true
      }
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 1000  // Warn if chunk > 1MB
  },

  // GLSL shader support
  assetsInclude: ['**/*.glsl', '**/*.frag', '**/*.vert'],

  // Development server
  server: {
    port: 3000,
    open: true
  }
}

// Generate chapter-based chunks (steps 1-10, 11-20, etc.)
function generateChapterChunks() {
  const chunks = {}

  for (let chapter = 1; chapter <= 10; chapter++) {
    const chunkName = \`chapter-\${chapter.toString().padStart(2, '0')}\`
    chunks[chunkName] = []

    for (let step = (chapter - 1) * 10 + 1; step <= chapter * 10; step++) {
      const stepFile = \`src/steps/ch\${chapter.toString().padStart(2,'0')}/step\${step.toString().padStart(3,'0')}.js\`
      chunks[chunkName].push(stepFile)
    }
  }

  return chunks
}</code></pre>

    <p><strong>Build output analysis:</strong></p>
    <pre><code class="language-bash"># Build the project
npm run build

# Analyze bundle sizes
npx vite-bundle-analyzer dist/

# Example build output structure:
dist/
├── index.html                    # Entry point (references hashed assets)
├── assets/
│   ├── vendor-A8k2Hf9D.js      # Three.js + Stats.js (~650KB)
│   ├── sim-core-B7m3Kp2L.js    # GPU simulation (~45KB)
│   ├── ui-C4n8Qr5M.js          # GUI components (~25KB)
│   ├── chapter-01-D9p6Ts8N.js  # Steps 1-10 (~80KB)
│   ├── chapter-09-E2q7Uv9O.js  # Steps 91-100 (~75KB)
│   ├── main-F8s4Yw3P.js        # App entry point (~15KB)
│   └── style-G5t2Xz6Q.css      # Styles with hash (~8KB)
└── assets/shaders/              # GLSL files with hashes
    ├── grayscott-H3u7Vx8R.glsl
    └── visualize-I9w5Ty4S.glsl</code></pre>

    <p><strong>Dynamic import loading pattern:</strong></p>
    <pre><code class="language-js">// src/steps/index.js - Lazy loading with error handling
export async function loadStep(stepIndex) {
  const chapterNum = Math.ceil(stepIndex / 10)
  const stepPadded = stepIndex.toString().padStart(3, '0')
  const chapterPadded = chapterNum.toString().padStart(2, '0')

  try {
    // Dynamic import creates separate chunk with hash
    const module = await import(
      \`./ch\${chapterPadded}/step\${stepPadded}.js\`
    )

    console.log(\`Loaded step \${stepIndex} (\${module.default.title})\`)
    return module.default

  } catch (error) {
    console.error(\`Failed to load step \${stepIndex}:\`, error)

    // Fallback to placeholder step
    return {
      title: \`Step \${stepIndex} (Load Error)\`,
      init: (container) => {
        container.innerHTML = \`
          <div style="padding: 20px; color: red;">
            Failed to load step \${stepIndex}
          </div>
        \`
        return () => { container.innerHTML = '' }
      }
    }
  }
}

// Preload next few steps for smoother navigation
export function preloadSteps(currentStep, count = 3) {
  for (let i = 1; i <= count; i++) {
    const nextStep = currentStep + i
    if (nextStep <= 100) {
      // Import but don't use (populates browser cache)
      import(\`./ch\${Math.ceil(nextStep/10).toString().padStart(2,'0')}/step\${nextStep.toString().padStart(3,'0')}.js\`)
        .catch(() => {}) // Ignore preload failures
    }
  }
}</code></pre>
  </div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: PRESETS.worms,
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'bw',
      showGui: true,
      onGui: (gui, sim, params) => {
        // Demo build info
        const buildFolder = gui.addFolder('Build Analysis')

        // Mock build statistics
        const buildStats = {
          'Bundle Size': '1.2MB',
          'Gzipped': '420KB',
          'Chunks': '24',
          'Cache Hit': '87%'
        }

        Object.entries(buildStats).forEach(([key, value]) => {
          const obj = {}
          obj[key] = value
          buildFolder.add(obj, key).name(key).listen()
        })

        const buildActions = {
          'Show Bundle': () => {
            console.log('Bundle analysis:')
            console.log('├── vendor-A8k2Hf9D.js (650KB) - Three.js + Stats')
            console.log('├── sim-core-B7m3Kp2L.js (45KB) - GPU simulation')
            console.log('├── ui-C4n8Qr5M.js (25KB) - GUI components')
            console.log('├── chapter-09-E2q7Uv9O.js (75KB) - Steps 91-100')
            console.log('└── main-F8s4Yw3P.js (15KB) - App entry')
          },

          'Simulate Build': () => {
            const modules = [
              'Analyzing modules...',
              'Creating vendor chunk...',
              'Splitting step modules...',
              'Generating asset hashes...',
              'Minifying bundles...',
              'Build complete! 📦'
            ]

            modules.forEach((msg, i) => {
              setTimeout(() => console.log(msg), i * 500)
            })
          }
        }

        buildFolder.add(buildActions, 'Show Bundle')
        buildFolder.add(buildActions, 'Simulate Build')
        buildFolder.open()
      }
    })
  }
}