# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

The marketing/product site at `korzh.com`. A **Jekyll** static site (`source/` is the Jekyll source root — set via `source: source` in `_config.yml`) with a small **TypeScript + LESS** frontend bundled by Webpack/esbuild. Deployed by **Netlify**.

## Commands

Most workflows need two processes running side by side:

- `npm start` — Jekyll dev server with livereload (`bundle exec jekyll serve --livereload --incremental`). Requires Ruby + `bundle install` first.
- `npm run watch` — Webpack watch for the TypeScript client bundle.
- `npm run build` — Production Webpack build.
- `npm run build:metro` — Clears `source/assets/metro/*` and rebuilds the Metro UI bundle via esbuild. Also runnable in watch mode by setting `MODE` to anything other than `production`.
- `npm run compile:css` — Compile `source/assets/css/index.less` → `index.css` (also available as `less.bat` on Windows).
- `npm run lint` / `npm run format` — `oxlint --fix` and `oxfmt --write`. Note: `source/assets`, `scripts/build-metro.js`, and `scripts/webpack.config.js` are ignored by oxlint (see `.oxlintrc.json`).

There are no tests in this repo.

## Architecture

### Three independent build pipelines feed `source/assets/`

1. **Webpack** (`scripts/webpack.config.js`) bundles `scripts/src/index.ts` → `source/assets/js/app-client.min.js`, exposing a `GAZDA_CLIENT` global. The TS entry re-exports `dialogs`, `utils`, and `auth` (account register/login/extend-trial against `https://korzh.com/api/account`).
2. **esbuild** (`scripts/build-metro.js`) bundles a **curated subset** of `@olton/metroui` components (listed in `scripts/src/metro.js`) → `source/assets/metro/metro.{js,css}`. Adding a new Metro component means adding its import here. The bundle has `__BUILD_TIME__` / `__VERSION__` placeholders replaced at build time.
3. **lessc** compiles `source/assets/css/index.less` → `index.css`.

The Jekyll layout (`source/_layouts/default.html`) loads `/assets/metro/metro.{css,js}`, `/assets/css/index.css`, and `/assets/js/index.js`. **`index.js` is hand-written page logic**, not a Webpack output — it's separate from `app-client.min.js` (which is `.gitignored`). Don't confuse them when editing.

### Pages and routing

- Top-level product pages live as `.html` files under `source/` (e.g. `easyquery.html`, `localizer.html`, `metroui.html`, `easy-report-starter-kit.html`, plus directories like `data-model-editor/`, `simple-query/`, `easyquery/`, `localizer/`).
- `source/blog/` holds the blog (already-generated HTML, not Markdown posts).
- **`source/_redirects` is the Netlify redirects/rewrites file** and is the single source of truth for URL routing. It is preserved into `_site` via the `include:` list in `_config.yml`. Several `/docs/*` paths are **rewritten (200!) to external Astro docs sites** (`easyquerynet-docs-astro.netlify.app`, `easyqueryjs-docs-astro.netlify.app`, `ersk-docs-astro.netlify.app`, `localizer-docs-astro.netlify.app`) — those docs are NOT in this repo. `/api/*`, `/account/*`, `/download/*`, etc. similarly proxy to other Korzh subdomains.

### Shared UI partials

`source/_includes/` holds the reusable Jekyll partials used by `default.html`: `appbar.html` (nav), `footer.html`, gtag head/body snippets, etc. The site uses Google reCAPTCHA v3 (site key hardcoded in `default.html` and `index.js`).

### Frontend conventions

- Formatting is enforced by both `oxfmt` (`.oxfmtrc.json`) and `prettier` (`.prettierrc`) with **identical settings**: 4-space indent, 180 print width, double quotes, semicolons, trailing ES5 commas, LF endings.
- The TypeScript code uses the `@easydata/core` `HttpClient` and `@easydata/ui` `domel`/`DialogService` for auth dialogs — this is the project's UI toolkit, not raw DOM.

## Things to know before editing

- **Don't write to `_site/`** — it's the Jekyll build output. Edit `source/` instead.
- **`.ai-context/` is `.gitignored`** — anything in there is local-only scratch context.
- When changing assets that Webpack/esbuild produce, run the matching build, not just the Jekyll server — Jekyll only re-copies whatever exists under `source/assets/`.
- Jekyll does NOT auto-reload `_config.yml` changes; restart `npm start` after editing it.
