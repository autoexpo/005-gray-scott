# Step 086 — 3D Surface: Vertex Displacement by U

| Field | Value |
|-------|-------|
| Chapter | 8 — Extensions & Analysis |
| Step ID | 086 |
| Status | ✅ Passing |

## Why this step matters
Mapping 2D concentration fields to 3D surface height creates "chemical landscapes" that reveal pattern topology and gradient information invisible in flat 2D views. This visualization technique is widely used in materials science and biology.

## Context
Transforms 2D Gray-Scott concentration field into 3D heightfield surface for enhanced pattern topology visualization.

## Key Equations
- Height mapping: z = A × U(x,y) where A is amplitude scaling
- Surface normal: n̂ = (-∂z/∂x, -∂z/∂y, 1) / ||(−∂z/∂x, −∂z/∂y, 1)||
- Gradient magnitude: |∇U| = √((∂U/∂x)² + (∂U/∂y)²)
- Curvature: κ = ∇²U at each point

## Code
This step demonstrates heightfield visualization:
- WebGL vertex shader height displacement
- Real-time surface normal calculation and lighting
- Interactive camera controls for 3D exploration

## Visualisation
- **Type**: Three.js heightfield surface with real-time pattern mapping
- **Stack**: Three.js heightfield geometry, WebGL vertex displacement, dynamic lighting
- **What it shows**: 3D chemical landscape revealing pattern topology and gradients

## Learning outcome
After this step, the student can:
- implement heightfield visualization for 2D scalar fields
- understand surface topology and its relationship to field gradients
- create effective 3D representations of 2D scientific data

## Test
- **File**: `src/tests/e2e/step086.test.ts`
- **Assertion**: 3D heightfield surface with real-time pattern displacement
- **Last result**: ✅ Passed