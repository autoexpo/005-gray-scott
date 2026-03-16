/**
 * SeedShader — paint v=1, u=0 circles into the simulation via mouse/touch.
 */
import * as THREE from 'three'

const vertGLSL = /* glsl */`
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fragGLSL = /* glsl */`
  precision highp float;

  uniform sampler2D uState;
  uniform vec2 uMouse;    // UV coords [0..1]
  uniform float uRadius;  // in UV space
  uniform int uActive;    // 1 = paint, 0 = passthrough

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
`

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

  /**
   * Attach pointer event listeners to a canvas element.
   * @param {HTMLCanvasElement} canvas
   */
  attachTo(canvas) {
    const getUV = e => {
      const rect = canvas.getBoundingClientRect()
      // Flip Y: canvas Y=0 is top, UV Y=0 is bottom
      const x = (e.clientX - rect.left) / rect.width
      const y = 1.0 - (e.clientY - rect.top) / rect.height
      return { x, y }
    }

    canvas.addEventListener('pointerdown', e => {
      const { x, y } = getUV(e)
      this.material.uniforms.uMouse.value.set(x, y)
      this.material.uniforms.uActive.value = 1
      this._active = true
    })
    canvas.addEventListener('pointermove', e => {
      if (!this._active) return
      const { x, y } = getUV(e)
      this.material.uniforms.uMouse.value.set(x, y)
    })
    canvas.addEventListener('pointerup', () => {
      this.material.uniforms.uActive.value = 0
      this._active = false
    })
    canvas.addEventListener('pointerleave', () => {
      this.material.uniforms.uActive.value = 0
      this._active = false
    })
  }

  get isActive() {
    return this._active
  }

  /**
   * Run the seed pass. Reads from pingpong.read, writes seed into pingpong.write.
   * Call before the sim step when active.
   */
  render(renderer, readTarget, writeTarget) {
    this.material.uniforms.uState.value = readTarget.texture
    renderer.setRenderTarget(writeTarget)
    renderer.render(this.scene, this.camera)
    renderer.setRenderTarget(null)
  }

  dispose() {
    this.material.dispose()
    this.mesh.geometry.dispose()
  }
}
