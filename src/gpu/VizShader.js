/**
 * VizShader — maps (u,v) simulation texture to display color.
 *
 * Modes: grayscale (u), invert (1-u), dual (u+v mix),
 *        contour, edge (Sobel), false-color (b&w gradient).
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
  uniform vec2 uTexelSize;
  uniform int uMode;        // 0=gray, 1=invert, 2=dual, 3=contour, 4=edge

  varying vec2 vUv;

  // Sobel edge detection on u channel
  float sobel() {
    vec2 s = uTexelSize;
    float tl = texture2D(uState, vUv + vec2(-s.x,  s.y)).r;
    float tm = texture2D(uState, vUv + vec2( 0.0,  s.y)).r;
    float tr = texture2D(uState, vUv + vec2( s.x,  s.y)).r;
    float ml = texture2D(uState, vUv + vec2(-s.x,  0.0)).r;
    float mr = texture2D(uState, vUv + vec2( s.x,  0.0)).r;
    float bl = texture2D(uState, vUv + vec2(-s.x, -s.y)).r;
    float bm = texture2D(uState, vUv + vec2( 0.0, -s.y)).r;
    float br = texture2D(uState, vUv + vec2( s.x, -s.y)).r;
    float gx = -tl - 2.0*ml - bl + tr + 2.0*mr + br;
    float gy = -tl - 2.0*tm - tr + bl + 2.0*bm + br;
    return clamp(sqrt(gx*gx + gy*gy) * 4.0, 0.0, 1.0);
  }

  // Contour lines at fixed iso-values
  float contour(float val) {
    float lines = 8.0;
    float c = fract(val * lines);
    return step(0.05, c) * step(c, 0.95);
  }

  void main() {
    vec4 s = texture2D(uState, vUv);
    float u = s.r;
    float v = s.g;
    float c;

    if (uMode == 0) {
      // grayscale: high u = white (food = white, pattern = dark)
      c = u;
    } else if (uMode == 1) {
      // invert
      c = 1.0 - u;
    } else if (uMode == 2) {
      // dual: u in [0..0.5] range, v offset
      c = u * 0.6 + v * 0.4;
    } else if (uMode == 3) {
      // contour
      c = contour(u);
    } else if (uMode == 4) {
      // Sobel edge
      c = sobel();
    } else {
      c = u;
    }

    gl_FragColor = vec4(c, c, c, 1.0);
  }
`

export class VizShader {
  constructor() {
    this.material = new THREE.RawShaderMaterial({
      vertexShader: vertGLSL,
      fragmentShader: fragGLSL,
      uniforms: {
        uState:     { value: null },
        uTexelSize: { value: new THREE.Vector2(1/256, 1/256) },
        uMode:      { value: 0 },
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
  }

  setMode(mode) {
    const modes = { grayscale: 0, invert: 1, dual: 2, contour: 3, edge: 4 }
    this.material.uniforms.uMode.value = modes[mode] ?? 0
  }

  setTexelSize(w, h) {
    this.material.uniforms.uTexelSize.value.set(1/w, 1/h)
  }

  render(renderer, simTexture) {
    this.material.uniforms.uState.value = simTexture
    renderer.setRenderTarget(null)
    renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.material.dispose()
    this.mesh.geometry.dispose()
  }
}
