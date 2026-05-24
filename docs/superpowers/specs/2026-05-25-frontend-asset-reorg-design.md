# Frontend asset pipeline reorganisation — design

**Date:** 2026-05-25
**Status:** Approved (brainstorming phase)
**Author:** brainstorming session

## Problem

The frontend build for `korzh.com` is tangled across three independent pipelines and several scattered source files:

1. **Webpack** bundles `scripts/src/index.ts` (TypeScript: `auth.ts`, `dialogs.ts`, `utils.ts`) into `source/assets/js/app-client.min.js`, exposing a `GAZDA_CLIENT` global. **Audit finding: this output is gitignored and is not referenced by any HTML in the repo. The entire pipeline is dead code.**
2. **esbuild** bundles a curated subset of `@olton/metroui` (`scripts/src/metro.js`) into `source/assets/metro/metro.{js,css}`. This is the only currently-active JS pipeline.
3. **lessc** is wired in `package.json` (`compile:css`) to compile `source/assets/css/index.less` → `index.css`, but **`index.less` does not exist** in the repo. `index.css` is hand-written with native CSS nesting and committed directly.

On top of that:

- `source/assets/js/index.js` (580 lines, hand-written, loaded site-wide via `_layouts/default.html`) mixes EasyQuery trial logic and ERSK community-download logic in one monolithic `DOMContentLoaded` handler.
- `source/easy-report-starter-kit.html` contains an inline `<script>` block (lines 396–541) that is a **duplicate** of the ERSK logic already present in `index.js` (two copies of `getERSKCommunity`, `submitERSKData`, etc.).
- `source/assets/css/easydata.css` (2 184 lines) is committed but not referenced by any HTML — dead asset.
- Local development requires three concurrent processes (`npm start`, `npm run watch`, `npm run build:metro`).
- `netlify.toml` has no `[build]` section. Committed build outputs (`source/assets/metro/metro.{js,css}`) coexist with a CD that does not rebuild them — meaning if a contributor forgets to run `npm run build:metro` before committing, their changes silently fail to ship.

## Goals

- One build pipeline (esbuild), no Webpack, no lessc.
- Split JS into a site-wide bundle and per-page bundles for the two pages with non-trivial logic (`easyquery`, `easy-report-starter-kit`).
- De-duplicate the ERSK code.
- Single `npm run dev` for local development.
- Build outputs gitignored; Netlify rebuilds everything on every deploy.

## Non-goals

- No new framework (React, Vue, etc.).
- No restructure of the Jekyll site layout (pages stay where they are).
- No conversion of inline `<style>` blocks to a preprocessed CSS pipeline.
- No TypeScript adoption (deliberately moving the new code to plain JS).
- No restructure of external docs sites (the Astro projects proxied via `_redirects` are out of scope).

## Design

### Repository layout (after)

```
korzhcom-website/
├── scripts/
│   ├── esbuild.config.js          NEW: single esbuild config (runs both Metro
│   │                                   and the page bundles in one process)
│   └── src/
│       ├── shared/
│       │   └── site.js            NEW: site-wide handlers
│       │                               (slow-loading links, pageshow reload,
│       │                                mobile dialog CSS injection)
│       └── pages/
│           ├── easyquery/
│           │   └── index.js       NEW: extracted from source/assets/js/index.js
│           ├── ersk/
│           │   └── index.js       NEW: extracted + de-duplicated with inline ERSK script
│           └── metro/
│               └── index.js       MOVED from scripts/src/metro.js (curated Metro imports)
│
├── source/
│   ├── _layouts/default.html      MODIFIED: loads /assets/js/site.js + conditional page bundle
│   ├── easyquery.html             MODIFIED: front matter adds `bundle: easyquery`
│   ├── easy-report-starter-kit.html MODIFIED: front matter adds `bundle: ersk`;
│   │                                          inline <script> block removed
│   └── assets/
│       ├── css/
│       │   └── index.css          KEPT (hand-written, native CSS nesting)
│       ├── js/                    gitignored — build output of esbuild
│       └── metro/                 gitignored — build output of esbuild
│
├── .gitignore                     MODIFIED: + source/assets/js/, + source/assets/metro/
├── netlify.toml                   MODIFIED: + [build] and [build.environment] sections
└── package.json                   MODIFIED: scripts and deps overhaul
```

### Files and directories deleted

| Path                                | Reason                                         |
| ----------------------------------- | ---------------------------------------------- |
| `scripts/src/auth.ts`               | Unused — `GAZDA_CLIENT` bundle never loaded    |
| `scripts/src/dialogs.ts`            | Same                                           |
| `scripts/src/utils.ts`              | Same                                           |
| `scripts/src/index.ts`              | Same                                           |
| `scripts/webpack.config.js`         | Pipeline replaced by esbuild                   |
| `scripts/tsconfig.json`             | No more TypeScript in the project              |
| `less.bat`                          | LESS pipeline removed                          |
| `source/assets/css/easydata.css`    | Not referenced by any HTML                     |
| `source/assets/js/index.js`         | Replaced by `site.js` + per-page bundles       |
| `source/assets/js/app-client.min.js`| Already gitignored; will no longer be produced |

### Dev-deps removed

`webpack`, `webpack-cli`, `webpack-dev-server`, `clean-webpack-plugin`, `ts-loader`, `typescript`, `css-loader`, `style-loader`, `less-loader`, `less-plugin-clean-css`, `less`.

### Runtime deps removed

`@easydata/core`, `@easydata/ui` — both were only imported by the deleted `scripts/src/*.ts` files. No runtime code uses them. (Note: `easydata.css` is also gone for the same reason.)

### Dev-deps added

`concurrently` — single dev-dep for running esbuild and Jekyll watchers under one command.

Kept: `@olton/esbuild-plugin-autoprefixer`, `@olton/esbuild-plugin-progress`, `esbuild-plugin-less`, `esbuild-plugin-replace`, `autoprefixer`, `esbuild`, `cross-env`, `oxfmt`, `oxlint`, `prettier`, `shx`.

### Build pipeline

A single file `scripts/esbuild.config.js`:

```js
import { build, context } from "esbuild";
import { lessLoader } from "esbuild-plugin-less";
import autoprefixer from "@olton/esbuild-plugin-autoprefixer";
import { replace } from "esbuild-plugin-replace";
import progress from "@olton/esbuild-plugin-progress";
import pkg from "../node_modules/@olton/metroui/package.json" with { type: "json" };

const production = process.env.NODE_ENV === "production";
const watch = process.argv.includes("--watch");

const common = {
    bundle: true,
    minify: production,
    sourcemap: !production,
    target: ["es2020"],
    logLevel: "info",
};

const builds = [
    // Metro UI — JS + CSS, curated subset
    {
        ...common,
        entryPoints: ["scripts/src/pages/metro/index.js"],
        outfile: "source/assets/metro/metro.js",
        plugins: [
            progress({ text: "Metro UI" }),
            lessLoader(),
            autoprefixer(),
            replace({
                __BUILD_TIME__: new Date().toISOString(),
                __VERSION__: pkg.version,
            }),
        ],
    },
    // Site-wide + per-page JS bundles
    {
        ...common,
        entryPoints: {
            site:      "scripts/src/shared/site.js",
            easyquery: "scripts/src/pages/easyquery/index.js",
            ersk:      "scripts/src/pages/ersk/index.js",
        },
        outdir: "source/assets/js",
        entryNames: "[name]",
    },
];

if (watch) {
    for (const opts of builds) (await context(opts)).watch();
} else {
    for (const opts of builds) await build(opts);
}
```

**Outputs (all under `source/assets/`, all gitignored):**

- `metro/metro.js`, `metro/metro.css`
- `js/site.js`
- `js/easyquery.js`
- `js/ersk.js`

Two builds rather than one because the Metro build needs `lessLoader`, `autoprefixer`, and `replace` plugins that the page bundles don't.

### `package.json` scripts (after)

```json
{
  "scripts": {
    "build":  "cross-env NODE_ENV=production node scripts/esbuild.config.js",
    "watch":  "node scripts/esbuild.config.js --watch",
    "start":  "cross-env RUBYOPT=-W0 bundle exec jekyll serve --livereload --incremental",
    "dev":    "concurrently -k -n esbuild,jekyll -c blue,yellow \"npm:watch\" \"npm:start\"",
    "lint":   "oxlint . --fix",
    "format": "oxfmt . --write"
  }
}
```

Removed scripts: `clear:metro`, `build:metro`, `compile:css`.

### Page wiring

`source/_layouts/default.html` changes the end-of-`<body>` script section to:

```html
<script src="/assets/metro/metro.js"></script>
<script src="/assets/js/site.js"></script>
{% if page.bundle %}
<script src="/assets/js/{{ page.bundle }}.js"></script>
{% endif %}
```

Pages opt in via front matter:

```yaml
# source/easyquery.html
---
layout: default
title: EasyQuery — ad-hoc reporting and dynamic query builder
bundle: easyquery
---
```

```yaml
# source/easy-report-starter-kit.html
---
layout: default
title: ERSK — Easy Report Starter Kit
bundle: ersk
---
```

Pages that don't need a bundle (the other ~50 pages) emit no extra `<script>` tag.

### Module contents

**`scripts/src/shared/site.js` — site-wide behaviour (loaded on every page):**

- `slow-loading` link click handler (shows the Metro activity overlay before navigation).
- `pageshow` event handler that reloads when restored from bfcache.
- The mobile dialog CSS injection (the `.eq-mobile-fullscreen` media-query block currently injected from `index.js` lines 11–30).

**`scripts/src/pages/easyquery/index.js` — EasyQuery-only behaviour:**

- Hash-action routing (`#get-trial`, `#asp-core-edition`, etc. — `index.js` lines 9–45).
- `getTrial()` dialog construction, reCAPTCHA flow, `processTrialRequest()` (`index.js` lines 47–391).
- `trialChangeOptions`, `closeDialogs`, `showLoadIndicator` helpers if still local to this page.

**`scripts/src/pages/ersk/index.js` — ERSK community-download behaviour:**

- `getERSKCommunity()`, `handleERSKDownload()`, `submitERSKData()`, `setErskButtonState()` — single de-duplicated copy (using the version from `index.js`, dropping the inline copy from `easy-report-starter-kit.html`).
- Attaches click listener to `.get-ersk-community-btn` elements.

**`scripts/src/pages/metro/index.js` — Metro UI curated subset:**

- Same content as today's `scripts/src/metro.js` (reset, runtime, components, icons).

### Local dev workflow

**One-time setup:**
```
npm install
bundle install
```

**Daily dev:**
```
npm run dev
```

Starts:
- `esbuild --watch` — rebuilds `site.js`, `easyquery.js`, `ersk.js`, `metro/metro.{js,css}` on source change.
- `bundle exec jekyll serve --livereload --incremental` — rebuilds `_site/`, serves on `http://localhost:4000`, triggers browser reload.

`concurrently -k` propagates Ctrl-C to both subprocesses. Output is line-prefixed `[esbuild]` (blue) and `[jekyll]` (yellow).

**Edit cycle:** save a file under `scripts/src/` → esbuild writes the bundle into `source/assets/js/` (or `source/assets/metro/`) → Jekyll's incremental watcher sees the changed file under `source/` → copies into `_site/` → LiveReload tells the browser to refresh. Sub-second loop in practice.

**Production build locally** (sanity-check before pushing):
```
npm run build
bundle exec jekyll build
```

### Netlify CD

`netlify.toml` gets new sections added (existing `[[headers]]` block is preserved):

```toml
[build]
  command = "npm run build && bundle exec jekyll build"
  publish = "_site"

[build.environment]
  NODE_VERSION = "20"
  RUBY_VERSION = "3.3.0"
  NODE_ENV     = "production"
  JEKYLL_ENV   = "production"

[[headers]]
  for = "*.*"
  [headers.values]
    cache-control = "max-age=604800"
```

**Pipeline on every push:**
1. Clone branch.
2. `npm install` (uses lockfile).
3. `bundle install`.
4. `npm run build` — esbuild emits the four JS bundles + Metro CSS into `source/assets/`.
5. `bundle exec jekyll build` — consumes `source/` (including freshly-built assets) → `_site/`.
6. Publish `_site/`.

Deploy previews on PRs are automatic; same build command runs against the PR branch. Versions are pinned in `netlify.toml` rather than the Netlify UI so the build is reproducible from git.

## Migration plan

Land as four small, sequential PRs on `dev`. Each is independently shippable and revertable.

### PR 1 — Dead code removal (zero behaviour change)

- Delete `scripts/src/auth.ts`, `dialogs.ts`, `utils.ts`, `index.ts`.
- Delete `scripts/webpack.config.js`, `scripts/tsconfig.json`, `less.bat`.
- Delete `source/assets/css/easydata.css`.
- Remove the dev-deps and runtime deps listed above from `package.json`.
- Temporarily remove `package.json` scripts: `build`, `watch`, `compile:css`. (`build:metro` and `clear:metro` stay until PR 2 replaces the Metro pipeline.)
- Site behaviour is unchanged because everything removed is unreferenced.

### PR 2 — New build pipeline

- Add `scripts/esbuild.config.js`.
- Move `scripts/src/metro.js` → `scripts/src/pages/metro/index.js`.
- Extract `source/assets/js/index.js` into `scripts/src/shared/site.js` + `scripts/src/pages/easyquery/index.js` + `scripts/src/pages/ersk/index.js`. De-duplicate the ERSK code (keep the `index.js` version, drop the inline one).
- Add `bundle: easyquery` to `source/easyquery.html` front matter; `bundle: ersk` to `source/easy-report-starter-kit.html` front matter; delete the inline `<script>` block from ERSK (lines 396–541).
- Update `source/_layouts/default.html` to load `/assets/js/site.js` + the conditional `{% if page.bundle %}` tag.
- Add dev-dep: `concurrently`.
- Add new `package.json` scripts: `build`, `watch`, `dev`. Remove `build:metro`, `clear:metro`.
- Add `source/assets/js/*`, `source/assets/metro/*`, `!source/assets/js/.gitkeep` (or similar) to `.gitignore`.
- In the same commit: `git rm --cached source/assets/metro/metro.js source/assets/metro/metro.css source/assets/js/index.js`.
- Verify locally: `npm install && npm run dev` works, site behaviour matches prod.

### PR 3 — Netlify CD

- Add `[build]` and `[build.environment]` blocks to `netlify.toml`.
- Push to `dev` first; verify Netlify deploy preview builds green and the deploy renders correctly.
- Merge to `main` once verified.

### PR 4 — Documentation

- Update `CLAUDE.md`:
  - Replace the "three independent build pipelines" section with the esbuild description.
  - Update the Commands section to reflect the new `npm run dev` / `npm run build` scripts.
  - Update the gitignore note (build outputs are now gitignored).
- Add a brief "Local development" section to `README.md` (currently a one-line placeholder).

**Rollback story:** PRs 1–2 don't touch CD and can be reverted without affecting the live site. If PR 3 breaks the Netlify build, reverting that one commit restores the prior CD config (which was a no-op `[[headers]]`-only file plus whatever Netlify UI had configured).

**Ordering invariant:** PR 1 → PR 2 → PR 3 → PR 4. Skipping PR 1 means PR 2 carries unreferenced files. Skipping PR 2 means PR 3's `npm run build` has no entry to run.

## Risks and open questions

- **Netlify UI environment variables.** Any env vars currently set in the Netlify UI will continue to apply alongside `[build.environment]` in `netlify.toml`. Worth a quick check during PR 3 that nothing in the UI conflicts with the pinned `NODE_VERSION` / `RUBY_VERSION`.
- **Ruby version pin.** `RUBY_VERSION = "3.3.0"` is chosen to match Netlify's currently-supported images for Jekyll 4. If Netlify drops this, the pin needs updating; failure mode is a clear build error, not a silent runtime issue.
- **First production deploy.** PR 3 is the first time Netlify runs `npm run build` for this site. Mitigation: validate on `dev` branch deploy preview before merging to `main`.
- **Metro UI bundle size unchanged.** The curated `pages/metro/index.js` is byte-for-byte the same as the current `scripts/src/metro.js` — Metro's `metro.{js,css}` output stays the same size as it is today.
- **CDN cache.** The new bundle filenames (`site.js`, `easyquery.js`, `ersk.js`) replace `index.js`. The `cache-control: max-age=604800` (7 days) header means a returning visitor whose browser holds a cached `index.js` will keep that copy until it expires. Acceptable: the new layout no longer emits `<script src="/assets/js/index.js">`, so the browser never re-fetches it — the cached copy becomes inert and is simply evicted on its own schedule. There's no broken request and no behavioural regression.
