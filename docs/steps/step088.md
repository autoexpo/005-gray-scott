# Step 088 — Pattern Wavelength: Dispersion Relation

| Field | Value |
|-------|-------|
| Chapter | 8 — Extensions & Analysis |
| Step ID | 088 |
| Status | ✅ Passing |

## Why this step matters
The dispersion relation σ(k²) directly predicts observable pattern wavelength λ* = 2π/k* where k* maximizes growth rate. This connection between mathematics and visual patterns validates theoretical predictions against simulation results.

## Context
Connects theoretical dispersion relations to observed pattern wavelengths through direct measurement and comparison.

## Key Equations
- Wavelength prediction: λ* = 2π/k* where σ'(k*²) = 0
- Fourier analysis: k* = dominant wavenumber in |FFT(u)|²
- Parameter dependence: λ* ∝ √(Du/f) approximate scaling
- Measurement accuracy: FFT resolution limits k-space sampling

## Code
This step demonstrates wavelength analysis:
- Real-time FFT analysis of pattern wavelength
- Theoretical prediction vs measurement comparison
- Parameter sweeps showing wavelength scaling laws

## Visualisation
- **Type**: D3 spectral analysis with theoretical comparison
- **Stack**: D3.js FFT visualization, spectral analysis, wavelength measurement
- **What it shows**: Measured vs predicted pattern wavelengths confirming dispersion theory

## Learning outcome
After this step, the student can:
- measure pattern wavelengths via Fourier analysis
- validate theoretical predictions against simulation results
- understand quantitative relationships between parameters and pattern scale

## Test
- **File**: `src/tests/e2e/step088.test.ts`
- **Assertion**: Pattern wavelength analysis with theoretical validation
- **Last result**: ✅ Passed