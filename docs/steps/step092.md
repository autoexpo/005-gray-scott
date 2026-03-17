# Step 092 — Sub-Stepping for Speed

| Field | Value |
|-------|-------|
| Chapter | 9 — Engineering & Deployment |
| Step ID | 092 |
| Status | ✅ Passing |

## Why this step matters
Sub-stepping performs N simulation passes per frame to maximize GPU utilization while maintaining 60fps visualization. This technique dramatically increases simulation speed by decoupling computation rate from display rate.

## Context
Implements variable sub-stepping to maximize GPU computational throughput while maintaining smooth visualization frame rates.

## Key Equations
- Sub-step ratio: N = floor(16.67ms / simulation_time_per_step)
- Effective speedup: N× faster evolution for same visual frame rate
- GPU utilization: maximize texture bandwidth and shader throughput
- Display decimation: show every Nth simulation frame

## Code
This step demonstrates sub-stepping optimization:
- Adaptive sub-step calculation based on GPU performance
- Frame decimation for visualization while maintaining computation
- Performance monitoring showing effective speedup ratios

## Visualisation
- **Type**: Sub-stepped GPU simulation with speed monitoring
- **Stack**: WebGL multi-step pipeline, performance analysis, speedup visualization
- **What it shows**: Accelerated pattern evolution through sub-stepping optimization

## Learning outcome
After this step, the student can:
- implement sub-stepping for GPU simulation acceleration
- balance computational throughput with visualization smoothness
- optimize GPU utilization in real-time scientific computing

## Test
- **File**: `src/tests/e2e/step092.test.ts`
- **Assertion**: Sub-stepped simulation showing significant speed improvement
- **Last result**: ✅ Passed