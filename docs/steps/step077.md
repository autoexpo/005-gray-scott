# Step 077 — Spatial Resolution: 128 vs 512 vs 1024

| Field | Value |
|-------|-------|
| Chapter | 7 — Numerical Methods & Performance |
| Step ID | 077 |
| Status | ✅ Passing |

## Why this step matters
Spatial resolution determines which wavelengths can be resolved — pattern features smaller than ~4 grid cells are lost to numerical dissipation. Understanding the relationship between grid spacing and pattern wavelength is crucial for choosing appropriate resolution.

## Context
Compares pattern formation at different grid resolutions to demonstrate spatial resolution effects on pattern wavelength and detail.

## Key Equations
- Nyquist limit: λ_min ≈ 4h where h is grid spacing
- Resolution scaling: 1024² requires 64× memory vs 128²
- Pattern wavelength: λ ∝ √(Du/k) — intrinsic length scale
- Grid requirement: N > 4λ/L for proper resolution

## Code
This step demonstrates resolution effects:
- Multi-resolution comparison: 128², 256², 512², 1024²
- Memory usage tracking and performance analysis
- Pattern detail comparison at identical parameters

## Visualisation
- **Type**: Multi-resolution GPU simulation comparison
- **Stack**: WebGL multi-viewport, resolution controls, memory monitoring
- **What it shows**: Pattern detail vs grid resolution with performance metrics

## Learning outcome
After this step, the student can:
- choose appropriate grid resolution for target pattern wavelength
- predict memory and computational requirements for different resolutions
- balance pattern detail against performance constraints

## Test
- **File**: `src/tests/e2e/step077.test.ts`
- **Assertion**: Multi-resolution comparison with performance monitoring
- **Last result**: ✅ Passed