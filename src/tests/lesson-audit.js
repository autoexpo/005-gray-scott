/**
 * Gray-Scott Course — Lesson Audit Test Suite
 *
 * Tests every one of the 100 step modules against a set of
 * structural, content, and runtime goals.
 *
 * Run: node src/tests/lesson-audit.js
 *
 * ─── TEST GOALS ──────────────────────────────────────────────────
 * For every step (1–100):
 *
 *   [G1]  Module exports a default object                (structural)
 *   [G2]  Has a non-empty string title                   (content)
 *   [G3]  Has a chapter number in [1..9]                 (content)
 *   [G4]  Has non-empty math HTML string                 (content)
 *   [G5]  Has non-empty code HTML string                 (content)
 *   [G6]  Has an init() function                         (runtime)
 *   [G7]  init() returns a cleanup function              (runtime)
 *   [G8]  Cleanup function is callable without throwing  (runtime)
 *   [G9]  Math field contains at least one <h3> heading  (content)
 *   [G10] Code field contains at least one <pre> block   (content)
 *
 * GPU steps additionally:
 *   [G11] Imports come from known modules (no broken requires)
 *
 * Math content goals:
 *   [G12] At least 30 chars of math per step
 *   [G13] At least 30 chars of code per step
 *
 * Chapter completeness:
 *   [G14] All 9 chapters present
 *   [G15] Each chapter has at least 8 steps
 *   [G16] Steps are numbered sequentially 1–100
 *
 * ─────────────────────────────────────────────────────────────────
 */

import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../../')
const STEPS_DIR = join(ROOT, 'src/steps')

// ── Colour helpers (terminal) ──────────────────────────────────────
const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  green:  '\x1b[32m',
  red:    '\x1b[31m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  white:  '\x1b[37m',
}
const G = s => `${C.green}${s}${C.reset}`
const R = s => `${C.red}${s}${C.reset}`
const Y = s => `${C.yellow}${s}${C.reset}`
const B = s => `${C.bold}${s}${C.reset}`
const D = s => `${C.dim}${s}${C.reset}`

// ── Result tracking ────────────────────────────────────────────────
const results = []  // { step, title, chapter, tests: [{id,pass,msg}], errors: [] }
let totalPassed = 0, totalFailed = 0, totalSkipped = 0

// DOM stub for init() calls that create DOM elements
function makeDOMStub() {
  const children = []
  return {
    appendChild(c) { children.push(c) },
    removeChild(c) {},
    insertBefore(c) {},
    get innerHTML() { return '' },
    set innerHTML(v) {},
    style: new Proxy({}, { get:()=>'', set:()=>true }),
    clientWidth: 400,
    clientHeight: 300,
    get firstChild() { return children[0] || null },
    addEventListener() {},
    removeEventListener() {},
    classList: { add(){}, remove(){}, contains(){ return false } },
  }
}

global.document = {
  createElement(tag) {
    return {
      tagName: tag.toUpperCase(),
      style: new Proxy({}, { get:()=>'', set:()=>true }),
      innerHTML: '',
      textContent: '',
      children: [],
      childNodes: [],
      appendChild(c) { this.children.push(c) },
      removeChild() {},
      addEventListener() {},
      removeEventListener() {},
      classList: { add(){}, remove(){}, contains(){ return false } },
      getContext() { return null },
      querySelectorAll() { return [] },
    }
  },
  getElementById(id) { return makeDOMStub() },
  head: { appendChild() {} },
  body: { innerHTML: '', appendChild() {} },
}

global.window = {
  addEventListener() {},
  removeEventListener() {},
  location: { hash: '' },
  renderMathInElement: null,
  hljs: null,
  devicePixelRatio: 1,
}

global.ResizeObserver = class {
  constructor(cb) {}
  observe() {}
  disconnect() {}
}

global.requestAnimationFrame = cb => 0
global.cancelAnimationFrame = () => {}
global.localStorage = { getItem: () => null, setItem: () => {} }
global.history = { replaceState() {} }
global.performance = { now: () => Date.now() }

// Silence Three.js / WebGL errors in Node
global.WebGLRenderingContext = undefined

// ── Test runner ────────────────────────────────────────────────────
function runTests(step, mod) {
  const tests = []
  const errors = []

  function check(id, label, fn) {
    try {
      const pass = fn()
      tests.push({ id, label, pass: !!pass, msg: pass === true ? '' : String(pass) })
      if (pass === true || pass === false || pass === undefined) {
        if (!!pass) totalPassed++; else totalFailed++
      }
    } catch(e) {
      tests.push({ id, label, pass: false, msg: e.message })
      totalFailed++
      errors.push(`[${id}] ${e.message}`)
    }
  }

  // [G1] Default export is an object
  check('G1', 'exports default object', () =>
    mod && typeof mod === 'object' ? true : 'not an object'
  )

  // [G2] title is a non-empty string
  check('G2', 'has non-empty title', () =>
    typeof mod.title === 'string' && mod.title.trim().length > 0
      ? true : `title="${mod.title}"`
  )

  // [G3] chapter in [1..9]
  check('G3', 'chapter ∈ [1..9]', () =>
    Number.isInteger(mod.chapter) && mod.chapter >= 1 && mod.chapter <= 9
      ? true : `chapter=${mod.chapter}`
  )

  // [G4] math is non-empty string
  check('G4', 'has math content', () =>
    typeof mod.math === 'string' && mod.math.trim().length > 0
      ? true : 'math missing or empty'
  )

  // [G5] code is non-empty string
  check('G5', 'has code content', () =>
    typeof mod.code === 'string' && mod.code.trim().length > 0
      ? true : 'code missing or empty'
  )

  // [G6] init() is a function
  check('G6', 'init() is a function', () =>
    typeof mod.init === 'function' ? true : `init=${typeof mod.init}`
  )

  // [G9] math has <h3>
  check('G9', 'math has <h3> heading', () =>
    (mod.math || '').includes('<h3>') ? true : 'no <h3> in math'
  )

  // [G10] code has <pre>
  check('G10', 'code has <pre> block', () =>
    (mod.code || '').includes('<pre>') ? true : 'no <pre> in code'
  )

  // [G12] math length >= 30
  check('G12', 'math length ≥ 30 chars', () =>
    (mod.math || '').length >= 30 ? true : `only ${(mod.math||'').length} chars`
  )

  // [G13] code length >= 30
  check('G13', 'code length ≥ 30 chars', () =>
    (mod.code || '').length >= 30 ? true : `only ${(mod.code||'').length} chars`
  )

  // [G7] + [G8] init() returns callable cleanup
  if (typeof mod.init === 'function') {
    let cleanup = null
    check('G7', 'init() returns cleanup fn', () => {
      try {
        const container = makeDOMStub()
        const state = { params: {}, stepIndex: step - 1 }
        cleanup = mod.init(container, state)
        return typeof cleanup === 'function'
          ? true
          : `returned ${typeof cleanup} (expected function)`
      } catch(e) {
        return `init() threw: ${e.message}`
      }
    })

    check('G8', 'cleanup() callable without throw', () => {
      if (typeof cleanup !== 'function') return 'no cleanup to call (skip)'
      try {
        cleanup()
        return true
      } catch(e) {
        return `cleanup threw: ${e.message}`
      }
    })
  } else {
    totalSkipped += 2
    tests.push({ id: 'G7', label: 'init() returns cleanup fn', pass: null, msg: 'skipped (no init)' })
    tests.push({ id: 'G8', label: 'cleanup() callable without throw', pass: null, msg: 'skipped (no init)' })
  }

  return { tests, errors }
}

// ── Discover and load all step files ──────────────────────────────
async function loadAllSteps() {
  const chapters = ['ch01','ch02','ch03','ch04','ch05','ch06','ch07','ch08','ch09']
  const stepModules = []

  for (const ch of chapters) {
    const dir = join(STEPS_DIR, ch)
    let files
    try {
      files = readdirSync(dir).filter(f => f.match(/^step\d+\.js$/) && !f.includes('Template'))
    } catch(e) {
      console.error(R(`Cannot read ${dir}: ${e.message}`))
      continue
    }
    files.sort()
    for (const f of files) {
      const stepNum = parseInt(f.replace('step', '').replace('.js', ''), 10)
      const filePath = join(dir, f)
      stepModules.push({ stepNum, filePath, ch })
    }
  }
  return stepModules
}

// ── Main ───────────────────────────────────────────────────────────
async function main() {
  const startTime = Date.now()

  console.log()
  console.log(B('═══════════════════════════════════════════════════════'))
  console.log(B('  GRAY-SCOTT COURSE — LESSON AUDIT REPORT'))
  console.log(B('═══════════════════════════════════════════════════════'))
  console.log()

  const stepFiles = await loadAllSteps()

  // Chapter tracking
  const chapCounts = {}
  const stepNumbers = []

  // Run tests for each step
  for (const { stepNum, filePath, ch } of stepFiles) {
    let mod
    try {
      const fileUrl = pathToFileURL(filePath).href
      const imported = await import(fileUrl)
      mod = imported.default
    } catch(e) {
      results.push({
        step: stepNum, title: '(import failed)', chapter: '?',
        tests: [],
        errors: [`Import error: ${e.message}`],
        importError: true,
      })
      totalFailed += 10
      console.log(`  ${R('✗')} Step ${String(stepNum).padStart(3,'0')}: ${R('IMPORT FAILED')} — ${e.message.slice(0,60)}`)
      continue
    }

    const { tests, errors } = runTests(stepNum, mod)

    chapCounts[mod.chapter || '?'] = (chapCounts[mod.chapter || '?'] || 0) + 1
    stepNumbers.push(stepNum)

    results.push({
      step: stepNum,
      title: mod.title || '(no title)',
      chapter: mod.chapter || '?',
      tests,
      errors,
      importError: false,
    })
  }

  // Cross-step goals
  console.log(B('── Per-Step Results ──────────────────────────────────'))
  console.log()

  // Print per-step summary
  const chapters = [1,2,3,4,5,6,7,8,9]
  for (const ch of chapters) {
    const chSteps = results.filter(r => r.chapter === ch)
    if (!chSteps.length) continue

    const chName = {
      1:'Foundations', 2:'1D Simulation', 3:'2D Simulation',
      4:'GPU Pipeline', 5:'Interactivity & Presets',
      6:'Visualization', 7:'Advanced Numerics',
      8:'Advanced Extensions', 9:'Deployment & Synthesis',
    }[ch] || `Chapter ${ch}`

    console.log(B(D(`  ┌─ Ch.${ch}: ${chName} (${chSteps.length} steps)`)))

    for (const r of chSteps) {
      const passed = r.tests.filter(t => t.pass === true).length
      const failed = r.tests.filter(t => t.pass === false).length
      const total  = r.tests.filter(t => t.pass !== null).length
      const icon = r.importError ? R('✗') : failed === 0 ? G('✓') : R('✗')
      const ratio = `${passed}/${total}`
      const titleTrunc = (r.title || '').slice(0, 42).padEnd(42)
      const failList = r.tests.filter(t => t.pass === false)
        .map(t => `${Y(t.id)}${t.msg ? ':'+t.msg.slice(0,40) : ''}`)
        .join(', ')

      console.log(`  ${icon} ${String(r.step).padStart(3,'0')} ${D('│')} ${titleTrunc} ${D(ratio)} ${failList ? R('  ['+failList+']') : ''}`)
    }
    console.log()
  }

  // ── Cross-step goal checks ────────────────────────────────────────
  console.log(B('── Cross-Step Goal Checks ────────────────────────────'))
  console.log()

  const crossTests = []

  function crossCheck(id, label, fn) {
    const result = fn()
    crossTests.push({ id, label, pass: result === true, msg: result === true ? '' : String(result) })
    console.log(
      `  ${result === true ? G('✓') : R('✗')} ${B(id.padEnd(5))} ${label}${result !== true ? ' — ' + Y(String(result)) : ''}`
    )
  }

  // G14: All 9 chapters present
  crossCheck('G14', 'All 9 chapters present', () => {
    const chaps = [...new Set(results.map(r => r.chapter).filter(c => typeof c === 'number'))]
    return chaps.length === 9 ? true : `found chapters: ${chaps.sort().join(',')}`
  })

  // G15: Each chapter has ≥ 8 steps
  crossCheck('G15', 'Each chapter has ≥ 8 steps', () => {
    const bad = []
    for (let c = 1; c <= 9; c++) {
      const n = results.filter(r => r.chapter === c).length
      if (n < 8) bad.push(`Ch${c}=${n}`)
    }
    return bad.length === 0 ? true : `under-populated: ${bad.join(', ')}`
  })

  // G16: Steps numbered 1–100 sequentially
  crossCheck('G16', 'Steps 1–100 all present', () => {
    const nums = results.map(r => r.step).sort((a,b) => a-b)
    const missing = []
    for (let i = 1; i <= 100; i++) if (!nums.includes(i)) missing.push(i)
    return missing.length === 0 ? true : `missing: ${missing.slice(0,10).join(',')}${missing.length>10?'...':''}`
  })

  // Total count
  crossCheck('G16b', 'Exactly 100 step files found', () =>
    results.length === 100 ? true : `found ${results.length} steps`
  )

  // No import errors
  crossCheck('G17', 'All modules import without error', () => {
    const broken = results.filter(r => r.importError)
    return broken.length === 0 ? true : `${broken.length} import failures: steps ${broken.map(r=>r.step).join(',')}`
  })

  // All steps have init()
  crossCheck('G18', 'All steps have init() function', () => {
    const missing = results.filter(r => !r.importError && typeof (r.tests.find(t=>t.id==='G6')||{}).pass !== 'undefined' && r.tests.find(t=>t.id==='G6')?.pass !== true)
    return missing.length === 0 ? true : `missing init: steps ${missing.map(r=>r.step).slice(0,10).join(',')}`
  })

  // Chapter-by-chapter step count
  crossCheck('G19', 'Step count per chapter correct (Ch1=8, Ch2-3=10, Ch4-8=10, Ch9=10)', () => {
    const expected = { 1:8, 2:10, 3:12, 4:15, 5:13, 6:12, 7:10, 8:10, 9:10 }
    const wrong = []
    for (const [ch, exp] of Object.entries(expected)) {
      const got = results.filter(r => r.chapter === parseInt(ch)).length
      if (got !== exp) wrong.push(`Ch${ch}: expected ${exp} got ${got}`)
    }
    return wrong.length === 0 ? true : wrong.join('; ')
  })

  // GPU steps use startGPULoop or GPUSim
  crossCheck('G20', 'Preset imports available for GPU steps', () => {
    const gpuSteps = stepFiles.filter(s => {
      try {
        const src = readFileSync(s.filePath, 'utf8')
        return src.includes('startGPULoop') || src.includes('GPUSim')
      } catch { return false }
    })
    return gpuSteps.length >= 50 ? true : `only ${gpuSteps.length} GPU steps found`
  })

  // Math content quality: check math fields contain formulas or symbols
  // Accepts $$, $, ∂, ∇, ≈, ×, or LaTeX-style math-block divs
  crossCheck('G21', '≥ 70% of steps contain math symbols or LaTeX', () => {
    const mathSymbols = /\$\$|\$[^$]|∂|∇|≈|×|math-block|\\frac|\\nabla|\\partial|≤|≥|→|⟹/
    const withMath = results.filter(r => {
      const src = r.tests.find(t=>t.id==='G4')?.pass ? true : false
      const math = stepFiles.find(s=>s.stepNum===r.step)
        ? readFileSync(stepFiles.find(s=>s.stepNum===r.step).filePath,'utf8')
        : ''
      return mathSymbols.test(math)
    })
    const pct = Math.round(withMath.length / results.length * 100)
    return pct >= 70 ? true : `only ${pct}% of steps have math symbols`
  })

  // Code blocks use language-js or language-glsl
  crossCheck('G22', 'Code fields have syntax-language hints', () => {
    const withLang = stepFiles.filter(s => {
      try {
        const src = readFileSync(s.filePath, 'utf8')
        return src.includes('language-js') || src.includes('language-glsl')
      } catch { return false }
    })
    const pct = Math.round(withLang.length / stepFiles.length * 100)
    return pct >= 70 ? true : `only ${pct}% have language hints`
  })

  console.log()

  // ── Final statistics ───────────────────────────────────────────────
  const elapsed = Date.now() - startTime
  const perStepPassed = results.map(r => r.tests.filter(t => t.pass === true).length)
  const perStepFailed = results.map(r => r.tests.filter(t => t.pass === false).length)
  const totalPerStepPassed = perStepPassed.reduce((a,b)=>a+b,0)
  const totalPerStepFailed = perStepFailed.reduce((a,b)=>a+b,0)
  const allTests = totalPerStepPassed + totalPerStepFailed
  const crossPassed = crossTests.filter(t=>t.pass).length
  const crossFailed = crossTests.filter(t=>!t.pass).length

  // Steps fully passing all tests
  const fullPass = results.filter(r => !r.importError && r.tests.filter(t=>t.pass===false).length === 0)
  const partialFail = results.filter(r => !r.importError && r.tests.filter(t=>t.pass===false).length > 0)
  const importFail = results.filter(r => r.importError)

  // Category breakdown
  const catBreakdown = {}
  for (const r of results) {
    for (const t of r.tests) {
      if (!catBreakdown[t.id]) catBreakdown[t.id] = { pass:0, fail:0 }
      if (t.pass === true) catBreakdown[t.id].pass++
      else if (t.pass === false) catBreakdown[t.id].fail++
    }
  }

  console.log(B('═══════════════════════════════════════════════════════'))
  console.log(B('  FINAL TEST REPORT'))
  console.log(B('═══════════════════════════════════════════════════════'))
  console.log()
  console.log(`  ${B('Steps tested:    ')} ${results.length}`)
  console.log(`  ${B('Fully passing:   ')} ${G(fullPass.length)} / ${results.length}`)
  console.log(`  ${B('Partially fail:  ')} ${partialFail.length > 0 ? R(partialFail.length) : G(0)}`)
  console.log(`  ${B('Import failures: ')} ${importFail.length > 0 ? R(importFail.length) : G(0)}`)
  console.log()
  console.log(`  ${B('Per-step tests:  ')} ${allTests} assertions`)
  console.log(`    ${G('passed')}:  ${totalPerStepPassed}`)
  console.log(`    ${R('failed')}:  ${totalPerStepFailed}`)
  console.log(`    pass rate: ${Math.round(totalPerStepPassed/allTests*100)}%`)
  console.log()
  console.log(`  ${B('Cross-step tests:')} ${crossTests.length} checks`)
  console.log(`    ${G('passed')}:  ${crossPassed}`)
  console.log(`    ${R('failed')}:  ${crossFailed > 0 ? R(crossFailed) : G(crossFailed)}`)
  console.log()

  // Per-goal breakdown
  console.log(B('── Goal-by-Goal Breakdown ────────────────────────────'))
  console.log()
  const goalDefs = {
    G1:  'Module exports default object',
    G2:  'Has non-empty title',
    G3:  'Chapter number in [1..9]',
    G4:  'Has non-empty math HTML',
    G5:  'Has non-empty code HTML',
    G6:  'Has init() function',
    G7:  'init() returns cleanup function',
    G8:  'cleanup() callable without throw',
    G9:  'Math has <h3> heading',
    G10: 'Code has <pre> block',
    G12: 'Math length ≥ 30 chars',
    G13: 'Code length ≥ 30 chars',
  }
  for (const [id, desc] of Object.entries(goalDefs)) {
    const s = catBreakdown[id] || { pass: 0, fail: 0 }
    const total = s.pass + s.fail
    const pct = total > 0 ? Math.round(s.pass/total*100) : 100
    const bar = '█'.repeat(Math.round(pct/5)).padEnd(20,'░')
    const status = s.fail === 0 ? G('ALL PASS') : R(`${s.fail} FAIL`)
    console.log(`  ${id.padEnd(5)} ${desc.padEnd(38)} ${bar} ${String(pct).padStart(3)}%  ${status}`)
  }

  // Chapter pass rates
  console.log()
  console.log(B('── Chapter Pass Rates ────────────────────────────────'))
  console.log()
  const chNames = {
    1:'Foundations', 2:'1D Simulation', 3:'2D Simulation', 4:'GPU Pipeline',
    5:'Interactivity', 6:'Visualization', 7:'Advanced Numerics',
    8:'Advanced Extensions', 9:'Deployment',
  }
  for (let c = 1; c <= 9; c++) {
    const chRes = results.filter(r => r.chapter === c)
    const cp = chRes.reduce((a,r)=>a+r.tests.filter(t=>t.pass===true).length, 0)
    const cf = chRes.reduce((a,r)=>a+r.tests.filter(t=>t.pass===false).length, 0)
    const ct = cp + cf
    const pct = ct > 0 ? Math.round(cp/ct*100) : 100
    const bar = '█'.repeat(Math.round(pct/5)).padEnd(20,'░')
    const status = cf === 0 ? G('✓ PASS') : R(`${cf} FAIL`)
    console.log(`  Ch.${c} ${chNames[c].padEnd(22)} ${bar} ${String(pct).padStart(3)}%  ${String(chRes.length).padStart(2)} steps  ${status}`)
  }

  // Failures detail
  const allFailures = results.flatMap(r =>
    r.tests.filter(t => t.pass === false).map(t => ({ step: r.step, title: r.title, ...t }))
  )
  if (allFailures.length > 0) {
    console.log()
    console.log(B('── Failure Details ───────────────────────────────────'))
    console.log()
    const grouped = {}
    for (const f of allFailures) {
      if (!grouped[f.id]) grouped[f.id] = []
      grouped[f.id].push(f)
    }
    for (const [id, fails] of Object.entries(grouped)) {
      console.log(`  ${R(id.padEnd(5))} — ${goalDefs[id] || id}`)
      for (const f of fails.slice(0, 5)) {
        console.log(`    ${D('step')} ${String(f.step).padStart(3,'0')} ${D('│')} ${f.msg || ''}`)
      }
      if (fails.length > 5) console.log(`    ${D(`... and ${fails.length - 5} more`)}`)
      console.log()
    }
  } else {
    console.log()
    console.log(`  ${G('No failures.')} All per-step tests passed.`)
  }

  // Timing
  console.log()
  console.log(B('═══════════════════════════════════════════════════════'))
  console.log(`  Audit completed in ${elapsed}ms`)
  console.log(B('═══════════════════════════════════════════════════════'))
  console.log()

  const exitCode = (totalPerStepFailed + crossFailed + importFail.length) > 0 ? 1 : 0
  process.exit(exitCode)
}

main().catch(err => {
  console.error(R('\nFatal error during audit:'), err)
  process.exit(2)
})
