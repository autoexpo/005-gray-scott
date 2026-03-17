# Step 074 — RK4 on the GPU: Four Ping-Pong Passes

| Field | Value |
|-------|-------|
| Chapter | 7 — Numerical Methods & Performance |
| Step ID | 074 |
| Status | ✅ Passing |

## Why this step matters
GPU implementation of RK4 requires 6 framebuffers and 4 rendering passes, dramatically increasing memory usage compared to Euler's 2 FBOs. Understanding this trade-off between accuracy and resources is crucial for practical simulation design.

## Context
Demonstrates GPU implementation of RK4 integration requiring multiple framebuffers and ping-pong rendering passes.

## Key Equations
- Pass 1: k₁ = computeDerivatives(u_n, v_n)
- Pass 2: k₂ = computeDerivatives(u_n + 0.5×k₁, v_n + 0.5×k₁)
- Pass 3: k₃ = computeDerivatives(u_n + 0.5×k₂, v_n + 0.5×k₂)
- Pass 4: k₄ = computeDerivatives(u_n + k₃, v_n + k₃)
- Final: u_{n+1} = u_n + (k₁ + 2k₂ + 2k₃ + k₄)/6

## Code
This step demonstrates RK4 GPU implementation:
- Six framebuffer allocation: current, k1, k2, k3, k4, next
- Four-pass rendering pipeline with intermediate storage
- Memory bandwidth analysis and optimization strategies

## Visualisation
- **Type**: GPU simulation with RK4 integration
- **Stack**: WebGL RK4 shader, 6-FBO architecture, performance monitoring
- **What it shows**: High-precision pattern evolution with RK4 accuracy

## Learning outcome
After this step, the student can:
- implement RK4 integration on GPU with multiple framebuffers
- understand GPU memory requirements for higher-order methods
- optimize multi-pass rendering for maximum throughput

## Test
- **File**: `src/tests/e2e/step074.test.ts`
- **Assertion**: GPU RK4 simulation with 4-pass rendering pipeline
- **Last result**: ✅ Passed