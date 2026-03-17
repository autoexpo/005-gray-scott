# Step 098 — Cloudflare Pages Deployment

| Field | Value |
|-------|-------|
| Chapter | 9 — Engineering & Deployment |
| Step ID | 098 |
| Status | ✅ Passing |

## Why this step matters
Cloudflare Pages provides global CDN deployment with zero cold start, making scientific web applications instantly available worldwide. Understanding this deployment pipeline is essential for sharing interactive educational content.

## Context
Demonstrates deployment to Cloudflare Pages using wrangler CLI with global CDN distribution and edge optimization.

## Key Equations
- Global latency: edge servers reduce RTT to <50ms worldwide
- Cache hit ratio: static assets cached at edge with 99.9% hit rate
- Bandwidth scaling: CDN handles traffic spikes without origin load
- Cold start elimination: static hosting = zero server initialization delay

## Code
This step demonstrates deployment process:
- wrangler pages deploy configuration and commands
- Environment variable management for production
- Domain setup and SSL certificate provisioning

## Visualisation
- **Type**: Text-based deployment guide and configuration management
- **Stack**: Cloudflare Pages, wrangler CLI, global CDN deployment
- **What it shows**: Complete deployment process from build to global availability

## Learning outcome
After this step, the student can:
- deploy web applications to global CDN infrastructure
- configure domain names and SSL certificates
- manage environment variables and deployment pipelines

## Test
- **File**: `src/tests/e2e/step098.test.ts`
- **Assertion**: Successful deployment to Cloudflare Pages with global CDN
- **Last result**: ✅ Passed