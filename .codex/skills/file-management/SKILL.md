---
name: file-management
description: Manage files safely and consistently in this Next.js project. Use when creating, moving, renaming, deleting, organizing, or ignoring files; adding assets; editing generated files; handling environment files; updating package files; or deciding where new code, docs, config, tests, and public assets belong.
---

# File Management

Keep the repo easy to scan, safe to change, and aligned with Next.js conventions. Prefer boring organization over clever folder structures.

## Placement

- Put route UI, layouts, and route states under `src/app` using App Router conventions.
- Put browser-served static files in `public/`; reference them with root-relative paths like `/logo.svg`.
- Keep global CSS in `src/app/globals.css`; add component-local styling through Tailwind classes first.
- Put shared app code under `src/` when it is imported by routes or components.
- Create feature folders only when they group code that changes together.
- Do not add root-level files unless they are standard project config, agent instructions, documentation, or tool metadata.

## Naming

- Use lowercase kebab-case for folders and non-component utility files.
- Use PascalCase for exported React component files only when the project starts using component files outside route conventions.
- Match framework filenames exactly: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`, and `template.tsx`.
- Keep names descriptive enough that imports read clearly without opening the file.

## Generated And Managed Files

- Do not edit `node_modules/`, `.next/`, `next-env.d.ts`, or generated route/type output.
- Treat `package-lock.json` as owned by npm; update it through npm commands, not manual edits.
- Keep `.gitignore` focused on generated output, local machine files, secrets, dependency folders, and build artifacts.
- Do not commit `.env*` files unless the user explicitly asks for an example file such as `.env.example`.

## Safe Edits

- Before moving or deleting files, check current references with `rg`.
- Avoid broad renames unless the import graph and route behavior are clear.
- When deleting, remove dead imports, dead assets, and stale references in the same change.
- Preserve user edits in dirty files. Work with them instead of overwriting or reverting.
- Prefer small, reviewable file moves over large reorganizations.

## Assets

- Keep inspectable product, UI, or content assets in `public/`.
- Optimize image usage through `next/image` when rendering meaningful images from React.
- Keep SVGs only when vector format is useful; do not store decorative or unused assets.
- Use stable, descriptive asset names such as `brand-logo.svg` or `dashboard-empty-state.png`.

## Documentation And Agent Files

- Keep project agent guidance in `AGENTS.md` and tool-specific forwarding in files like `CLAUDE.md`.
- Keep reusable AI-agent procedures in `.codex/skills/<skill-name>/SKILL.md`.
- Do not scatter duplicate instructions across many markdown files. Link to the source of truth instead.

## Verification

- Run `rg` after moves or renames to catch stale references.
- Run `npm run lint` after source or import changes.
- Run `npm run build` after changing routes, config, dependency files, public assets used at build time, or TypeScript paths.

## Official Sources

- Next project structure docs: `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
- Next public folder docs: https://nextjs.org/docs/app/getting-started/project-structure#public-folder
- Next static assets docs: https://nextjs.org/docs/app/getting-started/images
- npm package lock docs: https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json
- Git ignore docs: https://git-scm.com/docs/gitignore
