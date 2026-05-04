---
name: nextjs-app-router
description: Build and maintain this Next.js App Router application. Use when editing app routes, layouts, templates, loading/error/not-found files, route handlers, Server Components, Client Component boundaries, data fetching, caching, metadata, fonts, images, scripts, navigation, or Next config.
---

# Next.js App Router

Use the installed Next.js docs as the primary source because this repo is on Next `16.2.4` and APIs may differ from older examples. Read only the relevant file under `node_modules/next/dist/docs/` before changing unfamiliar Next.js behavior.

## Local Context

- App code lives under `src/app`.
- Use TypeScript, App Router, React Server Components, Tailwind CSS v4, and npm scripts from `package.json`.
- Keep pages and layouts as Server Components by default.
- Add `"use client"` only to the smallest file that needs state, effects, event handlers, browser APIs, refs for DOM work, or client-only libraries.

## Routing

- Place route UI in `page.tsx`, shared route chrome in `layout.tsx`, and colocated route states in `loading.tsx`, `error.tsx`, `not-found.tsx`, and `global-error.tsx` when needed.
- Use `next/link` for internal navigation and `redirect`/`notFound` from Next APIs for route control.
- Treat `params` and `searchParams` according to the installed docs for this Next version; newer App Router examples often model them as promises.
- Keep URL state in search params only when it should be shareable or restorable.

## Data And Caching

- Fetch server data in Server Components, Route Handlers, or Server Actions before reaching for client-side effects.
- Do not call a Route Handler from a Server Component just to reach local backend code; call the shared server function directly.
- Avoid request waterfalls. Start independent data requests before awaiting them, or split slow subtrees behind `Suspense`/`loading.tsx`.
- Be explicit about caching. Use current Next docs for `fetch`, `use cache`, cache tags, revalidation, and dynamic APIs before adding caching behavior.
- Keep secrets, tokens, database calls, and filesystem access on the server side.

## Metadata, Assets, And Config

- Use the Metadata API for titles, descriptions, Open Graph, icons, robots, and sitemaps.
- Use `next/font` for fonts and `next/image` for meaningful images where optimization matters.
- Keep static public assets in `public/`; reference them from the root path, such as `/logo.svg`.
- Change `next.config.ts` only when the feature requires framework-level configuration.

## Verification

- Run `npm run lint` after code changes.
- Run `npm run build` after routing, rendering, data, metadata, or config changes.
- For visual or interactive changes, run `npm run dev` and verify in a browser.

## Official Sources

- Installed docs: `node_modules/next/dist/docs/01-app/`
- Next App Router docs: https://nextjs.org/docs/app
- Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Fetching data: https://nextjs.org/docs/app/getting-started/fetching-data
- Production checklist: https://nextjs.org/docs/app/guides/production-checklist
