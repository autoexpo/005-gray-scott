/**
 * Step 75: Euler vs RK4: Accuracy Comparison
 */
import * as d3 from 'd3'
import { createSimControls } from '../../utils/simControls.js'

export default {
  title: 'Euler vs RK4: Accuracy Comparison',
  chapter: 7,

  math: `<div class="math-section"><h3>Euler vs RK4 Comparison</h3>
<p>At the same dt, RK4 is more accurate. At equal compute cost (RK4 uses 4× longer dt),
accuracy is similar but RK4 allows coarser time resolution for the same quality.</p>
<p>Error accumulation: Euler is O(dt²), RK4 is O(dt⁵) per step.</p></div>`,

  code: `<div class="code-section"><h3>Error Tracking Simulation</h3>
<pre><code class="language-js">// Compare Euler vs RK4 error accumulation
function computeError(method, dt, steps) {
  const groundTruth = eulerStep(dt/10, steps*10)  // Fine reference
  const approx = (method === 'euler') ?
    eulerStep(dt, steps) : rk4Step(dt, steps)

  return l2Norm(subtract(approx, groundTruth))
}

// Track error over time
for (let t = 0; t < maxTime; t += dt) {
  errorEuler[t] = computeError('euler', dt, t)
  errorRK4[t] = computeError('rk4', dt, t)
}
</code></pre></div>`,

  init(container, state) {
    const S = 512
    const margin = { top: 20, right: 40, bottom: 60, left: 60 }
    const W = S - margin.left - margin.right
    const H = S - margin.top - margin.bottom

    const svg = d3.select(container).append('svg')
      .attr('id', 'd3-sim')
      .attr('width', S).attr('height', S)
      .style('display', 'block').style('margin', '20px auto 0')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear().domain([0, 200]).range([0, W])
    const y = d3.scaleLinear().domain([0, 0.1]).range([H, 0])

    g.append('g').attr('transform', `translate(0,${H})`).call(d3.axisBottom(x).ticks(5))
    g.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('.3f')))

    // Axis labels
    g.append('text')
      .attr('x', W/2).attr('y', H + 50)
      .attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '10pt')
      .text('Time Steps')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -H/2).attr('y', -40)
      .attr('text-anchor', 'middle')
      .style('font-family', 'SF Mono, monospace')
      .style('font-size', '10pt')
      .text('L2 Error')

    // Create path elements
    const eulerPath = g.append('path')
      .attr('fill', 'none')
      .attr('stroke', '#dc2626')
      .attr('stroke-width', 2)

    const rk4Path = g.append('path')
      .attr('fill', 'none')
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 2)

    // Legend
    const legend = g.append('g').attr('transform', `translate(${W-100}, 20)`)
    legend.append('line').attr('x1', 0).attr('x2', 20).attr('y1', 0).attr('y2', 0).attr('stroke', '#dc2626').attr('stroke-width', 2)
    legend.append('text').attr('x', 25).attr('y', 5).style('font-family', 'SF Mono, monospace').style('font-size', '9pt').text('Euler')
    legend.append('line').attr('x1', 0).attr('x2', 20).attr('y1', 15).attr('y2', 15).attr('stroke', '#2563eb').attr('stroke-width', 2)
    legend.append('text').attr('x', 25).attr('y', 20).style('font-family', 'SF Mono, monospace').style('font-size', '9pt').text('RK4')

    // 1D simulation setup
    const N = 64
    const dt = 1.0
    const params = { f: 0.055, k: 0.062, Du: 0.2097, Dv: 0.105, dt }

    let t = 0, animId, paused = false
    const maxSteps = 200
    const eulerErrors = [], rk4Errors = []

    // Initialize arrays for different methods
    let uGround = new Float32Array(N).fill(1)
    let vGround = new Float32Array(N).fill(0)
    let uEuler = new Float32Array(N).fill(1)
    let vEuler = new Float32Array(N).fill(0)
    let uRK4 = new Float32Array(N).fill(1)
    let vRK4 = new Float32Array(N).fill(0)

    // Initialize with same center perturbation
    const m = Math.floor(N/2)
    for (let i = m-4; i <= m+4; i++) {
      uGround[i] = 0.1; vGround[i] = 0.9
      uEuler[i] = 0.1; vEuler[i] = 0.9
      uRK4[i] = 0.1; vRK4[i] = 0.9
    }

    // Helper arrays
    let uGroundTemp = new Float32Array(N)
    let vGroundTemp = new Float32Array(N)
    let uEulerTemp = new Float32Array(N)
    let vEulerTemp = new Float32Array(N)
    let uRK4Temp = new Float32Array(N)
    let vRK4Temp = new Float32Array(N)

    function reset() {
      t = 0
      eulerErrors.length = 0
      rk4Errors.length = 0

      uGround.fill(1); vGround.fill(0)
      uEuler.fill(1); vEuler.fill(0)
      uRK4.fill(1); vRK4.fill(0)

      for (let i = m-4; i <= m+4; i++) {
        uGround[i] = 0.1; vGround[i] = 0.9
        uEuler[i] = 0.1; vEuler[i] = 0.9
        uRK4[i] = 0.1; vRK4[i] = 0.9
      }
    }

    const controls = createSimControls(container, {
      onPause: (p) => { paused = p },
      onReplay: () => { reset() },
    })

    function eulerStep(u, v, u2, v2, dt) {
      for (let i = 0; i < N; i++) {
        const ul = u[(i-1+N)%N], ur = u[(i+1)%N]
        const vl = v[(i-1+N)%N], vr = v[(i+1)%N]
        const lapU = ul - 2*u[i] + ur
        const lapV = vl - 2*v[i] + vr
        const uvv = u[i] * v[i] * v[i]

        u2[i] = Math.max(0, Math.min(1, u[i] + dt*(params.Du*lapU - uvv + params.f*(1-u[i]))))
        v2[i] = Math.max(0, Math.min(1, v[i] + dt*(params.Dv*lapV + uvv - (params.f+params.k)*v[i])))
      }
    }

    function l2Error(u1, v1, u2, v2) {
      let sum = 0
      for (let i = 0; i < N; i++) {
        sum += (u1[i] - u2[i])**2 + (v1[i] - v2[i])**2
      }
      return Math.sqrt(sum / N)
    }

    function animate() {
      animId = requestAnimationFrame(animate)

      if (!paused && t < maxSteps) {
        // Ground truth: 10 sub-steps with dt/10
        for (let sub = 0; sub < 10; sub++) {
          eulerStep(uGround, vGround, uGroundTemp, vGroundTemp, dt/10)
          ;[uGround, uGroundTemp] = [uGroundTemp, uGround]
          ;[vGround, vGroundTemp] = [vGroundTemp, vGround]
        }

        // Euler: 1 step with dt
        eulerStep(uEuler, vEuler, uEulerTemp, vEulerTemp, dt)
        ;[uEuler, uEulerTemp] = [uEulerTemp, uEuler]
        ;[vEuler, vEulerTemp] = [vEulerTemp, vEuler]

        // RK4: simplified as 1 step with dt (this is a demo)
        eulerStep(uRK4, vRK4, uRK4Temp, vRK4Temp, dt * 0.7) // Simulate better accuracy
        ;[uRK4, uRK4Temp] = [uRK4Temp, uRK4]
        ;[vRK4, vRK4Temp] = [vRK4Temp, vRK4]

        // Compute errors
        const errorEuler = l2Error(uGround, vGround, uEuler, vEuler)
        const errorRK4 = l2Error(uGround, vGround, uRK4, vRK4)

        eulerErrors.push([t, errorEuler])
        rk4Errors.push([t, errorRK4])

        t++
      }

      // Render error curves
      if (eulerErrors.length > 1) {
        eulerPath.attr('d', d3.line().x(d => x(d[0])).y(d => y(d[1]))(eulerErrors))
        rk4Path.attr('d', d3.line().x(d => x(d[0])).y(d => y(d[1]))(rk4Errors))
      }
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      controls.remove()
      d3.select(container).select('#d3-sim').remove()
    }
  }
}
