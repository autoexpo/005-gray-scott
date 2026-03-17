# Step 082 — Noise Perturbation: Gaussian Noise on U

| Field | Value |
|-------|-------|
| Chapter | 8 — Extensions & Analysis |
| Step ID | 082 |
| Status | ✅ Passing |

## Why this step matters
Random noise ε·N(0,1) breaks perfect symmetry and accelerates pattern nucleation by providing seed fluctuations. This demonstrates how real-world systems with thermal fluctuations differ from idealized deterministic models.

## Context
Introduces stochastic perturbations to break symmetry and accelerate Turing pattern formation through noise-driven nucleation.

## Key Equations
- Stochastic term: dU/dt = ... + σ×ξ(x,t) where ξ is white noise
- Noise amplitude: σ controls perturbation strength
- Correlation: ⟨ξ(x,t)ξ(x',t')⟩ = δ(x-x')δ(t-t')
- Symmetry breaking: uniform states become unstable to noise

## Code
This step demonstrates noise effects:
- GPU-based pseudo-random number generation
- Configurable noise amplitude and correlation length
- Pattern nucleation acceleration demonstration

## Visualisation
- **Type**: GPU simulation with stochastic noise perturbations
- **Stack**: WebGL simulation, GPU PRNG, noise visualization, nucleation timing
- **What it shows**: Accelerated pattern formation through noise-driven symmetry breaking

## Learning outcome
After this step, the student can:
- implement stochastic perturbations in GPU simulations
- understand noise-driven pattern nucleation mechanisms
- balance deterministic dynamics with realistic fluctuations

## Test
- **File**: `src/tests/e2e/step082.test.ts`
- **Assertion**: Stochastic simulation with noise-accelerated pattern nucleation
- **Last result**: ✅ Passed