/** Step 13: Running the 1D simulation — the animation loop. */
export default {
  title: '1D Animation Loop',
  chapter: 2,
  math: `<div class="math-section"><h3>The Animation Loop</h3>
<p>requestAnimationFrame provides ~60fps timing. We run multiple simulation steps
per frame (sub-stepping) to make the simulation progress at a visible rate.</p>
<div class="math-block">$$\\text{wall-clock rate} = \\frac{\\text{steps/frame} \\times 60}{\\Delta t} \\approx \\frac{8 \\times 60}{1} = 480 \\text{ sim-units/sec}$$</div>
<p>Gray-Scott patterns typically fully develop in 5,000–50,000 time units, so
sub-stepping by 8–16× is needed for visible progress.</p>
</div>`,
  code: `<div class="code-section"><h3>Sub-stepped Animation Loop</h3>
<pre><code class="language-js">const STEPS_PER_FRAME = 8

function animate() {
  requestAnimationFrame(animate)

  // Sub-step: multiple sim steps per RAF
  for (let s = 0; s < STEPS_PER_FRAME; s++) {
    eulerStep(grid, params)
  }

  // Render current state to canvas
  draw(grid.u)
}
animate()
</code></pre></div>`,
  init(container) {
    // Add D3 timeline diagram first
    import('d3').then(d3 => {
      const svg = d3.select(container)
        .append('svg')
        .attr('id', 'd3-sim')
        .attr('width', 500)
        .attr('height', 120)
        .style('display', 'block')
        .style('margin', '20px auto')

      // Timeline parameters
      const timelineWidth = 400
      const timelineHeight = 30
      const timelineX = 50
      const timelineY = 30
      const segments = 8

      // Draw main timeline bar
      svg.append('rect')
        .attr('x', timelineX)
        .attr('y', timelineY)
        .attr('width', timelineWidth)
        .attr('height', timelineHeight)
        .attr('fill', '#e0e0e0')
        .attr('stroke', '#999')
        .attr('stroke-width', 1)

      // Draw segment divisions
      for (let i = 1; i < segments; i++) {
        const x = timelineX + (i * timelineWidth / segments)
        svg.append('line')
          .attr('x1', x)
          .attr('y1', timelineY)
          .attr('x2', x)
          .attr('y2', timelineY + timelineHeight)
          .attr('stroke', '#999')
          .attr('stroke-width', 1)
      }

      // Label each segment
      for (let i = 0; i < segments; i++) {
        const x = timelineX + (i * timelineWidth / segments) + (timelineWidth / segments / 2)
        svg.append('text')
          .attr('x', x)
          .attr('y', timelineY + timelineHeight / 2 + 4)
          .attr('text-anchor', 'middle')
          .attr('font-family', 'SF Mono, monospace')
          .attr('font-size', '8px')
          .text(`step ${i + 1}`)
      }

      // Timeline label
      svg.append('text')
        .attr('x', timelineX + timelineWidth / 2)
        .attr('y', timelineY + timelineHeight + 20)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'SF Mono, monospace')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text('1 frame = 16.67ms wall time = 8 sim-time-units')

      // RAF callback arrow
      svg.append('path')
        .attr('d', `M ${timelineX - 20} ${timelineY + timelineHeight / 2} L ${timelineX - 5} ${timelineY + timelineHeight / 2}`)
        .attr('stroke', '#666')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)')

      svg.append('text')
        .attr('x', timelineX - 25)
        .attr('y', timelineY + timelineHeight / 2 + 4)
        .attr('text-anchor', 'end')
        .attr('font-family', 'SF Mono, monospace')
        .attr('font-size', '10px')
        .text('RAF')

      // Arrow marker definition
      const defs = svg.append('defs')
      defs.append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 9)
        .attr('refY', 3)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0 0 L 10 3 L 0 6 z')
        .attr('fill', '#666')
    })

    // Keep existing text panel below
    const el = document.createElement('div')
    el.style.cssText = 'padding:20px; font-family:SF Mono,monospace; font-size:9pt'
    el.innerHTML = `<pre style="border:none;background:none;line-height:1.8">
  ANIMATION LOOP STRUCTURE
  ════════════════════════

  browser
  ─────────────────────────────────────
  requestAnimationFrame(animate)
    │
    ├─ for s = 0..stepsPerFrame-1:
    │    eulerStep(grid, params)
    │    → reads from u[], v[]
    │    → writes to u2[], v2[]
    │    → swaps buffers
    │
    └─ draw(u) → ImageData → canvas

  timing:
  ─────────────────────────────────────
  1 frame ≈ 16.67ms at 60fps
  8 steps × 1.0 dt = 8 sim-time-units/frame
  60fps × 8 = 480 sim-time-units/second
  patterns form at ~5000 time-units
  → visible in ~10 seconds at 8 spf
</pre>`
    container.appendChild(el)
    return () => { container.innerHTML = '' }
  }
}
