# Step 087 — Turing Instability Analysis: Linearization

| Field | Value |
|-------|-------|
| Chapter | 8 — Extensions & Analysis |
| Step ID | 087 |
| Status | ✅ Passing |

## Why this step matters
Linear stability analysis reveals which wavenumbers k grow exponentially from uniform states, predicting pattern wavelength before patterns appear. This mathematical foundation explains why specific patterns emerge and others don't.

## Context
Introduces linear stability analysis to predict Turing pattern onset and characteristic wavelengths from system parameters.

## Key Equations
- Linearization: u = u₀ + εe^(σt+ikx), v = v₀ + εe^(σt+ikx)
- Dispersion relation: σ(k²) determines growth rates vs wavenumber
- Instability condition: σ > 0 for unstable modes
- Critical wavenumber: k_c where σ(k_c²) = 0, maximum growth

## Code
This step demonstrates stability analysis:
- Interactive dispersion relation plotting σ(k²)
- Parameter space exploration showing stable/unstable regions
- Predicted vs observed pattern wavelength comparison

## Visualisation
- **Type**: D3 dispersion relation analysis with parameter exploration
- **Stack**: D3.js mathematical plotting, parameter sliders, stability analysis
- **What it shows**: Growth rate vs wavenumber revealing unstable modes and predicted wavelengths

## Learning outcome
After this step, the student can:
- perform linear stability analysis for reaction-diffusion systems
- predict pattern wavelength from dispersion relations
- understand the mathematical basis for Turing pattern formation

## Test
- **File**: `src/tests/e2e/step087.test.ts`
- **Assertion**: Linear stability analysis with dispersion relation visualization
- **Last result**: ✅ Passed