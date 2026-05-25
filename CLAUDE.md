# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

The marketing/product site at `korzh.com`. A **Jekyll** static site (`source/` is the Jekyll source root — set via `source: source` in `_config.yml`) with a small **plain-JS** frontend bundled by **esbuild**. Deployed by **Netlify**, which runs the build on every push.

## Commands

- `npm run dev` — starts esbuild watch + Jekyll serve concurrently (one Ctrl-C kills both). Browse to `http://localhost:4000`.
- `npm run build` — production esbuild build (minified, no sourcemaps).
- `npm run watch` — esbuild watch only (rarely needed standalone).
- `npm start` — Jekyll serve only (rarely needed standalone).
- `npm run lint` / `npm run format` — `oxlint --fix` and `oxfmt --write`. `source/assets` is ignored by oxlint per `.oxlintrc.json`. That file also still ignores `scripts/build-metro.js` and `scripts/webpack.config.js`; both files were deleted in the reorg, so the entries are harmless no-ops — clean them up next time `.oxlintrc.json` is touched.

First-time setup: `npm install && bundle install` (Ruby and Bundler required for Jekyll).

There are no tests in this repo; verification is browser-based against `http://localhost:4000` (EasyQuery Get Trial dialog, ERSK Community download flow).

## Architecture

### Single esbuild pipeline

`scripts/esbuild.config.js` defines two builds in one process:

1. **Metro UI** — `scripts/src/pages/metro/index.js` (a curated subset of `@olton/metroui` components — adding a new Metro component means adding its import to this file) → `source/assets/metro/metro.{js,css}`. Uses `lessLoader`, `autoprefixer`, and `replace` plugins (the bundle has `__BUILD_TIME__` / `__VERSION__` placeholders).
2. **Site JS bundles** — three entries:
   - `scripts/src/shared/site.js` → `source/assets/js/site.js` (loaded on every page: `slow-loading` link indicator, bfcache reload).
   - `scripts/src/pages/easyquery/index.js` → `source/assets/js/easyquery.js` (EQ Get Trial dialog, reCAPTCHA trial flow, hash routing, EQ-specific mobile dialog CSS).
   - `scripts/src/pages/ersk/index.js` → `source/assets/js/ersk.js` (ERSK Get Community dialog + download flow).

All outputs are gitignored. Netlify rebuilds them on every deploy.

The CSS file `source/assets/css/index.css` is hand-written with native CSS nesting — not bundler-processed.

### Page wiring

`source/_layouts/default.html` always loads `/assets/metro/metro.{css,js}`, `/assets/css/index.css`, and `/assets/js/site.js`. A conditional `{% if page.bundle %}` block loads `/assets/js/<bundle>.js`. Pages opt in via front matter:

```yaml
---
layout: default
title: ...
bundle: easyquery    # or `ersk`, or omit entirely
---
```

Only `easyquery.html` and `easy-report-starter-kit.html` currently set `bundle`. All other pages emit no extra `<script>` tag.

### Pages and routing

- Top-level product pages live as `.html` files under `source/` (e.g. `easyquery.html`, `localizer.html`, `metroui.html`, `easy-report-starter-kit.html`, plus directories like `data-model-editor/`, `simple-query/`, `easyquery/`, `localizer/`).
- `source/blog/` holds the blog (already-generated HTML, not Markdown posts).
- **`source/_redirects` is the Netlify redirects/rewrites file** and is the single source of truth for URL routing. It is preserved into `_site` via the `include:` list in `_config.yml`. Several `/docs/*` paths are **rewritten (200!) to external Astro docs sites** (`easyquerynet-docs-astro.netlify.app`, `easyqueryjs-docs-astro.netlify.app`, `ersk-docs-astro.netlify.app`, `localizer-docs-astro.netlify.app`) — those docs are NOT in this repo. `/api/*`, `/account/*`, `/download/*`, etc. similarly proxy to other Korzh subdomains.

### Shared UI partials

`source/_includes/` holds reusable Jekyll partials used by `default.html`: `appbar.html` (nav), `footer.html`, gtag head/body snippets, etc. The site uses Google reCAPTCHA v3 (site key hardcoded in `default.html` and in the easyquery/ersk JS bundles).

### Frontend conventions

- Formatting is enforced by both `oxfmt` (`.oxfmtrc.json`) and `prettier` (`.prettierrc`) with **identical settings**: 4-space indent, 180 print width, double quotes, semicolons, trailing ES5 commas, LF endings.
- All page JS is plain ES modules (no TypeScript). The old `scripts/src/*.ts` Webpack pipeline was deleted in the reorg; if you need a fetch utility or DOM helper, write it as plain JS in `scripts/src/shared/`.

## Things to know before editing

- **Don't write to `_site/`** — it's the Jekyll build output. Edit `source/` instead.
- **Don't commit `source/assets/js/*.js` or `source/assets/metro/*`** — these are gitignored build outputs. If you see them in `git status`, that means a build ran; only stage source files.
- **`.ai-context/` is `.gitignored`** — anything in there is local-only scratch context.
- When changing assets, `npm run dev` rebuilds them automatically. If you change `_config.yml`, restart `npm run dev` (Jekyll doesn't auto-reload config).
- The Netlify deploy is fed by `git push`. Pushing to `main` ships to production; pushing to other branches (or opening PRs) creates a deploy preview.
