/**
 * Detect WebGL capabilities needed for float-texture simulation.
 */

let _result = null

export function checkCapabilities() {
  if (_result) return _result

  const canvas = document.createElement('canvas')

  // Try WebGL2 first
  let gl = canvas.getContext('webgl2')
  if (gl) {
    const ext = gl.getExtension('EXT_color_buffer_float')
    _result = {
      webgl2: true,
      webgl1: true,
      floatTextures: true,
      floatFramebuffer: !!ext,
      halfFloatTextures: true,
      version: 'WebGL2',
    }
    return _result
  }

  // Fall back to WebGL1
  gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  if (!gl) {
    _result = {
      webgl2: false, webgl1: false,
      floatTextures: false, floatFramebuffer: false,
      halfFloatTextures: false,
      version: 'none',
    }
    return _result
  }

  const floatExt = gl.getExtension('OES_texture_float')
  const halfFloatExt = gl.getExtension('OES_texture_half_float')
  const fbExt = gl.getExtension('WEBGL_color_buffer_float')

  _result = {
    webgl2: false,
    webgl1: true,
    floatTextures: !!floatExt,
    floatFramebuffer: !!fbExt,
    halfFloatTextures: !!halfFloatExt,
    version: 'WebGL1',
  }
  return _result
}

export function hasGPUSimulation() {
  const c = checkCapabilities()
  return c.webgl1 && c.floatTextures
}
