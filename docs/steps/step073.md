# Step 073 — RK4 Integration: Four-Stage Derivation

| Field | Value |
|-------|-------|
| Chapter | 7 — Numerical Methods & Performance |
| Step ID | 073 |
| Status | ✅ Passing |

## Why this step matters
RK4 provides fourth-order accuracy O(dt⁴) compared to Euler's O(dt), enabling larger stable timesteps and higher precision. Understanding the k₁→k₂→k₃→k₄ derivation illuminates how higher-order methods work.

## Context
Introduces fourth-order Runge-Kutta integration theory with detailed mathematical derivation and implementation strategy.

## Key Equations
- k₁ = dt × f(u_n, v_n) — slope at beginning
- k₂ = dt × f(u_n + k₁/2, v_n + k₁/2) — slope at midpoint using k₁
- k₃ = dt × f(u_n + k₂/2, v_n + k₂/2) — slope at midpoint using k₂
- k₄ = dt × f(u_n + k₃, v_n + k₃) — slope at end using k₃
- u_{n+1} = u_n + (k₁ + 2k₂ + 2k₃ + k₄)/6 — weighted combination

## Code
This step demonstrates RK4 theory:
- Visual derivation of four stages with geometric interpretation
- Error comparison: Euler O(dt) vs RK4 O(dt⁴)
- Implementation complexity analysis

## Visualisation
- **Type**: Interactive D3 mathematical derivation
- **Stack**: D3.js stage visualization, slope diagrams, error analysis charts
- **What it shows**: Step-by-step RK4 derivation with geometric interpretation

## Learning outcome
After this step, the student can:
- derive the RK4 algorithm from Taylor series expansion
- understand the geometric meaning of each k-stage
- predict accuracy improvement from higher-order methods

## Test
- **File**: `src/tests/e2e/step073.test.ts`
- **Assertion**: Interactive RK4 derivation with stage-by-stage visualization
- **Last result**: ✅ Passed