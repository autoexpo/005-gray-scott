# Step 081 — Anisotropic Diffusion Tensor

| Field | Value |
|-------|-------|
| Chapter | 8 — Extensions & Analysis |
| Step ID | 081 |
| Status | ✅ Passing |

## Why this step matters
Anisotropic diffusion creates directionally-dependent spreading, leading to elongated patterns and preferential growth directions. This extension models realistic scenarios where diffusion varies with crystalline structure, magnetic fields, or material properties.

## Context
Extends isotropic diffusion to full tensor form enabling directional diffusion effects and anisotropic pattern formation.

## Key Equations
- Tensor diffusion: ∂u/∂t = ∇·(D∇u) where D is 2×2 tensor
- Matrix form: D = [Dxx, Dxy; Dyx, Dyy] with Dxy = Dyx
- Principal directions: eigenvectors of D determine preferred axes
- Anisotropy ratio: λ_max/λ_min controls directional strength

## Code
This step demonstrates tensor diffusion:
- 2×2 diffusion tensor implementation in GLSL
- Eigenvalue/eigenvector visualization for tensor orientation
- Interactive tensor control with visual feedback

## Visualisation
- **Type**: GPU simulation with anisotropic diffusion tensor
- **Stack**: WebGL tensor diffusion shader, tensor visualization overlay, parameter controls
- **What it shows**: Directional pattern growth with tensor field visualization

## Learning outcome
After this step, the student can:
- implement tensor diffusion operators in 2D
- understand relationship between tensor eigenvalues and pattern anisotropy
- design spatially-varying diffusion for realistic modeling

## Test
- **File**: `src/tests/e2e/step081.test.ts`
- **Assertion**: Anisotropic tensor diffusion with directional pattern formation
- **Last result**: ✅ Passed