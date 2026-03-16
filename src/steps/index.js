/**
 * Step registry — lazy imports all 100 step modules.
 * Each step is loaded on demand via dynamic import to keep initial bundle small.
 */

// Map step index (0-based) to module path
const STEP_PATHS = {
  0:  () => import('./ch01/step001.js'),
  1:  () => import('./ch01/step002.js'),
  2:  () => import('./ch01/step003.js'),
  3:  () => import('./ch01/step004.js'),
  4:  () => import('./ch01/step005.js'),
  5:  () => import('./ch01/step006.js'),
  6:  () => import('./ch01/step007.js'),
  7:  () => import('./ch01/step008.js'),
  8:  () => import('./ch02/step009.js'),
  9:  () => import('./ch02/step010.js'),
  10: () => import('./ch02/step011.js'),
  11: () => import('./ch02/step012.js'),
  12: () => import('./ch02/step013.js'),
  13: () => import('./ch02/step014.js'),
  14: () => import('./ch02/step015.js'),
  15: () => import('./ch02/step016.js'),
  16: () => import('./ch02/step017.js'),
  17: () => import('./ch02/step018.js'),
  18: () => import('./ch03/step019.js'),
  19: () => import('./ch03/step020.js'),
  20: () => import('./ch03/step021.js'),
  21: () => import('./ch03/step022.js'),
  22: () => import('./ch03/step023.js'),
  23: () => import('./ch03/step024.js'),
  24: () => import('./ch03/step025.js'),
  25: () => import('./ch03/step026.js'),
  26: () => import('./ch03/step027.js'),
  27: () => import('./ch03/step028.js'),
  28: () => import('./ch03/step029.js'),
  29: () => import('./ch03/step030.js'),
  30: () => import('./ch04/step031.js'),
  31: () => import('./ch04/step032.js'),
  32: () => import('./ch04/step033.js'),
  33: () => import('./ch04/step034.js'),
  34: () => import('./ch04/step035.js'),
  35: () => import('./ch04/step036.js'),
  36: () => import('./ch04/step037.js'),
  37: () => import('./ch04/step038.js'),
  38: () => import('./ch04/step039.js'),
  39: () => import('./ch04/step040.js'),
  40: () => import('./ch04/step041.js'),
  41: () => import('./ch04/step042.js'),
  42: () => import('./ch04/step043.js'),
  43: () => import('./ch04/step044.js'),
  44: () => import('./ch04/step045.js'),
  45: () => import('./ch05/step046.js'),
  46: () => import('./ch05/step047.js'),
  47: () => import('./ch05/step048.js'),
  48: () => import('./ch05/step049.js'),
  49: () => import('./ch05/step050.js'),
  50: () => import('./ch05/step051.js'),
  51: () => import('./ch05/step052.js'),
  52: () => import('./ch05/step053.js'),
  53: () => import('./ch05/step054.js'),
  54: () => import('./ch05/step055.js'),
  55: () => import('./ch05/step056.js'),
  56: () => import('./ch05/step057.js'),
  57: () => import('./ch05/step058.js'),
  58: () => import('./ch06/step059.js'),
  59: () => import('./ch06/step060.js'),
  60: () => import('./ch06/step061.js'),
  61: () => import('./ch06/step062.js'),
  62: () => import('./ch06/step063.js'),
  63: () => import('./ch06/step064.js'),
  64: () => import('./ch06/step065.js'),
  65: () => import('./ch06/step066.js'),
  66: () => import('./ch06/step067.js'),
  67: () => import('./ch06/step068.js'),
  68: () => import('./ch06/step069.js'),
  69: () => import('./ch06/step070.js'),
  70: () => import('./ch07/step071.js'),
  71: () => import('./ch07/step072.js'),
  72: () => import('./ch07/step073.js'),
  73: () => import('./ch07/step074.js'),
  74: () => import('./ch07/step075.js'),
  75: () => import('./ch07/step076.js'),
  76: () => import('./ch07/step077.js'),
  77: () => import('./ch07/step078.js'),
  78: () => import('./ch07/step079.js'),
  79: () => import('./ch07/step080.js'),
  80: () => import('./ch08/step081.js'),
  81: () => import('./ch08/step082.js'),
  82: () => import('./ch08/step083.js'),
  83: () => import('./ch08/step084.js'),
  84: () => import('./ch08/step085.js'),
  85: () => import('./ch08/step086.js'),
  86: () => import('./ch08/step087.js'),
  87: () => import('./ch08/step088.js'),
  88: () => import('./ch08/step089.js'),
  89: () => import('./ch08/step090.js'),
  90: () => import('./ch09/step091.js'),
  91: () => import('./ch09/step092.js'),
  92: () => import('./ch09/step093.js'),
  93: () => import('./ch09/step094.js'),
  94: () => import('./ch09/step095.js'),
  95: () => import('./ch09/step096.js'),
  96: () => import('./ch09/step097.js'),
  97: () => import('./ch09/step098.js'),
  98: () => import('./ch09/step099.js'),
  99: () => import('./ch09/step100.js'),
}

const _cache = {}

/**
 * Load a step module by 0-based index.
 * Returns the default export (step config object).
 */
export async function loadStep(idx) {
  if (_cache[idx]) return _cache[idx]
  const loader = STEP_PATHS[idx]
  if (!loader) throw new Error(`No step at index ${idx}`)
  const mod = await loader()
  _cache[idx] = mod.default
  return mod.default
}

export const TOTAL = 100
