---
name: production-security
description: Prepare this Next.js app for production-quality behavior. Use when editing deployment settings, environment variables, secrets, auth, Server Actions, Route Handlers, caching, metadata, SEO, accessibility, images, fonts, scripts, headers, CSP, or performance-sensitive code.
---

# Production Security

Use this skill when a change can affect users, search crawlers, credentials, performance, accessibility, or deployment behavior.

## Security And Data

- Keep secrets on the server. Never expose private values through `NEXT_PUBLIC_` unless they are intentionally public.
- Validate and authorize every mutation in Server Actions and Route Handlers.
- Treat cookies, headers, params, form data, and JSON bodies as untrusted input.
- Avoid logging secrets, tokens, full cookies, or sensitive payloads.
- Use official Next guidance before adding CSP, custom headers, redirects, rewrites, or middleware/proxy behavior.

## Performance

- Keep Client Component boundaries small to reduce client JavaScript.
- Use `next/image`, `next/font`, and `next/script` for optimized assets and third-party scripts.
- Fetch data in parallel where possible and stream slow subtrees behind `Suspense` or `loading.tsx`.
- Be intentional about caching, revalidation, and dynamic APIs because they affect rendering mode and cost.
- Avoid importing large server-only packages into client modules.

## SEO And Metadata

- Use the Metadata API for route titles, descriptions, canonical URLs, Open Graph, Twitter cards, and robots.
- Add sitemap and robots files when the app has indexable production pages.
- Keep visible page content aligned with metadata claims.

## Accessibility

- Use semantic elements and labeled controls.
- Preserve keyboard focus and visible focus states.
- Add accessible error, loading, empty, and not-found states.
- Check color contrast for custom colors.

## Verification

- Run `npm run lint`.
- Run `npm run build`.
- Browser-check representative routes in production-like mode when release risk is meaningful.
- For major releases, run Lighthouse or equivalent lab checks and pair them with field data when available.

## Official Sources

- Next production checklist: https://nextjs.org/docs/app/guides/production-checklist
- Next data security guide: https://nextjs.org/docs/app/guides/data-security
- Next environment variables: https://nextjs.org/docs/app/guides/environment-variables
- Next Content Security Policy: https://nextjs.org/docs/app/guides/content-security-policy
- Next metadata docs: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
