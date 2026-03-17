# Step 071 — Stability Analysis: CFL Condition

| Field | Value |
|-------|-------|
| Chapter | 7 — Numerical Methods & Performance |
| Step ID | 071 |
| Status | ✅ Passing |

## Why this step matters
The CFL condition is fundamental to explicit numerical methods — it determines the maximum stable time step for any given spatial resolution. Understanding why Δt ≤ h²/(4D) prevents divergence is crucial for building robust simulations that don't blow up unexpectedly.

## Context
Introduces stability analysis for explicit time integration schemes through the Courant-Friedrichs-Lewy condition.

## Key Equations
- CFL condition: Δt ≤ h²/(4D) for 2D diffusion
- Stability constraint: ensures information propagation doesn't exceed grid resolution
- Critical timestep: Δt_max = 0.25 × h² / D_max where D_max = max(Du, Dv)

## Code
This step demonstrates stability analysis:
- Interactive CFL ratio slider (safe: <1.0, unstable: >1.0)
- Real-time stability monitoring with blowup detection
- Visual comparison of stable vs unstable integrations

## Visualisation
- **Type**: Interactive D3 stability diagram
- **Stack**: D3.js stability regions, parameter sliders, blowup animation
- **What it shows**: CFL stability boundary and consequences of violation

## Learning outcome
After this step, the student can:
- derive the CFL condition for diffusion equations
- predict the maximum stable timestep for any grid resolution
- recognize signs of numerical instability and apply corrective measures

## Test
- **File**: `src/tests/e2e/step071.test.ts`
- **Assertion**: CFL stability analysis with interactive parameter control
- **Last result**: ✅ Passed