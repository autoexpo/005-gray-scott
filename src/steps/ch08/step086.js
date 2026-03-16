/**
 * Step 86: 3D Surface: Vertex Displacement by U
 * Maps simulation U field to vertex heights — "chemical landscape".
 */
import * as THREE from 'three'
import Stats from 'stats.js'
import { GPUSim } from '../../gpu/GPUSim.js'
import { PRESETS } from '../../presets/parameters.js'
import { GuiManager } from '../../gui/GuiManager.js'

export default {
  title: '3D Surface: Vertex Displacement',
  chapter: 8,

  math: `<div class="math-section"><h3>3D Surface Displacement</h3>
<p>Map U(x,y) to vertex height Z in a Three.js PlaneGeometry.</p>
<div class="math-block">$$z(x,y) = A \\cdot (1 - U(x,y))$$</div>
<p>Regions of high V (low U) — the pattern — are elevated; the background (high U) is flat.
This creates a "chemical landscape" that evolves in real time.</p>
</div>
<div class="math-section"><h3>GPU Readback</h3>
<p>To displace vertices on the CPU, we must read back the simulation texture from the GPU.
renderer.readRenderTargetPixels() downloads the float data each frame — expensive but manageable for 64×64.</p>
<p>Alternative: use a vertex shader that samples the simulation texture directly (no readback needed).
This keeps everything on the GPU.</p>
</div>`,

  code: `<div class="code-section"><h3>Vertex Displacement</h3>
<pre><code class="language-js">// After each sim step, update mesh vertices:
const pixels = new Float32Array(res * res * 4)
renderer.readRenderTargetPixels(sim.pp.read, 0, 0, res, res, pixels)

const pos = geometry.attributes.position
for (let i = 0; i < res * res; i++) {
  const u = pixels[i * 4]    // R channel = u
  pos.setZ(i, (1 - u) * 30)  // height = 30 * (1-u)
}
pos.needsUpdate = true
geometry.computeVertexNormals()
</code></pre></div>`,

  init(container, state) {
    const res = 64  // small grid for fast readback
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    // Stats
    const stats = new Stats()
    stats.dom.style.cssText = 'position:absolute;top:4px;left:4px;'
    container.appendChild(stats.dom)
    container.style.position = 'relative'

    // 3D scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 500)
    camera.position.set(0, -120, 80)
    camera.lookAt(0, 0, 0)

    // Plane geometry for the surface
    const geometry = new THREE.PlaneGeometry(100, 100, res-1, res-1)
    const material = new THREE.MeshNormalMaterial({ wireframe: false, side: THREE.DoubleSide })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Ambient and directional light
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(50, 50, 100)
    scene.add(dirLight)

    // GPU simulation (on the same renderer)
    const sim = new GPUSim(renderer, res, '5pt')
    const params = { ...PRESETS.spots }
    sim.reset(params)

    // Readback buffer
    const pixels = new Float32Array(res * res * 4)

    // GUI
    const gui = GuiManager.create(container)
    const pf = gui.addFolder('Params')
    pf.add(params, 'f', 0.01, 0.12, 0.001)
    pf.add(params, 'k', 0.04, 0.075, 0.001)
    pf.open()

    const ro = new ResizeObserver(() => {
      renderer.setSize(container.clientWidth, container.clientHeight)
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
    })
    ro.observe(container)

    let animId, t = 0
    const animate = () => {
      animId = requestAnimationFrame(animate)
      stats.begin()

      // Sim step
      sim.step(params, 4)

      // Read back U values
      renderer.readRenderTargetPixels(sim.pp.read, 0, 0, res, res, pixels)

      // Update mesh vertices
      const pos = geometry.attributes.position
      for (let i = 0; i < res * res; i++) {
        const u = pixels[i * 4]
        pos.setZ(i, (1 - u) * 25)
      }
      pos.needsUpdate = true
      geometry.computeVertexNormals()

      // Rotate slowly
      mesh.rotation.z = t * 0.001
      t++

      renderer.setRenderTarget(null)
      renderer.render(scene, camera)
      stats.end()
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      sim.dispose()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      container.innerHTML = ''
    }
  }
}
