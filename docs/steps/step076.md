# Step 076 — Adaptive Time Stepping

| Field | Value |
|-------|-------|
| Chapter | 7 — Numerical Methods & Performance |
| Step ID | 076 |
| Status | ✅ Passing |

## Why this step matters
Adaptive timestep control automatically balances accuracy and efficiency by increasing dt in smooth regions and decreasing it near sharp fronts. This optimization is essential for long-duration simulations where pattern complexity varies dramatically over time.

## Context
Introduces adaptive timestep algorithms using step-doubling and Richardson extrapolation for automatic error control.

## Key Equations
- Step doubling: compute u(t+2h) using single step vs two h-steps
- Richardson error estimate: |error| ≈ |u_2h - u_h|/15 for RK4
- Adaptive control: dt_new = dt_old × (tolerance/error)^(1/5)
- Safety factor: 0.8 ≤ scaling ≤ 2.0 to prevent thrashing

## Code
This step demonstrates adaptive control:
- Real-time error estimation via step doubling
- Automatic timestep adjustment with safety bounds
- Performance monitoring showing adaptation behavior

## Visualisation
- **Type**: GPU simulation with adaptive timestep control
- **Stack**: WebGL simulation, dual-step error estimation, timestep history display
- **What it shows**: Automatic timestep adaptation responding to pattern complexity

## Learning outcome
After this step, the student can:
- implement Richardson extrapolation for error estimation
- design adaptive timestep controllers with stability bounds
- optimize simulation efficiency through automatic step control

## Test
- **File**: `src/tests/e2e/step076.test.ts`
- **Assertion**: Adaptive timestep simulation with automatic error control
- **Last result**: ✅ Passed