# Step 089 — Symmetry Breaking: Sensitivity to ICs

| Field | Value |
|-------|-------|
| Chapter | 8 — Extensions & Analysis |
| Step ID | 089 |
| Status | ✅ Passing |

## Why this step matters
Turing patterns are attractors that emerge from random initial conditions, but specific pattern details depend sensitively on initial symmetries. Understanding this sensitivity explains pattern variability and demonstrates fundamental concepts about dynamical systems.

## Context
Explores how different initial conditions lead to the same attractor but with different spatial organization and symmetry properties.

## Key Equations
- Attractor convergence: all ICs → same pattern type (spots, stripes, etc.)
- Spatial organization: sensitive to IC symmetries and perturbations
- Symmetry inheritance: patterns often reflect initial condition symmetries
- Basin boundaries: IC space divided by final pattern organization

## Code
This step demonstrates IC sensitivity:
- Multiple simultaneous simulations with different ICs
- Pattern comparison showing attractor convergence
- Symmetry analysis of initial vs final states

## Visualisation
- **Type**: Multi-panel GPU simulation with IC comparison
- **Stack**: WebGL multi-viewport simulation, IC generation tools, pattern comparison
- **What it shows**: Different initial conditions converging to similar patterns with different organization

## Learning outcome
After this step, the student can:
- understand attractor behavior in pattern-forming systems
- predict how initial conditions influence final pattern organization
- design initial conditions to achieve desired pattern symmetries

## Test
- **File**: `src/tests/e2e/step089.test.ts`
- **Assertion**: Multi-IC simulation showing attractor convergence and symmetry effects
- **Last result**: ✅ Passed