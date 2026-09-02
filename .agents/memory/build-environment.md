---
name: Build environment
description: Environment-specific constraints for validating the PhishGuard web artifact.
---

The PhishGuard Vite build requires both `PORT` and `BASE_PATH` environment variables when run outside its managed workflow. The production build can emit a known tooltip sourcemap warning and a bundle-size advisory while still completing successfully.

**Why:** The app’s Vite configuration intentionally fails fast without the workflow-provided routing values, so a plain package build can look broken even when the managed preview is healthy.

**How to apply:** Use the managed workflow for preview checks, or provide the current artifact port and base path explicitly for standalone builds.