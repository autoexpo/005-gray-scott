# Step 094 — Responsive Layout: Resize and DPR

| Field | Value |
|-------|-------|
| Chapter | 9 — Engineering & Deployment |
| Step ID | 094 |
| Status | ✅ Passing |

## Why this step matters
Responsive design handles window resizing and devicePixelRatio changes for crisp rendering on high-DPI displays. ResizeObserver provides efficient resize detection without performance-killing polling.

## Context
Implements responsive WebGL canvas sizing with proper handling of device pixel ratio for high-quality rendering across devices.

## Key Equations
- Canvas sizing: canvas.width = displayWidth × devicePixelRatio
- Aspect ratio: maintain simulation aspect ratio during resize
- DPR scaling: CSS pixels vs device pixels for high-DPI displays
- Performance impact: resolution scales quadratically with DPR

## Code
This step demonstrates responsive design:
- ResizeObserver for efficient resize detection
- Device pixel ratio handling for high-DPI displays
- Viewport aspect ratio preservation during window changes

## Visualisation
- **Type**: Responsive GPU simulation with DPR handling
- **Stack**: WebGL responsive canvas, ResizeObserver, DPR detection, aspect ratio preservation
- **What it shows**: Seamless resize behavior maintaining simulation quality across device types

## Learning outcome
After this step, the student can:
- implement responsive WebGL applications with proper DPR handling
- optimize resize performance with ResizeObserver
- maintain visual quality across diverse display technologies

## Test
- **File**: `src/tests/e2e/step094.test.ts`
- **Assertion**: Responsive layout with proper resize and DPR handling
- **Last result**: ✅ Passed