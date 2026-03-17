# Step 097 — Vite Production Build: Asset Hashing

| Field | Value |
|-------|-------|
| Chapter | 9 — Engineering & Deployment |
| Step ID | 097 |
| Status | ✅ Passing |

## Why this step matters
Production builds with asset hashing enable aggressive CDN caching while ensuring cache invalidation when code changes. This optimization dramatically improves loading performance for returning users.

## Context
Implements production build configuration with asset hashing and optimization for deployment to CDN-enabled hosting platforms.

## Key Equations
- Cache invalidation: filename hash changes → browser cache miss
- Compression ratio: gzip typically 70-80% size reduction
- Bundle splitting: separate vendor chunks for better caching
- Hash stability: content-based hashing for maximum cache efficiency

## Code
This step demonstrates production optimization:
- Vite build configuration with asset hashing
- Bundle analysis and optimization strategies
- CDN-optimized file structure and naming

## Visualisation
- **Type**: Text-based build analysis and deployment configuration
- **Stack**: Vite build system, asset hashing, bundle analysis
- **What it shows**: Production build optimization and CDN preparation

## Learning outcome
After this step, the student can:
- configure production builds with optimal caching strategies
- implement asset hashing for cache invalidation
- optimize bundle size and loading performance for web deployment

## Test
- **File**: `src/tests/e2e/step097.test.ts`
- **Assertion**: Production build with proper asset hashing and optimization
- **Last result**: ✅ Passed