# Step 079 — Mass Conservation Check

| Field | Value |
|-------|-------|
| Chapter | 7 — Numerical Methods & Performance |
| Step ID | 079 |
| Status | ✅ Passing |

## Why this step matters
Mass conservation Σ(U+V) should decrease monotonically in the Gray-Scott system due to the f×(1-U) feed term. Violations indicate numerical errors, boundary condition problems, or implementation bugs — making this an essential diagnostic tool.

## Context
Implements mass conservation monitoring as a diagnostic tool for detecting numerical errors and implementation problems.

## Key Equations
- Total mass: M(t) = ∬(U + V)dA over entire domain
- Conservation property: dM/dt = f×∬(1-U)dA - (f+k)×∬V dA < 0
- Numerical check: M(t+dt) ≤ M(t) must hold for all timesteps
- Error detection: |dM/dt - expected| > tolerance indicates problems

## Code
This step demonstrates conservation monitoring:
- Real-time mass integration via GPU reduction
- Conservation rate tracking and violation detection
- Automatic NaN detection and error reporting

## Visualisation
- **Type**: D3 conservation monitoring with real-time mass tracking
- **Stack**: D3.js time series, GPU mass reduction, conservation analysis
- **What it shows**: Mass conservation over time with violation detection

## Learning outcome
After this step, the student can:
- implement mass conservation checking for PDE systems
- diagnose numerical errors through conservation violations
- design robust error detection systems for scientific computing

## Test
- **File**: `src/tests/e2e/step079.test.ts`
- **Assertion**: Mass conservation monitoring with violation detection
- **Last result**: ✅ Passed