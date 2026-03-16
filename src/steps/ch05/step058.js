/**
 * Step 58: Seeding Shader — GPU-Side Paint
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Seeding Shader — GPU-Side Paint',
  chapter: 5,

  math: \`
<div class="math-section">
  <h3>GPU-Side Seeding: Uniform-Driven Brush</h3>
  <p>The seeding operation happens entirely on the GPU. Mouse position (x,y) and
  brush radius r are passed as GLSL uniforms. For each fragment, the shader
  computes distance(texCoord, mousePos) and conditionally writes (u=0, v=1)
  if the distance is less than the brush radius.</p>
</div>

<div class="math-section">
  <h3>Parallel Processing: O(1) Regardless of Brush Size</h3>
  <p>GPU fragment shaders process all N² pixels simultaneously. The seeding
  operation completes in one pass with constant time complexity O(1), regardless
  of brush size. This is fundamentally different from CPU approaches.</p>
</div>

<div class="math-section">
  <h3>CPU Seeding Alternative: O(r²) Updates</h3>
  <p>A CPU implementation would require nested loops:</p>
  <div class="math-block">$$\\text{CPU time} \\propto \\pi r^2$$</div>
  <p>For large brushes, this becomes prohibitively expensive. GPU seeding
  remains O(1) even for brushes covering the entire canvas.</p>
</div>

<div class="math-section">
  <h3>Seed Shader Compositing</h3>
  <p>The seeding shader runs as a separate pass that composites on top of the
  simulation state. The render pipeline becomes:</p>
  <ol style="margin-left:16px; line-height:1.9">
    <li>Simulation step: evolve according to Gray-Scott PDE</li>
    <li>Seed pass: apply mouse painting (if active)</li>
    <li>Visualization: render final state to canvas</li>
  </ol>
</div>
\`,

  code: \`
<div class="code-section">
  <h3>SeedShader.js Contents — Complete Implementation</h3>
<pre><code class="language-js">/**
 * SeedShader — paint v=1, u=0 circles into the simulation via mouse/touch.
 */
import * as THREE from 'three'

const vertGLSL = /* glsl */\`
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
\`

const fragGLSL = /* glsl */\`
  precision highp float;

  uniform sampler2D uState;   // current simulation state
  uniform vec2 uMouse;        // UV coords [0..1]
  uniform float uRadius;      // brush radius in UV space
  uniform int uActive;        // 1 = paint, 0 = passthrough

  varying vec2 vUv;

  void main() {
    vec4 s = texture2D(uState, vUv);
    
    if (uActive == 1) {
      float d = distance(vUv, uMouse);
      if (d < uRadius) {
        // Seed: set v=1, u=0 in painted region
        s = vec4(0.0, 1.0, 0.0, 1.0);
      }
    }
    
    gl_FragColor = s;
  }
\`

export class SeedShader {
  constructor() {
    this.material = new THREE.RawShaderMaterial({
      vertexShader: vertGLSL,
      fragmentShader: fragGLSL,
      uniforms: {
        uState:   { value: null },
        uMouse:   { value: new THREE.Vector2(0.5, 0.5) },
        uRadius:  { value: 0.04 },
        uActive:  { value: 0 },
      },
      depthTest: false,
      depthWrite: false,
    })

    // Full-screen quad geometry
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(
      new Float32Array([-1,-1, 1,-1, -1,1, 1,-1, 1,1, -1,1]), 2
    ))
    
    this.mesh = new THREE.Mesh(geo, this.material)
    this.scene = new THREE.Scene()
    this.scene.add(this.mesh)
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    this._active = false
  }

  // ... (attachTo, render, dispose methods as shown in source)
}
</code></pre>
</div>

<div class="code-section">
  <h3>Annotated Shader Components</h3>
<pre><code class="language-js">// Vertex shader: creates full-screen quad
// Maps vertex positions [-1,1] to UV coordinates [0,1]
const vertGLSL = \`
  attribute vec2 position;     // vertex position in clip space
  varying vec2 vUv;           // output UV coordinate to fragment shader
  
  void main() {
    vUv = position * 0.5 + 0.5;  // [-1,1] → [0,1] mapping
    gl_Position = vec4(position, 0.0, 1.0);
  }
\`

// Fragment shader: per-pixel seeding logic
const fragGLSL = \`
  uniform sampler2D uState;    // reads current (U,V) state
  uniform vec2 uMouse;         // mouse position in UV space
  uniform float uRadius;       // brush size
  uniform int uActive;         // paint mode toggle
  
  varying vec2 vUv;           // UV coordinate of current pixel
  
  void main() {
    vec4 currentState = texture2D(uState, vUv);
    
    if (uActive == 1) {
      // Compute distance from current pixel to mouse
      float distanceToMouse = distance(vUv, uMouse);
      
      if (distanceToMouse < uRadius) {
        // Inside brush radius: seed the pattern
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);  // U=0, V=1
      } else {
        // Outside brush: pass through unchanged
        gl_FragColor = currentState;
      }
    } else {
      // Not painting: pass through
      gl_FragColor = currentState;
    }
  }
\`
</code></pre>
</div>

<div class="code-section">
  <h3>Integration with Simulation Loop</h3>
<pre><code class="language-js">// How seeding integrates with the main simulation loop
class GPUSim {
  constructor(renderer, size, stencil) {
    this.sim = new SimShader(size, stencil)
    this.viz = new VizShader(size)
    this.seed = new SeedShader()        // ← seeding capability
    this.pingpong = new PingPong(renderer, size)
    
    // Attach mouse events to canvas
    // this.seed.attachTo(canvas) called from gpuLoop.js
  }

  step(params, steps) {
    for (let i = 0; i < steps; i++) {
      // 1. Apply seeding if mouse is active
      if (this.seed.isActive) {
        this.seed.render(this.renderer, this.pingpong.read, this.pingpong.write)
        this.pingpong.swap()
      }

      // 2. Run Gray-Scott simulation step
      this.sim.render(this.renderer, this.pingpong.read, this.pingpong.write, params)
      this.pingpong.swap()
    }
  }

  render(vizMode) {
    // 3. Visualize the result
    this.viz.render(this.renderer, this.pingpong.read, null, vizMode)
  }
}
</code></pre>
</div>
\`,

  init(container) {
    return startGPULoop(container, {
      params: { ...PRESETS.stripes },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'bw',
      mouse: true,
      showGui: true,
    })
  }
}
