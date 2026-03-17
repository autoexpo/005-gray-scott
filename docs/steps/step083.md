# Step 083 — Spatially Varying f and k: Parameter Maps

| Field | Value |
|-------|-------|
| Chapter | 8 — Extensions & Analysis |
| Step ID | 083 |
| Status | ✅ Passing |

## Why this step matters
Spatially-varying parameters f(x,y) and k(x,y) model realistic heterogeneous media where reaction rates change with position. This creates parameter gradients that can pin patterns, create boundaries, or drive pattern migration.

## Context
Introduces spatially-heterogeneous parameters through texture-based parameter maps enabling complex pattern interactions.

## Key Equations
- Parameter fields: f = f(x,y) and k = k(x,y) as spatial functions
- Gradient effects: ∇f and ∇k create pattern drift and boundary conditions
- Pattern pinning: sharp parameter changes can trap or reflect patterns
- Texture mapping: parameters sampled from GPU textures for efficiency

## Code
This step demonstrates parameter heterogeneity:
- 2D parameter texture generation and loading
- Bilinear interpolation for smooth parameter gradients
- Interactive parameter painting and editing tools

## Visualisation
- **Type**: GPU simulation with spatially-varying parameter maps
- **Stack**: WebGL parameter textures, gradient visualization, interactive painting tools
- **What it shows**: Pattern behavior in heterogeneous parameter landscapes

## Learning outcome
After this step, the student can:
- implement spatially-varying parameters via texture mapping
- understand how parameter gradients affect pattern dynamics
- design heterogeneous media for specific pattern behaviors

## Test
- **File**: `src/tests/e2e/step083.test.ts`
- **Assertion**: Spatially-varying parameters with pattern-parameter interactions
- **Last result**: ✅ Passed