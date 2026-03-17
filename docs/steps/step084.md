# Step 084 — Multi-Scale Simulation

| Field | Value |
|-------|-------|
| Chapter | 8 — Extensions & Analysis |
| Step ID | 084 |
| Status | ✅ Passing |

## Why this step matters
Multi-scale coupling connects fine-scale pattern details with large-scale pattern organization. This hierarchy appears in many natural systems where local reactions create patterns that influence global behavior and vice versa.

## Context
Implements coupled coarse-fine grid simulation to demonstrate scale separation and hierarchical pattern formation.

## Key Equations
- Coarse grid: U_coarse, V_coarse at resolution N×N
- Fine grid: U_fine, V_fine at resolution 4N×4N
- Upscaling: U_coarse = ∫U_fine dA over coarse cells
- Downscaling: U_fine interpolated from U_coarse at boundaries

## Code
This step demonstrates multi-scale coupling:
- Dual-resolution simulation with periodic coupling
- Upscaling via area averaging and downscaling via interpolation
- Scale-dependent parameter adjustment and boundary conditions

## Visualisation
- **Type**: Coupled multi-resolution GPU simulation
- **Stack**: WebGL dual-grid simulation, scale coupling visualization, resolution comparison
- **What it shows**: Hierarchical pattern organization across spatial scales

## Learning outcome
After this step, the student can:
- implement multi-scale coupling in PDE simulations
- understand scale separation and hierarchical pattern formation
- design efficient multi-resolution algorithms for complex systems

## Test
- **File**: `src/tests/e2e/step084.test.ts`
- **Assertion**: Multi-scale simulation with coarse-fine grid coupling
- **Last result**: ✅ Passed