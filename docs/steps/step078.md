# Step 078 — Anti-Aliasing: Bilinear vs Nearest Sampling

| Field | Value |
|-------|-------|
| Chapter | 7 — Numerical Methods & Performance |
| Step ID | 078 |
| Status | ✅ Passing |

## Why this step matters
Texture filtering affects both visual quality and numerical accuracy — GL_LINEAR introduces artificial smoothing that can suppress fine-scale instabilities, while GL_NEAREST preserves sharp gradients but creates pixel artifacts during zooming.

## Context
Explores WebGL texture filtering modes and their impact on both visualization quality and numerical simulation accuracy.

## Key Equations
- Bilinear interpolation: value = (1-fx)(1-fy)×c00 + fx(1-fy)×c10 + ...
- Nearest sampling: value = texture[floor(u×width), floor(v×height)]
- Numerical dissipation: bilinear filtering acts like artificial viscosity
- Aliasing frequency: sampling < 2×pattern frequency → artifacts

## Code
This step demonstrates filtering effects:
- Side-by-side GL_NEAREST vs GL_LINEAR comparison
- Zoom-dependent aliasing demonstration
- Numerical accuracy analysis with filtering artifacts

## Visualisation
- **Type**: GPU simulation with texture filtering comparison
- **Stack**: WebGL simulation, dual filtering modes, zoom controls, aliasing demonstration
- **What it shows**: Visual and numerical differences between texture filtering modes

## Learning outcome
After this step, the student can:
- choose appropriate texture filtering for simulation accuracy
- understand trade-offs between visual quality and numerical precision
- implement multi-scale rendering with proper anti-aliasing

## Test
- **File**: `src/tests/e2e/step078.test.ts`
- **Assertion**: Texture filtering comparison showing visual and numerical differences
- **Last result**: ✅ Passed