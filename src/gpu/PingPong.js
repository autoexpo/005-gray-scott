/**
 * PingPong — two WebGLRenderTargets that alternate read/write roles.
 *
 * Pattern:
 *   each frame: read from .read, write to .write, then swap()
 */
import * as THREE from 'three'

export class PingPong {
  constructor(renderer, width, height) {
    this.renderer = renderer
    this.width = width
    this.height = height

    const opts = {
      type: THREE.FloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
      depthBuffer: false,
      stencilBuffer: false,
    }

    this._a = new THREE.WebGLRenderTarget(width, height, opts)
    this._b = new THREE.WebGLRenderTarget(width, height, opts)

    // read = source, write = destination
    this.read = this._a
    this.write = this._b
  }

  swap() {
    const tmp = this.read
    this.read = this.write
    this.write = tmp
  }

  /**
   * Initialize both buffers with a Float32Array of RGBA data.
   * data: Float32Array of length width*height*4
   */
  seed(data) {
    const tex = new THREE.DataTexture(
      data, this.width, this.height,
      THREE.RGBAFormat, THREE.FloatType
    )
    tex.needsUpdate = true

    // Copy into both render targets via renderer
    const mat = new THREE.MeshBasicMaterial({ map: tex })
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat)
    const scene = new THREE.Scene()
    scene.add(quad)
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    this.renderer.setRenderTarget(this._a)
    this.renderer.render(scene, cam)
    this.renderer.setRenderTarget(this._b)
    this.renderer.render(scene, cam)
    this.renderer.setRenderTarget(null)

    mat.dispose()
    quad.geometry.dispose()
    tex.dispose()
    scene.remove(quad)
  }

  dispose() {
    this._a.dispose()
    this._b.dispose()
  }

  get texture() {
    return this.read.texture
  }
}
