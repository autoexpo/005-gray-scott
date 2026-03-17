# Step 072 — Numerical Instability Demo: dt Too Large

| Field | Value |
|-------|-------|
| Chapter | 7 — Numerical Methods & Performance |
| Step ID | 072 |
| Status | ✅ Passing |

## Why this step matters
Seeing numerical instability in action — uncontrolled growth, oscillations, and eventual NaN values — provides visceral understanding of why stability conditions exist. This visual demonstration makes abstract theory concrete and memorable.

## Context
Provides hands-on demonstration of CFL condition violation through deliberate timestep increase beyond stability limit.

## Key Equations
- Violation condition: dt > h²/(4D) → exponential growth
- Instability growth: |error| ∝ exp(λt) where λ > 0 for unstable modes
- Blowup detection: max(|u|, |v|) > threshold or isNaN(u)

## Code
This step demonstrates numerical instability:
- Gradual timestep increase until instability onset
- Pattern explosion visualization with error magnification
- Automatic reset and recovery demonstration

## Visualisation
- **Type**: GPU simulation with deliberate instability
- **Stack**: WebGL simulation, timestep control, instability animation, automatic reset
- **What it shows**: Pattern explosion due to CFL violation with dramatic visual feedback

## Learning outcome
After this step, the student can:
- recognize visual signs of numerical instability
- understand the catastrophic consequences of CFL violation
- implement stability monitoring and automatic recovery systems

## Test
- **File**: `src/tests/e2e/step072.test.ts`
- **Assertion**: Controlled instability demonstration with automatic recovery
- **Last result**: ✅ Passed