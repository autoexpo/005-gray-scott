# Step 080 — Convergence Study

| Field | Value |
|-------|-------|
| Chapter | 7 — Numerical Methods & Performance |
| Step ID | 080 |
| Status | ✅ Passing |

## Why this step matters
Convergence testing validates that the numerical solution approaches the true mathematical solution as grid spacing h→0. Demonstrating O(h²) convergence for finite differences confirms implementation correctness and quantifies discretization error.

## Context
Implements Richardson extrapolation-based convergence analysis to verify spatial discretization accuracy and implementation correctness.

## Key Equations
- Richardson extrapolation: u_exact ≈ u_h + (u_h - u_2h)/(2^p - 1)
- Convergence order: p = log₂[(u_4h - u_2h)/(u_2h - u_h)]
- Expected order: p ≈ 2 for centered finite differences
- Error scaling: |error| ∝ h^p where p is convergence order

## Code
This step demonstrates convergence analysis:
- Multi-grid simulation at h, h/2, h/4 resolutions
- Richardson extrapolation for error estimation
- Convergence order calculation and verification

## Visualisation
- **Type**: D3 convergence analysis with error scaling plots
- **Stack**: D3.js error plots, multi-resolution data, Richardson analysis
- **What it shows**: Error vs grid spacing confirming O(h²) convergence

## Learning outcome
After this step, the student can:
- implement Richardson extrapolation for convergence testing
- verify spatial discretization accuracy through convergence analysis
- quantify and predict discretization errors in PDE solvers

## Test
- **File**: `src/tests/e2e/step080.test.ts`
- **Assertion**: Convergence study showing O(h²) spatial accuracy
- **Last result**: ✅ Passed