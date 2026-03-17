# Step 093 — Web Worker CPU Fallback

| Field | Value |
|-------|-------|
| Chapter | 9 — Engineering & Deployment |
| Step ID | 093 |
| Status | ✅ Passing |

## Why this step matters
Web Workers provide CPU fallback for devices without WebGL support while keeping the main thread responsive. Using postMessage and SharedArrayBuffer enables efficient data transfer for cross-platform compatibility.

## Context
Implements Web Worker-based CPU simulation as fallback for WebGL-incompatible devices and browsers.

## Key Equations
- CPU Laplacian: same finite difference stencil as GPU version
- Memory transfer: SharedArrayBuffer avoids data copying overhead
- Thread communication: postMessage for control, SharedArrayBuffer for data
- Performance scaling: CPU ~100× slower than GPU for same resolution

## Code
This step demonstrates CPU fallback:
- Web Worker implementation of Gray-Scott simulation
- SharedArrayBuffer for efficient main thread communication
- Automatic fallback detection and seamless switching

## Visualisation
- **Type**: Text-based fallback status and performance comparison
- **Stack**: Web Worker simulation, SharedArrayBuffer, fallback detection
- **What it shows**: CPU simulation performance comparison and compatibility reporting

## Learning outcome
After this step, the student can:
- implement Web Worker-based scientific computing
- design graceful fallback systems for GPU-dependent applications
- optimize cross-thread data transfer with SharedArrayBuffer

## Test
- **File**: `src/tests/e2e/step093.test.ts`
- **Assertion**: Web Worker CPU simulation with SharedArrayBuffer communication
- **Last result**: ✅ Passed