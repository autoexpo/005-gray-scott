/**
 * SimShader — Gray-Scott GPU compute shader via fragment pass.
 *
 * Encodes: R = u (food), G = v (activator)
 *
 * PDE:
 *   ∂u/∂t = Du·∇²u − u·v² + f·(1−u)
 *   ∂v/∂t = Dv·∇²v + u·v² − (f+k)·v
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

// 5-point Laplacian Gray-Scott compute shader
const fragGLSL_5pt = /* glsl */`
  precision highp float;

  uniform sampler2D uState;
  uniform vec2 uTexelSize;   // 1/width, 1/height
  uniform float uF;
  uniform float uK;
  uniform float uDu;
  uniform float uDv;
  uniform float uDt;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec4 center = texture2D(uState, uv);
    float u = center.r;
    float v = center.g;

    // 5-point Laplacian stencil
    float u_n = texture2D(uState, uv + vec2(0.0,  uTexelSize.y)).r;
    float u_s = texture2D(uState, uv + vec2(0.0, -uTexelSize.y)).r;
    float u_e = texture2D(uState, uv + vec2( uTexelSize.x, 0.0)).r;
    float u_w = texture2D(uState, uv + vec2(-uTexelSize.x, 0.0)).r;

    float v_n = texture2D(uState, uv + vec2(0.0,  uTexelSize.y)).g;
    float v_s = texture2D(uState, uv + vec2(0.0, -uTexelSize.y)).g;
    float v_e = texture2D(uState, uv + vec2( uTexelSize.x, 0.0)).g;
    float v_w = texture2D(uState, uv + vec2(-uTexelSize.x, 0.0)).g;

    float lapU = u_n + u_s + u_e + u_w - 4.0 * u;
    float lapV = v_n + v_s + v_e + v_w - 4.0 * v;

    // Gray-Scott reaction
    float uvv = u * v * v;
    float du = uDu * lapU - uvv + uF * (1.0 - u);
    float dv = uDv * lapV + uvv - (uF + uK) * v;

    // Euler step
    float newU = clamp(u + uDt * du, 0.0, 1.0);
    float newV = clamp(v + uDt * dv, 0.0, 1.0);

    gl_FragColor = vec4(newU, newV, 0.0, 1.0);
  }
`

// 9-point isotropic Laplacian variant
const fragGLSL_9pt = /* glsl */`
  precision highp float;

  uniform sampler2D uState;
  uniform vec2 uTexelSize;
  uniform float uF;
  uniform float uK;
  uniform float uDu;
  uniform float uDv;
  uniform float uDt;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec4 center = texture2D(uState, uv);
    float u = center.r;
    float v = center.g;

    vec2 dx = vec2(uTexelSize.x, 0.0);
    vec2 dy = vec2(0.0, uTexelSize.y);

    // Cardinal neighbors (weight 1/6 each, total 4/6)
    float uN = texture2D(uState, uv + dy).r;
    float uS = texture2D(uState, uv - dy).r;
    float uE = texture2D(uState, uv + dx).r;
    float uW = texture2D(uState, uv - dx).r;

    // Diagonal neighbors (weight 1/12 each, total 4/12)
    float uNE = texture2D(uState, uv + dx + dy).r;
    float uNW = texture2D(uState, uv - dx + dy).r;
    float uSE = texture2D(uState, uv + dx - dy).r;
    float uSW = texture2D(uState, uv - dx - dy).r;

    float lapU = (1.0/6.0)*(uN+uS+uE+uW)
               + (1.0/12.0)*(uNE+uNW+uSE+uSW)
               - (5.0/6.0)*u;

    float vN = texture2D(uState, uv + dy).g;
    float vS = texture2D(uState, uv - dy).g;
    float vE = texture2D(uState, uv + dx).g;
    float vW = texture2D(uState, uv - dx).g;
    float vNE = texture2D(uState, uv + dx + dy).g;
    float vNW = texture2D(uState, uv - dx + dy).g;
    float vSE = texture2D(uState, uv + dx - dy).g;
    float vSW = texture2D(uState, uv - dx - dy).g;

    float lapV = (1.0/6.0)*(vN+vS+vE+vW)
               + (1.0/12.0)*(vNE+vNW+vSE+vSW)
               - (5.0/6.0)*v;

    float uvv = u * v * v;
    float du = uDu * lapU - uvv + uF * (1.0 - u);
    float dv = uDv * lapV + uvv - (uF + uK) * v;

    float newU = clamp(u + uDt * du, 0.0, 1.0);
    float newV = clamp(v + uDt * dv, 0.0, 1.0);

    gl_FragColor = vec4(newU, newV, 0.0, 1.0);
  }
`

export class SimShader {
  constructor(stencil = '5pt') {
    const frag = stencil === '9pt' ? fragGLSL_9pt : fragGLSL_5pt

    this.material = new THREE.RawShaderMaterial({
      vertexShader: vertGLSL,
      fragmentShader: frag,
      uniforms: {
        uState:     { value: null },
        uTexelSize: { value: new THREE.Vector2(1/256, 1/256) },
        uF:         { value: 0.055 },
        uK:         { value: 0.062 },
        uDu:        { value: 0.2097 },
        uDv:        { value: 0.105 },
        uDt:        { value: 1.0 },
      },
      depthTest: false,
      depthWrite: false,
    })

    // Full-screen quad
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(
      new Float32Array([-1,-1, 1,-1, -1,1, 1,-1, 1,1, -1,1]), 2
    ))
    this.mesh = new THREE.Mesh(geo, this.material)

    this.scene = new THREE.Scene()
    this.scene.add(this.mesh)
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  }

  update(params) {
    const u = this.material.uniforms
    if (params.f    !== undefined) u.uF.value = params.f
    if (params.k    !== undefined) u.uK.value = params.k
    if (params.Du   !== undefined) u.uDu.value = params.Du
    if (params.Dv   !== undefined) u.uDv.value = params.Dv
    if (params.dt   !== undefined) u.uDt.value = params.dt
    if (params.size !== undefined) {
      u.uTexelSize.value.set(1/params.size, 1/params.size)
    }
  }

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
