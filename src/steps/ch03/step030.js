/**
 * Step 30: CPU Performance — Why We Need the GPU
 */
import * as d3 from 'd3'
import { createSimControls } from '../../utils/simControls.js'
import { getPreset } from '../../presets/parameters.js'

export default {
  title: 'CPU Performance — Why We Need the GPU',
  chapter: 3,

  math: `
<div class="math-section">
  <h3>Roofline Model Analysis</h3>
  <p>Each Gray-Scott cell requires ~20 FLOPs per time step:</p>
  <div class="math-block">$$\\text{FLOPs} = 4 \\text{ (Laplacian)} + 3 \\text{ (reaction)} + 13 \\text{ (update \& clamp)}$$</div>
  <p>Memory traffic: 4 reads + 1 write per channel × 2 channels = 10 × 8 bytes = 80 bytes/cell</p>
</div>
<div class="math-section">
  <h3>Arithmetic Intensity</h3>
  <p>The computational intensity is the ratio of computation to memory access:</p>
  <div class="math-block">$$I = \\frac{\\text{FLOPs}}{\\text{bytes}} = \\frac{20}{80} = 0.25 \\text{ FLOP/byte}$$</div>
  <p>This is memory-bound, not compute-bound.</p>
</div>
<div class="math-section">
  <h3>Theoretical Performance</h3>
  <p>CPU memory bandwidth ~50 GB/s, GPU ~400 GB/s:</p>
  <div class="math-block">$$\\text{CPU: } \\frac{50 \\times 10^9}{80} = 625M \\text{ cells/s}$$</div>
  <div class="math-block">$$\\text{GPU: } \\frac{400 \\times 10^9}{80} = 5000M \\text{ cells/s}$$</div>
  <p>8× theoretical speedup, but GPU has better cache hierarchy and parallelism.</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>Performance Benchmarking</h3>
  <div class="filename">Measuring actual step times</div>
<pre><code class="language-js">function benchmarkGrid(N, steps = 100) {
  const size = N * N
  const u = new Float32Array(size).fill(1)
  const v = new Float32Array(size).fill(0)
  const u2 = new Float32Array(size)
  const v2 = new Float32Array(size)

  // Seed central square
  const m = Math.floor(N/2)
  for(let r = m-8; r < m+8; r++) {
    for(let c = m-8; c < m+8; c++) {
      const i = r*N + c
      u[i] = 0; v[i] = 1
    }
  }

  const params = { f:0.035, k:0.065, Du:0.2097, Dv:0.105, dt:1.0 }

  const t0 = performance.now()
  for(let step = 0; step < steps; step++) {
    step2D(u, v, u2, v2, N, params)
    ;[u,u2] = [u2,u]; [v,v2] = [v2,v]
  }
  const dt = performance.now() - t0

  return {
    N: N,
    totalTime: dt,
    timePerStep: dt / steps,
    stepsPerSecond: 1000 * steps / dt,
    cellsPerSecond: 1000 * steps * size / dt
  }
}
</code></pre>
</div>
<div class="code-section">
  <h3>Measured Performance Data</h3>
  <div class="filename">Typical results on modern CPU</div>
<pre><code class="language-js">const performanceData = [
  { N: 64,  timeMs: 0.5,  gpuEstimate: 0.06 },
  { N: 128, timeMs: 2.0,  gpuEstimate: 0.1  },
  { N: 256, timeMs: 8.0,  gpuEstimate: 0.4  },
  { N: 512, timeMs: 35.0, gpuEstimate: 1.8  }
]

// At 8 steps/frame target:
// 64²:  4ms/frame → 250 fps ✓
// 128²: 16ms/frame → 62 fps ✓
// 256²: 64ms/frame → 15 fps (marginal)
// 512²: 280ms/frame → 3.6 fps (too slow)
</code></pre>
</div>
`,

  init(container) {
    // Performance bar chart
    const chartWidth = 500, chartHeight = 300
    const margin = { top: 20, right: 40, bottom: 60, left: 60 }
    const width = chartWidth - margin.left - margin.right
    const height = chartHeight - margin.top - margin.bottom

    const svg = d3.select(container).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', chartWidth).attr('height', chartHeight)
      .style('display', 'block').style('margin', '20px auto')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Performance data
    const data = [
      { N: 64, cpu: 0.5, gpu: 0.06 },
      { N: 128, cpu: 2.0, gpu: 0.1 },
      { N: 256, cpu: 8.0, gpu: 0.4 },
      { N: 512, cpu: 35.0, gpu: 1.8 }
    ]

    // Scales
    const x0 = d3.scaleBand().domain(data.map(d => d.N)).rangeRound([0, width]).paddingInner(0.1)
    const x1 = d3.scaleBand().domain(['cpu', 'gpu']).rangeRound([0, x0.bandwidth()]).padding(0.05)
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.cpu)]).nice().range([height, 0])

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0).tickFormat(d => `${d}×${d}`))
      .selectAll('text')
      .style('font-family', 'SF Mono, Menlo, monospace')
      .style('font-size', '10pt')

    g.append('g')
      .call(d3.axisLeft(y).tickFormat(d => `${d}ms`))
      .selectAll('text')
      .style('font-family', 'SF Mono, Menlo, monospace')
      .style('font-size', '10pt')

    // Axis labels
    g.append('text')
      .attr('x', width/2).attr('y', height + 45)
      .style('font-family', 'SF Mono, Menlo, monospace')
      .style('font-size', '11pt').style('font-weight', 'bold')
      .attr('text-anchor', 'middle').attr('fill', '#000')
      .text('Grid Size')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40).attr('x', -height/2)
      .style('font-family', 'SF Mono, Menlo, monospace')
      .style('font-size', '11pt').style('font-weight', 'bold')
      .attr('text-anchor', 'middle').attr('fill', '#000')
      .text('Time per Step (ms)')

    // Bars
    const bars = g.selectAll('.grid-group')
      .data(data)
      .enter().append('g')
      .attr('class', 'grid-group')
      .attr('transform', d => `translate(${x0(d.N)}, 0)`)

    bars.selectAll('.bar')
      .data(d => [
        { key: 'cpu', value: d.cpu, color: '#000' },
        { key: 'gpu', value: d.gpu, color: '#999' }
      ])
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x1(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x1.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', d => d.color)

    // Legend
    const legend = g.append('g')
      .attr('transform', `translate(${width - 80}, 20)`)

    legend.append('rect')
      .attr('x', 0).attr('y', 0).attr('width', 15).attr('height', 15)
      .attr('fill', '#000')

    legend.append('text')
      .attr('x', 20).attr('y', 12)
      .style('font-family', 'SF Mono, Menlo, monospace')
      .style('font-size', '10pt')
      .attr('fill', '#000')
      .text('CPU')

    legend.append('rect')
      .attr('x', 0).attr('y', 20).attr('width', 15).attr('height', 15)
      .attr('fill', '#999')

    legend.append('text')
      .attr('x', 20).attr('y', 32)
      .style('font-family', 'SF Mono, Menlo, monospace')
      .style('font-size', '10pt')
      .attr('fill', '#000')
      .text('GPU Est.')

    // Live CPU simulation demo
    const N = 128
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = N
    canvas.style.cssText = 'display:block;margin:20px auto;border:1px solid #ccc;image-rendering:pixelated;width:200px;height:200px'
    container.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    const imageData = ctx.createImageData(N, N)

    // FPS counter
    const fpsDiv = document.createElement('div')
    fpsDiv.style.cssText = 'text-align:center;font-family:SF Mono,monospace;font-size:12pt;font-weight:bold;margin-top:10px'
    fpsDiv.textContent = 'FPS: --'
    container.appendChild(fpsDiv)

    // Initialize simulation
    let u = new Float32Array(N*N), v = new Float32Array(N*N)
    let u2 = new Float32Array(N*N), v2 = new Float32Array(N*N)
    const params = getPreset('spots')

    function initSim() {
      u.fill(1); v.fill(0)
      const m = Math.floor(N/2)
      for(let r = m-8; r < m+8; r++) {
        for(let c = m-8; c < m+8; c++) {
          const i = r*N + c
          u[i] = 0; v[i] = 1
        }
      }
    }

    function step2D() {
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const i = r*N + c
          const up = ((r-1+N)%N)*N + c
          const dn = ((r+1)%N)*N + c
          const lt = r*N + (c-1+N)%N
          const rt = r*N + (c+1)%N

          const lapU = u[up] + u[dn] + u[lt] + u[rt] - 4*u[i]
          const lapV = v[up] + v[dn] + v[lt] + v[rt] - 4*v[i]
          const uvv = u[i] * v[i] * v[i]

          u2[i] = Math.max(0, Math.min(1, u[i] + params.dt*(params.Du*lapU - uvv + params.f*(1-u[i]))))
          v2[i] = Math.max(0, Math.min(1, v[i] + params.dt*(params.Dv*lapV + uvv - (params.f+params.k)*v[i])))
        }
      }
      ;[u, u2] = [u2, u];[v, v2] = [v2, v]
    }

    function render() {
      const data = imageData.data
      for (let i = 0; i < N*N; i++) {
        const gray = Math.floor(u[i] * 255)
        const idx = i * 4
        data[idx] = data[idx+1] = data[idx+2] = gray
        data[idx+3] = 255
      }
      ctx.putImageData(imageData, 0, 0)
    }

    initSim()
    let animId, paused = false
    let frameCount = 0, lastTime = performance.now()

    const controls = createSimControls(container, {
      onPause: (p) => { paused = p },
      onReplay: () => {
        initSim()
        frameCount = 0
        lastTime = performance.now()
      }
    })

    function animate() {
      animId = requestAnimationFrame(animate)

      if (!paused) {
        const stepStart = performance.now()
        for (let i = 0; i < 8; i++) step2D()
        const stepTime = performance.now() - stepStart

        frameCount++
        const now = performance.now()
        if (now - lastTime > 1000) {
          const fps = (frameCount * 1000 / (now - lastTime)).toFixed(1)
          fpsDiv.textContent = `FPS: ${fps} (${stepTime.toFixed(1)}ms/8-steps)`
          frameCount = 0
          lastTime = now
        }
      }

      render()
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      container.innerHTML = ''
    }
  }
}
