/**
 * Step 77: Spatial Resolution — 128 vs 512 vs 1024
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Spatial Resolution — 128 vs 512 vs 1024',
  chapter: 7,

  math: `<div class="math-section"><h3>Resolution vs Quality vs Performance</h3>
<p>Spatial resolution effects on Gray-Scott simulation:</p>
<div class="math-block">$$\\text{Memory per buffer:} \\quad M = N^2 \\times 4 \\text{ channels} \\times 4 \\text{ bytes} = 16N^2 \\text{ bytes}$$</div>
<div class="math-block">$$\\text{Compute cost per step:} \\quad C \\propto N^2 \\text{ (pixels to update)}$$</div>
<p><strong>Resolution scaling</strong>:</p>
<ul>
<li><strong>128²</strong>: 16,384 pixels, 1.0 MB per buffer, baseline speed</li>
<li><strong>256²</strong>: 65,536 pixels, 4.0 MB per buffer, 4× slower</li>
<li><strong>512²</strong>: 262,144 pixels, 16 MB per buffer, 16× slower</li>
<li><strong>1024²</strong>: 1,048,576 pixels, 64 MB per buffer, 64× slower</li>
</ul>
<p><strong>Pattern resolution</strong>: Finer grids can resolve smaller wavelength modes</p>
<p><strong>Wavelength limit</strong>: Minimum resolvable λ ≈ 4h (2 points per wavelength)</p>
<p><strong>For spots pattern</strong>: λ_typical ≈ 20-30 grid units, so 128² is adequate</p>
<p><strong>Sweet spot</strong>: 256² balances quality and performance on modern GPUs</p>
<p><strong>High-res use cases</strong>: 512²+ for detailed scientific analysis or high-quality renders</p></div>`,

  code: `<div class="code-section"><h3>Resolution and Performance Analysis</h3>
<pre><code class="language-js">// Performance scaling analysis
function analyzeResolutionScaling() {
  const resolutions = [64, 128, 256, 512, 1024]

  resolutions.forEach(N => {
    const pixels = N * N
    const memoryMB = (pixels * 16) / (1024 * 1024) // 16 bytes per pixel (2 buffers × 4 channels × 4 bytes)
    const relativeSpeed = (128 * 128) / pixels // Relative to 128²

    console.log(\`Resolution \${N}²:\`)
    console.log(\`  Pixels: \${pixels.toLocaleString()}\`)
    console.log(\`  Memory: \${memoryMB.toFixed(1)} MB\`)
    console.log(\`  Relative speed: \${relativeSpeed.toFixed(3)}x\`)
    console.log(\`  Framerate estimate: \${(60 * relativeSpeed).toFixed(0)} fps\`)
    console.log()
  })
}

// Memory calculation for GPU buffers
function calculateGPUMemory(width, height, numBuffers = 2) {
  const channels = 4 // RGBA
  const bytesPerChannel = 4 // Float32
  const pixelSize = channels * bytesPerChannel
  const bufferSize = width * height * pixelSize
  const totalMemory = bufferSize * numBuffers

  return {
    pixelSize: pixelSize + ' bytes',
    bufferSize: (bufferSize / (1024 * 1024)).toFixed(2) + ' MB',
    totalMemory: (totalMemory / (1024 * 1024)).toFixed(2) + ' MB'
  }
}

// Benchmark different grid sizes
async function benchmarkResolutions(renderer) {
  const results = []
  const testSizes = [128, 256, 512]
  const testSteps = 100

  for (const size of testSizes) {
    const sim = new GPUSim(renderer, size)
    const params = PRESETS.spots

    const startTime = performance.now()
    for (let i = 0; i < testSteps; i++) {
      sim.step(params, 8) // 8 steps per frame
    }
    const endTime = performance.now()

    const msPerStep = (endTime - startTime) / (testSteps * 8)
    const stepsPerSecond = 1000 / msPerStep

    results.push({
      size,
      msPerStep: msPerStep.toFixed(3),
      stepsPerSecond: stepsPerSecond.toFixed(0),
      relativeSpeed: (results.length === 0 ? 1 : results[0].stepsPerSecond / stepsPerSecond).toFixed(2)
    })

    sim.dispose()
  }

  console.table(results)
  return results
}

// Spatial frequency analysis
function analyzeSpatialFrequencies(fieldData, gridSize) {
  // Simplified 2D FFT analysis would go here
  // For educational purposes, estimate dominant wavelength
  const avgSpacing = estimatePatternSpacing(fieldData, gridSize)
  const wavelengthPixels = avgSpacing * 2
  const wavelengthPhysical = wavelengthPixels * (1 / gridSize) // Normalized units

  return {
    avgSpacing,
    wavelengthPixels,
    wavelengthPhysical,
    nyquistLimit: gridSize / 2,
    isWellResolved: wavelengthPixels > 4 // Need >4 points per wavelength
  }
}</code></pre></div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: PRESETS.spots,
      size: 512, // Higher resolution to demonstrate quality
      vizMode: 'bw',
      stepsPerFrame: 4,
      showGui: true
    })
  }
}
