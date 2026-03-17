# Step 075 — Euler vs RK4: Accuracy Comparison

| Field | Value |
|-------|-------|
| Chapter | 7 — Numerical Methods & Performance |
| Step ID | 075 |
| Status | ✅ Passing |

## Why this step matters
The speed/accuracy tradeoff is fundamental to computational science. RK4 allows 4× larger timesteps for equivalent accuracy, but requires 6× more GPU memory — understanding when each method is optimal guides practical decisions.

## Context
Provides side-by-side comparison of Euler and RK4 integration methods with identical initial conditions and parameter sets.

## Key Equations
- Euler error: O(dt) — linear accumulation
- RK4 error: O(dt⁴) — quartic scaling advantage
- Equivalent accuracy: dt_RK4 ≈ 4 × dt_Euler
- Performance ratio: RK4_cost / Euler_cost ≈ 6× memory, 4× compute

## Code
This step demonstrates method comparison:
- Split-screen simulation: Euler left, RK4 right
- Synchronized timestep control and parameter matching
- Error accumulation tracking and convergence analysis

## Visualisation
- **Type**: Dual GPU simulation with method comparison
- **Stack**: WebGL split-screen, synchronized parameter control, error tracking
- **What it shows**: Side-by-side Euler vs RK4 with identical conditions revealing accuracy differences

## Learning outcome
After this step, the student can:
- quantify accuracy differences between integration methods
- choose optimal method based on speed/accuracy requirements
- predict computational costs for higher-order schemes

## Test
- **File**: `src/tests/e2e/step075.test.ts`
- **Assertion**: Split-screen Euler vs RK4 comparison with synchronized parameters
- **Last result**: ✅ Passed