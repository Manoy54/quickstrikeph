---
name: react-components
description: Build React 19 UI for this Next.js project. Use when creating or editing components, hooks, state, effects, forms, event handlers, refs, memoization, Context, Server Component composition, Client Component boundaries, hydration-sensitive UI, or React TypeScript props.
---

# React Components

Prefer simple, pure components. Let Next.js Server Components handle server work, and use Client Components only for interactivity or browser-only APIs.

## Component Boundaries

- Keep a component server-rendered unless it needs state, effects, event handlers, browser APIs, or a client-only dependency.
- Put `"use client"` at the top of the smallest module that needs it; everything imported by that module enters the client bundle.
- Pass only serializable props from Server Components into Client Components.
- Keep data loading out of `useEffect` when the data can be fetched on the server.

## State, Effects, And Hooks

- Keep render logic pure: do not mutate props, state, module globals, or external systems during render.
- Use effects to synchronize with external systems such as browser APIs, subscriptions, timers, or imperative widgets.
- Include every reactive value in effect dependency arrays. If a value should not be reactive, move it outside the component or restructure the code.
- Add cleanup for subscriptions, timers, observers, and event listeners.
- Avoid derived state when a value can be computed from props/state during render.
- Use React Compiler-era restraint: reach for `memo`, `useMemo`, and `useCallback` only after a real stability or performance need appears.

## Forms And Interactions

- Prefer semantic HTML controls and labels before custom interactions.
- Keep controlled inputs controlled for their whole lifetime.
- Use Server Actions or Route Handlers for mutations that need server trust, validation, secrets, or persistence.
- Keep optimistic UI reversible and reflect pending/error states clearly.

## TypeScript Props

- Type props close to the component.
- Use explicit prop object types for exported components.
- Prefer inferred hook return types unless an exported API needs a stable contract.

## Verification

- Run `npm run lint`.
- Run `npm run build` after changing Server/Client boundaries or props crossing that boundary.
- Browser-check hydration-sensitive changes, effects, forms, and interactive UI.

## Official Sources

- React Server Components `"use client"`: https://react.dev/reference/rsc/use-client
- React `"use server"`: https://react.dev/reference/rsc/use-server
- Components and hooks purity: https://react.dev/reference/rules/components-and-hooks-must-be-pure
- `useEffect`: https://react.dev/reference/react/useEffect
- React TypeScript guide: https://react.dev/learn/typescript
