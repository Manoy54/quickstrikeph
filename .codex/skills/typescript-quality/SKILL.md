---
name: typescript-quality
description: Keep TypeScript strict and maintainable in this Next.js project. Use when editing `.ts`, `.tsx`, `.mts`, `tsconfig.json`, shared types, component props, route params, Server Actions, API payloads, imports, module boundaries, or type errors.
---

# TypeScript Quality

Preserve strict TypeScript as a design tool, not just a compiler hurdle. Prefer clear domain types and safe narrowing over assertions.

## Project Defaults

- Keep `strict: true`, `noEmit: true`, `moduleResolution: "bundler"`, and the Next TypeScript plugin unless there is a framework-supported reason to change them.
- Use the `@/*` alias for imports from `src/*`.
- Keep app code in TypeScript unless the user explicitly asks for JavaScript.
- Treat generated `.next/types` as read-only.

## Type Design

- Prefer exact object shapes for props, route data, and API payloads.
- Use `unknown` at unsafe boundaries, then narrow with runtime checks.
- Avoid `any`; if it is unavoidable, isolate it and explain why in a short comment.
- Prefer discriminated unions for variant state.
- Use `satisfies` for config-like objects when preserving literal types is useful.
- Avoid non-null assertions unless the invariant is obvious or locally checked.

## React And Next Types

- Type exported component props explicitly.
- Let JSX and hook internals infer types when the inference is clear.
- Use framework-provided types such as `Metadata`, `NextRequest`, or `NextConfig` where applicable.
- For Server Actions and Route Handlers, validate input at runtime before trusting TypeScript types.

## Verification

- Run `npm run lint`.
- Run `npm run build` because Next performs TypeScript checks and route type generation during builds.

## Official Sources

- TypeScript TSConfig reference: https://www.typescriptlang.org/tsconfig/
- TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/intro.html
- React TypeScript guide: https://react.dev/learn/typescript
- Next TypeScript config docs: `node_modules/next/dist/docs/01-app/03-api-reference/05-config/02-typescript.md`
