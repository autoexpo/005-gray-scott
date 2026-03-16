/**
 * Step 57: Mouse Interaction — Drawing V
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Mouse Interaction — Drawing V',
  chapter: 5,

  math: `
<div class="math-section">
  <h3>Mouse Seeding — Painting V=1, U=0 in Circular Brush</h3>
  <p>Interactive seeding allows manual placement of initial conditions. By clicking
  and dragging on the simulation canvas, you paint circular regions where V=1 and U=0.
  These seeds then evolve according to the Gray-Scott dynamics.</p>
</div>

<div class="math-section">
  <h3>Seed Radius and Pattern Nucleation</h3>
  <p>The brush radius determines the size of the initial seed. Different radii
  produce different nucleation behaviors:</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li><strong>Small radius (< 2 pixels):</strong> May not survive to form patterns</li>
    <li><strong>Medium radius (3-8 pixels):</strong> Optimal for pattern nucleation</li>
    <li><strong>Large radius (> 10 pixels):</strong> Creates multiple competing centers</li>
  </ul>
</div>

<div class="math-section">
  <h3>Why Drawing Different Shapes Produces Different Outcomes</h3>
  <p>The seed geometry affects the resulting pattern:</p>
  <ul style="margin-left:16px; line-height:1.9">
    <li><strong>Circular seeds:</strong> Radially symmetric growth</li>
    <li><strong>Linear seeds:</strong> Perpendicular pattern growth</li>
    <li><strong>Multiple dots:</strong> Competing growth centers</li>
    <li><strong>Connected lines:</strong> Template for stripe patterns</li>
  </ul>
</div>

<div class="math-section">
  <h3>Role of Seed Geometry in Final Pattern Selection</h3>
  <p>Initial conditions can bias the system toward specific attractors. In
  multistable parameter regimes, careful seeding can select between coexisting
  pattern types (e.g., spots vs stripes).</p>
</div>
`,

  code: `
<div class="code-section">
  <h3>SeedShader Mechanism — Mouse to GPU Pipeline</h3>
<pre><code class="language-js">// How mouse position becomes GPU uniform
class MouseToGPU {
  constructor(canvas, seedShader) {
    this.canvas = canvas
    this.seedShader = seedShader
    this.isDrawing = false
    
    this.setupEventListeners()
  }

  setupEventListeners() {
    // Pointer events for mouse/touch support
    this.canvas.addEventListener('pointerdown', e => {
      this.isDrawing = true
      this.updateMousePosition(e)
      this.seedShader.activate()
    })

    this.canvas.addEventListener('pointermove', e => {
      if (this.isDrawing) {
        this.updateMousePosition(e)
      }
    })

    this.canvas.addEventListener('pointerup', e => {
      this.isDrawing = false
      this.seedShader.deactivate()
    })
  }

  updateMousePosition(event) {
    const rect = this.canvas.getBoundingClientRect()
    
    // Convert screen coordinates to normalized UV coordinates
    const x = (event.clientX - rect.left) / rect.width
    const y = 1.0 - (event.clientY - rect.top) / rect.height // flip Y
    
    // Pass to seed shader as uniform
    this.seedShader.setMousePosition(x, y)
  }
}
</code></pre>
</div>

<div class="code-section">
  <h3>GPU Brush Shader Logic</h3>
<pre><code class="language-js">// Fragment shader for painting seeds (conceptual)
const seedFragmentShader = \`
uniform sampler2D uState;     // current simulation state
uniform vec2 uMouse;          // mouse position in UV coordinates
uniform float uRadius;       // brush radius
uniform int uActive;         // 1 = painting, 0 = passthrough

varying vec2 vUv;

void main() {
  vec4 currentState = texture2D(uState, vUv);
  
  if (uActive == 1) {
    float distance = distance(vUv, uMouse);
    
    if (distance < uRadius) {
      // Paint the seed: V=1, U=0
      gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    } else {
      // Pass through unchanged
      gl_FragColor = currentState;
    }
  } else {
    gl_FragColor = currentState;
  }
}
\`

// The GPU processes all N² pixels in parallel
// Distance calculation and conditional assignment happen simultaneously
</code></pre>
</div>

<div class="code-section">
  <h3>Mouse Event Handling — Screen to UV Coordinates</h3>
<pre><code class="language-js">// Convert mouse coordinates for GPU consumption
function screenToUV(event, canvas) {
  const rect = canvas.getBoundingClientRect()
  
  // Get pixel coordinates relative to canvas
  const canvasX = event.clientX - rect.left
  const canvasY = event.clientY - rect.top
  
  // Convert to normalized UV coordinates [0,1]
  const u = canvasX / rect.width
  let v = canvasY / rect.height
  
  // Flip V coordinate (screen Y=0 at top, UV Y=0 at bottom)
  v = 1.0 - v
  
  // Clamp to valid range
  return {
    u: Math.max(0, Math.min(1, u)),
    v: Math.max(0, Math.min(1, v))
  }
}

// Usage in event handler:
canvas.addEventListener('mousemove', e => {
  if (isDrawing) {
    const { u, v } = screenToUV(e, canvas)
    seedShader.uniforms.uMouse.value.set(u, v)
  }
})
</code></pre>
</div>
`,

  init(container) {
    return startGPULoop(container, {
      params: { ...PRESETS.spots },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'bw',
      mouse: true,
      showGui: true,
    })
  }
}
