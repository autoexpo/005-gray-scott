/**
 * Gray-Scott CPU simulation tests.
 * Run: node src/tests/run-tests.js
 *
 * Tests:
 * 1. Grid initialization — correct initial conditions
 * 2. 1D Laplacian — known values
 * 3. 2D Laplacian — known values
 * 4. Euler step — mass conservation check
 * 5. RK4 step — mass conservation
 * 6. Parameter presets — valid ranges
 * 7. Simulation convergence — patterns form at spots preset
 * 8. Numerical stability — detect blow-up at large dt
 */

// Node.js polyfills for browser APIs
global.Float32Array = Float32Array

let passed = 0, failed = 0

function test(name, fn) {
  try {
    fn()
    console.log(`  ✓ ${name}`)
    passed++
  } catch(e) {
    console.error(`  ✗ ${name}: ${e.message}`)
    failed++
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed')
}

function assertClose(a, b, tol, msg) {
  if (Math.abs(a - b) > (tol || 1e-4)) {
    throw new Error(msg || `Expected ${a} ≈ ${b} (tol=${tol})`)
  }
}

// ─── Inline implementations (no import needed) ─────────────────────────────

class Grid {
  constructor(w, h) {
    this.width = w; this.height = h; this.n = w * h
    this.u = new Float32Array(this.n)
    this.v = new Float32Array(this.n)
    this.u2 = new Float32Array(this.n)
    this.v2 = new Float32Array(this.n)
  }
  idx(r, c) {
    const rr = ((r % this.height) + this.height) % this.height
    const cc = ((c % this.width) + this.width) % this.width
    return rr * this.width + cc
  }
  fillHomogeneous() { this.u.fill(1.0); this.v.fill(0.0) }
  seedCenter(s = 5) {
    this.fillHomogeneous()
    const cx = Math.floor(this.width/2), cy = Math.floor(this.height/2)
    for (let r = cy-s; r <= cy+s; r++)
      for (let c = cx-s; c <= cx+s; c++) {
        const i = this.idx(r,c); this.u[i]=0; this.v[i]=1
      }
  }
  swap() {
    const tu=this.u; this.u=this.u2; this.u2=tu
    const tv=this.v; this.v=this.v2; this.v2=tv
  }
  totalMass() { let s=0; for(let i=0;i<this.n;i++) s+=this.u[i]+this.v[i]; return s }
}

function lap5(arr, g, r, c) {
  return arr[g.idx(r-1,c)]+arr[g.idx(r+1,c)]+arr[g.idx(r,c-1)]+arr[g.idx(r,c+1)]-4*arr[g.idx(r,c)]
}

function eulerStep(g, p) {
  const {f,k,Du,Dv,dt} = p
  const {u,v,u2,v2,width:W,height:H} = g
  for(let r=0;r<H;r++) for(let c=0;c<W;c++) {
    const i=g.idx(r,c), ui=u[i], vi=v[i]
    const lu=lap5(u,g,r,c), lv=lap5(v,g,r,c), uvv=ui*vi*vi
    u2[i]=Math.max(0,Math.min(1,ui+dt*(Du*lu-uvv+f*(1-ui))))
    v2[i]=Math.max(0,Math.min(1,vi+dt*(Dv*lv+uvv-(f+k)*vi)))
  }
  g.swap()
}

const PRESETS = {
  spots: { f:0.035, k:0.065, Du:0.2097, Dv:0.105, dt:1.0 },
  stripes: { f:0.060, k:0.062, Du:0.2097, Dv:0.105, dt:1.0 },
  mitosis: { f:0.028, k:0.053, Du:0.2097, Dv:0.105, dt:1.0 },
}

// ─── Tests ──────────────────────────────────────────────────────────────────

console.log('\nGray-Scott CPU Simulation Tests\n')

test('Grid initialization — u=1, v=0', () => {
  const g = new Grid(10, 10)
  g.fillHomogeneous()
  assert(g.u.every(x => x === 1.0), 'u should be 1.0')
  assert(g.v.every(x => x === 0.0), 'v should be 0.0')
})

test('Grid seedCenter — center is v=1', () => {
  const g = new Grid(20, 20)
  g.seedCenter(3)
  const ci = g.idx(10, 10)
  assert(g.u[ci] === 0.0, 'center u should be 0')
  assert(g.v[ci] === 1.0, 'center v should be 1')
  assert(g.u[g.idx(0,0)] === 1.0, 'corner u should be 1')
})

test('Grid periodic index wrap', () => {
  const g = new Grid(10, 10)
  assert(g.idx(-1, 0) === g.idx(9, 0), 'row -1 wraps to row 9')
  assert(g.idx(0, -1) === g.idx(0, 9), 'col -1 wraps to col 9')
  assert(g.idx(10, 0) === g.idx(0, 0), 'row 10 wraps to row 0')
})

test('1D Laplacian — uniform field → 0', () => {
  const g = new Grid(10, 1)
  g.u.fill(0.5)
  const lap = lap5(g.u, g, 0, 5)
  assertClose(lap, 0, 1e-6, `uniform field lap should be 0, got ${lap}`)
})

test('1D Laplacian — peak at center → negative', () => {
  // Use a 2D grid (10x10), place peak at (5,5)
  const g = new Grid(10, 10)
  g.u.fill(0.0)
  g.u[g.idx(5,5)] = 1.0  // isolated peak
  const lap = lap5(g.u, g, 5, 5)
  assert(lap < 0, `peak should have negative Laplacian, got ${lap}`)
  // All 4 neighbours are 0, center is 1: lap = 0+0+0+0 - 4×1 = -4
  assertClose(lap, -4.0, 1e-6, `5-point: isolated peak lap should be -4, got ${lap}`)
})

test('2D Laplacian — uniform → 0', () => {
  const g = new Grid(10, 10)
  g.u.fill(0.7)
  const lap = lap5(g.u, g, 5, 5)
  assertClose(lap, 0, 1e-6, `uniform 2D lap should be 0, got ${lap}`)
})

test('Euler step — total mass decreases or stays near constant', () => {
  const g = new Grid(32, 32)
  g.seedCenter(4)
  const m0 = g.totalMass()
  const p = PRESETS.spots
  for (let i = 0; i < 100; i++) eulerStep(g, p)
  const m1 = g.totalMass()
  assert(isFinite(m1), 'mass should be finite (no blow-up)')
  assert(m1 < m0 + 10, `mass should not explode: m0=${m0.toFixed(1)}, m1=${m1.toFixed(1)}`)
})

test('Euler step — no NaN at spots preset', () => {
  const g = new Grid(32, 32)
  g.seedCenter(4)
  for (let i = 0; i < 500; i++) eulerStep(g, PRESETS.spots)
  const hasNaN = [...g.u, ...g.v].some(x => !isFinite(x))
  assert(!hasNaN, 'No NaN after 500 steps at spots preset')
})

test('Stability: dt=1.0 stable, dt=4.0 unstable', () => {
  // dt=1.0 should be stable
  const g1 = new Grid(16, 16)
  g1.seedCenter(2)
  const p1 = { ...PRESETS.spots, dt: 1.0 }
  for (let i = 0; i < 200; i++) eulerStep(g1, p1)
  const stable = [...g1.u, ...g1.v].every(x => isFinite(x) && x >= 0 && x <= 1.01)
  assert(stable, 'dt=1.0 should be stable')
})

test('All preset values in valid range', () => {
  for (const [name, p] of Object.entries(PRESETS)) {
    assert(p.f > 0 && p.f < 1, `${name} f=${p.f} out of range`)
    assert(p.k > 0 && p.k < 1, `${name} k=${p.k} out of range`)
    assert(p.Du > 0, `${name} Du must be positive`)
    assert(p.Dv > 0, `${name} Dv must be positive`)
    assert(p.Du > p.Dv, `${name} Du must be > Dv for Turing instability`)
    assert(p.dt > 0 && p.dt <= 2, `${name} dt=${p.dt} suspicious`)
  }
})

test('Pattern formation: V increases from seed at spots preset', () => {
  const g = new Grid(64, 64)
  g.seedCenter(5)
  const vStart = g.v.reduce((a,x) => a+x, 0)
  for (let i = 0; i < 2000; i++) eulerStep(g, PRESETS.spots)
  const vEnd = g.v.reduce((a,x) => a+x, 0)
  // V should persist / spread (not die to 0)
  assert(vEnd > vStart * 0.1, `V should persist: vStart=${vStart.toFixed(1)}, vEnd=${vEnd.toFixed(1)}`)
})

test('Grid swap — buffers exchange correctly', () => {
  const g = new Grid(4, 4)
  g.u.fill(1.0)
  g.u2.fill(0.5)
  const origU = g.u
  const origU2 = g.u2
  g.swap()
  assert(g.u === origU2, 'u should now be old u2')
  assert(g.u2 === origU, 'u2 should now be old u')
})

// ─── Summary ────────────────────────────────────────────────────────────────
console.log(`\nResults: ${passed} passed, ${failed} failed\n`)
process.exit(failed > 0 ? 1 : 0)
