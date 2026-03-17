# Step 095 — URL Hash Navigation: Deep Linking

| Field | Value |
|-------|-------|
| Chapter | 9 — Engineering & Deployment |
| Step ID | 095 |
| Status | ✅ Passing |

## Why this step matters
URL hash navigation enables bookmarking and sharing specific simulation states. Using window.location.hash and history.pushState creates a professional user experience with proper browser integration.

## Context
Implements URL-based state management for bookmarkable and shareable simulation configurations.

## Key Equations
- State encoding: parameters → base64 → URL hash fragment
- Deep linking: URL → parameters → simulation state restoration
- History management: pushState for back/forward browser navigation
- State compression: minimize URL length while preserving precision

## Code
This step demonstrates URL navigation:
- Parameter serialization to URL hash fragments
- Browser history integration with pushState/popState
- Automatic state restoration from bookmarked URLs

## Visualisation
- **Type**: Text-based URL state management demonstration
- **Stack**: URL hash parsing, history API, state serialization
- **What it shows**: URL-based parameter sharing and bookmark functionality

## Learning outcome
After this step, the student can:
- implement URL-based state management for web applications
- create shareable and bookmarkable scientific simulations
- integrate properly with browser navigation and history

## Test
- **File**: `src/tests/e2e/step095.test.ts`
- **Assertion**: URL hash navigation with state persistence and sharing
- **Last result**: ✅ Passed