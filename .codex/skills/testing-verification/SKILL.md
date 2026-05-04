---
name: testing-verification
description: Verify changes in this Next.js project. Use when adding tests, choosing Jest/Vitest/Playwright/Cypress, validating async Server Components, checking UI behavior, reviewing regressions, running lint/build/dev commands, or deciding what test coverage is appropriate.
---

# Testing Verification

Match the verification depth to the risk of the change. This repo currently has lint and build scripts but no dedicated test runner.

## Baseline Checks

- Run `npm run lint` for source changes.
- Run `npm run build` for route, rendering, type, metadata, config, dependency, or production-sensitive changes.
- Run `npm run dev` and browser-check visual or interactive work.
- Include the exact command results in the final response when they matter.

## Choosing Tests

- Use unit tests for pure functions, small utilities, and deterministic hooks.
- Use component tests for client UI behavior when interactions can be isolated.
- Prefer E2E tests for critical user flows, routing behavior, forms, auth, and async Server Components.
- Use browser verification for layout, responsive behavior, hydration, and accessibility-sensitive interactions.

## Next.js Specifics

- Async Server Components may not be fully supported by every unit/component test tool; prefer E2E coverage for those until the chosen tool supports them well.
- Mock network and time explicitly in unit tests.
- Avoid snapshots for broad UI unless the output is intentionally stable and reviewed.

## If Adding A Runner

- Prefer the official Next.js testing guide for setup.
- Use Vitest for fast unit tests when the project does not require Jest-specific features.
- Use Playwright for E2E browser flows.
- Add scripts to `package.json`, keep config minimal, and verify the new scripts pass.

## Official Sources

- Next testing guide: https://nextjs.org/docs/app/guides/testing
- Next with Vitest: https://nextjs.org/docs/app/guides/testing/vitest
- Next with Playwright: https://nextjs.org/docs/app/guides/testing/playwright
- ESLint flat config: https://eslint.org/docs/latest/use/configure/configuration-files
