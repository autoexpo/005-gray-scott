# Step 090 — Coupling Two Gray-Scott Layers

| Field | Value |
|-------|-------|
| Chapter | 8 — Extensions & Analysis |
| Step ID | 090 |
| Status | ✅ Passing |

## Why this step matters
Coupled reaction-diffusion layers create emergent behaviors impossible in single layers — synchronized oscillations, traveling waves, and complex spatio-temporal patterns. This extension models multi-component chemical systems and biological tissues.

## Context
Introduces coupled Gray-Scott layers where each layer influences the other through cross-coupling terms.

## Key Equations
- Layer 1: ∂u₁/∂t = Du₁∇²u₁ - u₁v₁² + f₁(1-u₁) + C₁₂(u₂-u₁)
- Layer 2: ∂u₂/∂t = Du₂∇²u₂ - u₂v₂² + f₂(1-u₂) + C₂₁(u₁-u₂)
- Cross-coupling: C₁₂, C₂₁ control inter-layer influence strength
- Emergent dynamics: synchronization, competition, wave propagation

## Code
This step demonstrates layer coupling:
- Dual-layer GPU simulation with cross-coupling terms
- Interactive coupling strength control
- Pattern synchronization and competition visualization

## Visualisation
- **Type**: Dual-layer GPU simulation with coupling visualization
- **Stack**: WebGL dual-buffer simulation, coupling visualization, synchronization analysis
- **What it shows**: Coupled pattern dynamics with emergent spatio-temporal behaviors

## Learning outcome
After this step, the student can:
- implement multi-layer reaction-diffusion systems
- understand coupling-induced emergent behaviors
- design multi-component systems with desired interaction patterns

## Test
- **File**: `src/tests/e2e/step090.test.ts`
- **Assertion**: Coupled dual-layer simulation with emergent pattern interactions
- **Last result**: ✅ Passed