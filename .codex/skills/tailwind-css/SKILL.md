---
name: tailwind-css
description: Style this project with Tailwind CSS v4. Use when editing class names, `src/app/globals.css`, CSS theme tokens, dark mode, responsive layout, design systems, component styling, animations, focus states, or Tailwind source detection and safelisting.
---

# Tailwind CSS

This project uses Tailwind CSS v4 through `@import "tailwindcss";` in `src/app/globals.css` and `@tailwindcss/postcss` in `postcss.config.mjs`. Use the v4 docs, not v3 config patterns, unless a dependency explicitly requires v3.

## Styling Rules

- Prefer utility classes in components for layout, spacing, typography, color, and states.
- Put global element styles, CSS variables, and Tailwind `@theme` tokens in `src/app/globals.css`.
- Keep design tokens semantic when they represent project meaning; avoid one-off global variables for a single component.
- Use responsive prefixes deliberately and keep mobile layout usable before widening the viewport.
- Use `focus-visible` states for keyboard interaction.
- Use `prefers-color-scheme` or Tailwind dark-mode patterns consistently; do not mix competing dark-mode strategies.

## Tailwind v4 Notes

- Tailwind scans source files for class-like tokens; keep class names complete and statically discoverable.
- Do not build class names through string concatenation such as `"text-" + color + "-600"`. Use a map of complete class strings.
- Use `@source` or `@source inline()` only when automatic detection misses real classes or a safelist is necessary.
- Use CSS-first `@theme` customization for project tokens.

## UI Quality

- Keep repeated UI components consistent in spacing, radius, typography, and focus states.
- Prefer stable dimensions for buttons, toolbars, grids, and cards so hover or dynamic text does not shift layout.
- Avoid styling that hides accessible names, focus outlines, or form labels.
- Check light and dark backgrounds for contrast when adding colors.

## Verification

- Run `npm run lint`.
- Run `npm run build` to catch invalid classes that interact with production CSS generation.
- Browser-check responsive and dark-mode changes.

## Official Sources

- Tailwind CSS docs: https://tailwindcss.com/docs
- Tailwind detecting classes: https://tailwindcss.com/docs/detecting-classes-in-source-files
- Tailwind functions and directives: https://tailwindcss.com/docs/functions-and-directives
- Tailwind theme variables: https://tailwindcss.com/docs/theme
