# Frontend Asset Pipeline Reorganisation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate the three current build pipelines (Webpack + esbuild + lessc) into a single esbuild pipeline, split the monolithic site-wide `index.js` into a shared site bundle plus per-page bundles for EasyQuery and ERSK, de-duplicate the ERSK download logic, gitignore build outputs, and wire Netlify CD to rebuild on every push.

**Architecture:** Single `scripts/esbuild.config.js` produces four outputs (`metro/metro.{js,css}`, `js/site.js`, `js/easyquery.js`, `js/ersk.js`) into `source/assets/`. Pages opt into per-page bundles via Jekyll front matter (`bundle: <name>`); the layout emits a conditional `<script>` tag. Local dev runs both esbuild watch and Jekyll serve under a single `npm run dev` (concurrently). Netlify rebuilds everything on every deploy via a new `[build]` section in `netlify.toml`.

**Tech Stack:** Jekyll 4, Node 20, esbuild, concurrently, plain ES module JavaScript, Metro UI (`@olton/metroui`), Netlify CD.

**Context for the engineer:** This is a Jekyll static site at `korzh.com`. Source under `source/` is the Jekyll source root (set in `_config.yml`). The reorg is described in the spec at `docs/superpowers/specs/2026-05-25-frontend-asset-reorg-design.md` — read it before starting. There are no automated tests in this repo; verification is browser-based against `http://localhost:4000`. The work is split into four sequential commits/PRs (groups A, B, C, D below). Each is independently revertable. **Do all four on the same branch (`feature-refactor-js`)** — they're already a coherent reorg, and slicing into separate GitHub PRs (vs. one PR with four commits) is the user's call at submission time.

**Platform notes:** The repo is on Windows + PowerShell, but the Bash tool is available for POSIX-style commands. All shell commands below are POSIX bash. The git user is `Oleksandr Melnychenko`; commit author is already configured.

**Verification baseline:** Before starting, capture current behaviour:
```bash
npm install
bundle install
npm run build:metro                     # produces source/assets/metro/*
bundle exec jekyll serve --livereload   # http://localhost:4000
```
Visit `http://localhost:4000/easyquery` → click "Get Trial" → dialog opens with app-type select. Visit `http://localhost:4000/easy-report-starter-kit` → click "Get ERSK Community" → dialog opens with email field. Both must continue to work end-to-end after the reorg.

---

## Group A — PR 1: Dead code removal

**Outcome:** Site behaves identically. Unreferenced code (Webpack pipeline, dead TypeScript modules, `easydata.css`, the LESS pipeline that has no source file) is gone. Dev-deps shrink correspondingly.

### Task A1: Verify the code being deleted is truly unreferenced

**Files:** (no edits — verification only)

- [ ] **Step 1: Confirm `GAZDA_CLIENT` / `app-client.min.js` are not loaded by any layout, include, or page.**

Run:
```bash
grep -r "GAZDA_CLIENT\|app-client" source --include="*.html" --include="*.md" --include="*.yml" -l
```
Expected output: only matches in `source/blog/typescript-webpack-aspnetcore/index.html` (an old blog post mentioning the term in prose) and `source/blog/rss.xml` / `atom.xml` / generated blog assets. **No matches in `source/_layouts/`, `source/_includes/`, or any product page.** If there are any other matches, STOP and report them — the spec's "dead code" assumption needs revisiting.

- [ ] **Step 2: Confirm none of the auth/dialog API is called from any HTML or JS in `source/`.**

Run:
```bash
grep -r "showAuthDialog\|registerAccount\|loginToAccount\|extendTrialLicense" source -l
```
Expected output: empty (no files found). If anything matches, STOP.

- [ ] **Step 3: Confirm `easydata.css` is not referenced.**

Run:
```bash
grep -r "easydata\.css" source -l
```
Expected output: only `source/assets/css/easydata.css` itself (its own sourceMappingURL comment). No HTML/layout matches.

- [ ] **Step 4: Confirm `source/assets/css/index.less` does not exist.**

Run:
```bash
ls source/assets/css/
```
Expected output: `easydata.css  index.css`. No `.less` file.

### Task A2: Delete unused source files

**Files:**
- Delete: `scripts/src/auth.ts`
- Delete: `scripts/src/dialogs.ts`
- Delete: `scripts/src/utils.ts`
- Delete: `scripts/src/index.ts`
- Delete: `scripts/webpack.config.js`
- Delete: `scripts/tsconfig.json`
- Delete: `less.bat`
- Delete: `source/assets/css/easydata.css`

- [ ] **Step 1: Delete the files.**

Run:
```bash
git rm scripts/src/auth.ts scripts/src/dialogs.ts scripts/src/utils.ts scripts/src/index.ts
git rm scripts/webpack.config.js scripts/tsconfig.json
git rm less.bat
git rm source/assets/css/easydata.css
```

- [ ] **Step 2: Confirm only the curated Metro entry remains in `scripts/src/`.**

Run:
```bash
ls scripts/src/
```
Expected output: `metro.js` (and nothing else). If anything extra appears, STOP and investigate before proceeding.

### Task A3: Update `package.json` — remove dead scripts and dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Replace the contents of `package.json`.**

Write `package.json` with this exact content:

```json
{
  "name": "korzh-website",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "type": "module",
  "scripts": {
    "clear:metro": "shx rm -rf source/assets/metro/*",
    "start": "cross-env RUBYOPT=-W0 bundle exec jekyll serve --livereload --incremental",
    "build:metro": "npm run clear:metro && cross-env MODE=production node ./scripts/build-metro.js",
    "lint": "oxlint . --fix",
    "format": "oxfmt . --write"
  },
  "keywords": [],
  "author": "Korzh.com",
  "license": "MIT",
  "devDependencies": {
    "@netlify/plugin-sitemap": "^0.8.1",
    "@olton/esbuild-plugin-autoprefixer": "^0.2.2",
    "@olton/esbuild-plugin-progress": "^0.4.0",
    "@olton/metroui": "^5.1.20",
    "autoprefixer": "^10.4.22",
    "cross-env": "^10.1.0",
    "esbuild": "^0.26.0",
    "esbuild-plugin-less": "^1.3.31",
    "esbuild-plugin-replace": "^1.4.0",
    "oxfmt": "^0.27.0",
    "oxlint": "^1.42.0",
    "prettier": "3.4.2",
    "shx": "^0.4.0"
  },
  "dependencies": {}
}
```

**What changed from the previous file:**
- Removed scripts: `watch`, `build`, `compile:css` (Webpack and lessc are gone).
- Kept scripts: `clear:metro`, `start`, `build:metro`, `lint`, `format` (the only ones that currently work end-to-end; `build:metro` survives PR 1 because it's the only active build pipeline and PR 2 replaces it).
- Removed dev-deps: `clean-webpack-plugin`, `css-loader`, `less`, `less-loader`, `less-plugin-clean-css`, `style-loader`, `ts-loader`, `typescript`, `webpack`, `webpack-cli`, `webpack-dev-server`.
- Removed runtime deps: `@easydata/core`, `@easydata/ui`.
- Moved `@olton/metroui` from `dependencies` to `devDependencies` (it's a build-time dep of `scripts/build-metro.js`, not loaded at runtime).
- Emptied `dependencies` block (kept as `{}` for clarity that this is intentional).

### Task A4: Refresh `node_modules` and lockfile

- [ ] **Step 1: Remove `node_modules` and reinstall.**

Run:
```bash
rm -rf node_modules
npm install
```
Expected: install succeeds; the lockfile (`package-lock.json`) is regenerated without the removed deps.

- [ ] **Step 2: Confirm removed packages are gone from the lockfile.**

Run:
```bash
grep -E '"(webpack|ts-loader|typescript|less-loader|@easydata/core|@easydata/ui)"' package-lock.json | head
```
Expected: only transitive matches (e.g. `webpack-sources` may still appear as a transitive of something else, but `"webpack":` as a top-level dep should not). If `"webpack":` appears as a direct dep, STOP — `npm install` didn't pick up the changes.

### Task A5: Verify the site still builds and runs

- [ ] **Step 1: Build Metro and Jekyll.**

Run:
```bash
npm run build:metro
bundle exec jekyll build
```
Expected: both complete without errors. `_site/` is populated.

- [ ] **Step 2: Verify `_site/assets/js/index.js` still exists.**

Run:
```bash
ls _site/assets/js/
```
Expected: `index.js` is present (the hand-written one in `source/assets/js/` is still there; we haven't moved it yet — that's PR 2).

- [ ] **Step 3: Start the dev server and smoke-test in a browser.**

Run:
```bash
npm start
```
In a browser:
1. Open `http://localhost:4000/easyquery` — page renders, app-bar loads.
2. Click the "Get Trial" button — dialog opens with the app-type select.
3. Open `http://localhost:4000/easy-report-starter-kit` — page renders.
4. Click the "Get ERSK Community" button — dialog opens with the email field.

Both flows must work. Ctrl-C the server.

### Task A6: Commit PR 1

- [ ] **Step 1: Stage and commit.**

Run:
```bash
git add package.json package-lock.json
git status
```
Expected `git status` output: `package.json` and `package-lock.json` modified; all the deleted files listed as deleted (from `git rm` in Task A2).

```bash
git commit -m "$(cat <<'EOF'
Remove dead build pipelines and unreferenced source

- Delete the Webpack pipeline (scripts/src/{auth,dialogs,utils,index}.ts,
  scripts/webpack.config.js, scripts/tsconfig.json) — the GAZDA_CLIENT
  bundle it produces was gitignored and not loaded by any layout or page.
- Delete less.bat — the LESS pipeline it invokes references
  source/assets/css/index.less, which doesn't exist (index.css is
  hand-written with native CSS nesting).
- Delete source/assets/css/easydata.css — not referenced by any HTML.
- Remove now-unused dev-deps and runtime deps from package.json.
- Move @olton/metroui to devDependencies (it's a build-time dep of
  scripts/build-metro.js, not loaded at runtime).

Site behaviour is unchanged; this is purely subtractive.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 2: Verify the commit.**

Run:
```bash
git show --stat HEAD
```
Expected: 9 file deletions (`scripts/src/auth.ts`, `dialogs.ts`, `utils.ts`, `index.ts`, `webpack.config.js`, `tsconfig.json`, `less.bat`, `source/assets/css/easydata.css`) plus modifications to `package.json` and `package-lock.json`.

---

## Group B — PR 2: New build pipeline

**Outcome:** A single `scripts/esbuild.config.js` produces four bundles. The monolithic `source/assets/js/index.js` is split into `scripts/src/shared/site.js` + `scripts/src/pages/{easyquery,ersk}/index.js`. ERSK download logic is de-duplicated (inline `<script>` in `easy-report-starter-kit.html` is removed). Build outputs are gitignored. `npm run dev` starts everything.

### Task B1: Create the new source directory structure

**Files:**
- Create: `scripts/src/shared/` (directory)
- Create: `scripts/src/pages/easyquery/` (directory)
- Create: `scripts/src/pages/ersk/` (directory)
- Create: `scripts/src/pages/metro/` (directory)

- [ ] **Step 1: Create the directories.**

Run:
```bash
mkdir -p scripts/src/shared scripts/src/pages/easyquery scripts/src/pages/ersk scripts/src/pages/metro
```

### Task B2: Move the Metro entry into the new location

**Files:**
- Move: `scripts/src/metro.js` → `scripts/src/pages/metro/index.js`

- [ ] **Step 1: Move the file with `git mv` (preserves history).**

Run:
```bash
git mv scripts/src/metro.js scripts/src/pages/metro/index.js
```

- [ ] **Step 2: Verify.**

Run:
```bash
ls scripts/src/
ls scripts/src/pages/metro/
```
Expected: `scripts/src/` contains only the `pages/` and `shared/` directories. `scripts/src/pages/metro/` contains `index.js`.

### Task B3: Write `scripts/src/shared/site.js`

**Files:**
- Create: `scripts/src/shared/site.js`

This module contains the truly site-wide handlers: the bfcache reload and the `slow-loading` link click handler with its `showLoadIndicator` helper. (The mobile-dialog CSS injection is **EQ-specific** and moves to the EasyQuery bundle in Task B4 — it targets the `.eq-mobile-fullscreen` class which is only used inside the EQ Get-Trial dialog. The spec mentioned it under site-wide, but the class is EQ-only; correcting here.)

- [ ] **Step 1: Write the file.**

Write `scripts/src/shared/site.js` with this exact content:

```js
// Site-wide handlers loaded on every page.
// Sourced from source/assets/js/index.js (the bits not specific to EQ or ERSK).

document.addEventListener("DOMContentLoaded", () => {
    // Reload when the page is restored from the browser's back-forward cache.
    // Without this, Metro dialog state can desync after navigating back.
    window.addEventListener("pageshow", function (event) {
        if (event.persisted) {
            window.location.reload();
        }
    });

    // Show a loading overlay when the user clicks a link marked `slow-loading`
    // (typically external proxied docs sites that take a few seconds to respond).
    if (typeof $ !== "undefined") {
        $("body").on("click", "a[slow-loading]", function () {
            showLoadIndicator();
        });
    }

    function showLoadIndicator() {
        if (typeof Metro !== "undefined" && Metro.activity) {
            Metro.activity.open({
                type: "cycle",
                overlayColor: "#fff",
                overlayAlpha: 0.6,
                text: '<div class="mt-2 text-small">Loading...</div>',
            });
        }
    }
});
```

### Task B4: Write `scripts/src/pages/easyquery/index.js`

**Files:**
- Create: `scripts/src/pages/easyquery/index.js`

This module contains everything in `source/assets/js/index.js` lines 9–402 except the slow-loading link handler (which moved to `site.js` in Task B3). It includes:
- The mobile dialog CSS injection (EQ-specific `.eq-mobile-fullscreen` class).
- Hash-action routing (`#get-trial`, `#asp-core-edition`, etc.).
- The `#btn-get-trial` click handler.
- `trialChangeOptions`, `getTrial`, `closeDialogs`, `processTrialRequest`.

- [ ] **Step 1: Write the file.**

Write `scripts/src/pages/easyquery/index.js` with this exact content:

```js
// EasyQuery product-page logic: hash-action routing, Get Trial dialog,
// trial-request submission with reCAPTCHA. Loaded only on /easyquery
// via the `bundle: easyquery` front-matter key.

document.addEventListener("DOMContentLoaded", () => {
    const reCaptchaSiteKey = "6LeNDYMsAAAAALRDQNC4MOiETC9uD8gIj8AdRNjd";

    // Inject EQ-specific mobile-fullscreen dialog CSS.
    const mobileDialogStyle = document.createElement("style");
    mobileDialogStyle.innerHTML = `
        @media screen and (max-width: 768px) {
            .eq-mobile-fullscreen {
                width: 100vw !important;
                height: 100vh !important;
                max-width: 100vw !important;
                max-height: 100vh !important;
                margin: 0 !important;
                top: 0 !important;
                left: 0 !important;
                transform: none !important;
                border-radius: 0 !important;
                overflow-x: hidden !important;
                overflow-y: auto !important;
                border: none !important;
            }
        }
    `;
    document.head.appendChild(mobileDialogStyle);

    // Hash-action routing: /easyquery#get-trial opens the trial dialog,
    // /easyquery#asp-core-edition (and siblings) scroll to the licensing
    // section and open the matching tab.
    const eqAction = window.location.href.split("#")[1];

    if (eqAction === "get-trial") {
        getTrial();
    } else {
        const editions = [
            "asp-core-edition",
            "asp-net-edition",
            "winforms-edition",
            "silverlight-edition",
            "wpf-edition",
            "delphi-edition",
        ];
        if (editions.includes(eqAction)) {
            const licensingEl = document.getElementById("licensing");
            if (licensingEl) {
                licensingEl.scrollIntoView();
            }
            if (typeof $ !== "undefined" && typeof Metro !== "undefined") {
                Metro.getPlugin("#license-price", "tabs").open(editions.indexOf(eqAction) + 1);
            }
        }
    }

    // "Get Trial" button.
    const getTrialBtn = document.getElementById("btn-get-trial");
    if (getTrialBtn) {
        getTrialBtn.addEventListener("click", (e) => {
            e.preventDefault();
            getTrial();
        });
    }

    function trialChangeOptions(val) {
        if (typeof $ !== "undefined") {
            $(".trial-sub-options > form").hide();
            $("#trial-option-" + val).show();
        }
    }

    function getTrial() {
        if (typeof Metro === "undefined") return;

        Metro.dialog.create({
            title: "<span class='mif-magic-wand fg-primary pr-2'></span> Get EasyQuery Trial",
            content: `
            <h4 class="text-bold">Select your application type</h4>
            <div class="mb-4 text-leader2" style="font-size: 1.1rem; line-height: 1.6;">
                EasyQuery framework can be used on different platforms and with different types of applications. So, to give you the most relevant installation instructions we need to know more about your project first.
            </div>
            <select id="select-apptype" class="mt-4 mb-4" data-role="select" data-filter="false">
                <option value="asp-net-core-razor">ASP.NET Core + MVC or Razor pages</option>
                <option value="asp-net-core-spa">ASP.NET Core + SPA Frontend (Angular, Razor, Vue, etc)</option>
                <option value="asp-net-4-mvc">ASP.NET 4 MVC</option>
                <option value="asp-net-4-webforms">ASP.NET 4 WebForms</option>
                <option value="net-winforms">.NET (Core) Windows Forms</option>
                <option value="net-wpf">.NET (Core) WPF</option>
                <option value="webapp-other">Web application on other platform (Java, Node.js, PHP, Python, etc) </option>
                <option value="other">Any other type of application</option>
            </select>
            <div class="trial-sub-options">
                <form id="trial-option-asp-net-core-razor" class="trial-option p-4 border bd-default mb-4">
                    <input type="radio" data-role="radio" name="viewEngine" data-caption="MVC" value="mvc" checked/>
                    <input type="radio" data-role="radio" name="viewEngine" data-caption="Razor Pages" value="razor-pages"/>
                </form>
                <form id="trial-option-asp-net-core-spa" name="trial-option-asp-net-core-spa" class="trial-option p-4 border bd-default mb-4">
                    <input type="radio" data-role="radio" name="frontend" data-caption="Angular" value="angular"/>
                    <input type="radio" data-role="radio" name="frontend" data-caption="React" value="react"/>
                    <input type="radio" data-role="radio" name="frontend" data-caption="Vue" value="vue"/>
                    <input type="radio" data-role="radio" name="frontend" data-caption="Other" value="other" checked/>
                </form>
                <form id="trial-option-asp-net-4-mvc" class="trial-option"></form>
                <form id="trial-option-asp-net-4-webforms" class="trial-option"></form>
                <form id="trial-option-net-winforms" class="trial-option"></form>
                <form id="trial-option-net-wpf" class="trial-option"></form>
                <form id="trial-option-webapp-other" class="trial-option p-4 border bd-default mb-4">
                    <input type="text" data-role="input" name="backend" data-label="Please, specify:"/>
                </form>
                <form id="trial-option-other" class="trial-option p-4 border bd-default mb-4">
                    <input type="text" data-role="input" name="apptype" data-label="Please, specify:"/>
                </form>
            </div>

            <h4 class="text-bold mt-4">Enter your email <span class="text-muted text-normal">(optional)</span></h4>
            <div class="mb-4 text-leader2" style="font-size: 1.1rem; line-height: 1.6;">
                We will provide the detailed instructions on how to get the things worked.
            </div>
            <input id="trial-email" type="email" placeholder="name@example.com" data-role="input" data-prepend="<span class='mif-envelop'></span>" name="email"/>
        `,
            clsDialog: "eq-mobile-fullscreen",
            closeButton: true,
            defaultActions: false,
            overlay: true,
            overlayClickClose: false,
            customButtons: [
                {
                    id: "get-trial-btn-in-dialog",
                    text: "Get Trial",
                    cls: "info rounded px-6 js-get-trial-action-btn",
                    onclick: async function () {
                        const app = document.getElementById("select-apptype").value;
                        const email = document.getElementById("trial-email").value;

                        closeDialogs();

                        setTimeout(() => {
                            if (typeof Metro !== "undefined") {
                                Metro.dialog.create({
                                    title: "",
                                    clsDialog: "eq-processing-dialog shadow-large eq-mobile-fullscreen",
                                    content: `
                                        <div style="position: relative;">
                                            <!-- Ghost container to pre-stretch the dialog to exact destination size -->
                                            <div style="visibility: hidden; pointer-events: none; opacity: 0; padding-top: 2rem; padding-bottom: 1rem;">
                                                <div class="mx-auto" style="max-width: 400px; padding: 1rem; margin-bottom: 1.5rem; border: none;">
                                                    <h3 class="text-bold">Your download will start shortly in <span class="fg-green text-leader">5</span> seconds...</h3>
                                                    <h3 class="mt-2 text-muted">If your download does not start automatically, click here.</h3>
                                                </div>
                                            </div>

                                            <div id="eq-processing-state" class="text-center" style="position: absolute; top:0; left:0; right:0; bottom:0; display:flex; flex-direction:column; justify-content:center; align-items:center; z-index: 2;">
                                                <div class="mb-4">
                                                    <div data-role="activity" data-type="cycle" data-style="color" style="margin: 0 auto; transform: scale(1.5);"></div>
                                                </div>
                                                <h3 class="text-light mt-4 mb-0">Assembling a sample project for you...</h3>
                                            </div>

                                            <div id="eq-result-state" style="position: absolute; top:0; left:0; right:0; bottom:0; z-index: 3; display:flex; flex-direction:column; justify-content:center; opacity: 0; pointer-events: none; visibility: hidden;"></div>
                                        </div>
                                    `,
                                    closeButton: true,
                                    defaultActions: false,
                                    overlay: true,
                                    overlayClickClose: false,
                                    customButtons: [
                                        {
                                            text: "Close",
                                            cls: "js-dialog-close flat fg-gray",
                                            onclick: function () {},
                                        },
                                    ],
                                    onOpen: function () {
                                        if (typeof grecaptcha !== "undefined") {
                                            grecaptcha.ready(function () {
                                                grecaptcha
                                                    .execute(reCaptchaSiteKey, { action: "eq_trial" })
                                                    .then(function (token) {
                                                        return processTrialRequest(app, email, token);
                                                    })
                                                    .catch(function (error) {
                                                        console.error("reCAPTCHA error:", error);
                                                        closeDialogs();
                                                    });
                                            });
                                        } else {
                                            console.warn("grecaptcha is not defined");
                                            processTrialRequest(app, email, "dummy_token");
                                        }
                                    },
                                });
                            }
                        }, 50);
                    },
                },
                {
                    text: "Cancel",
                    cls: "js-dialog-close flat fg-gray",
                    onclick: function () {},
                },
            ],
            onOpen: function () {
                const selectApptype = document.getElementById("select-apptype");
                if (selectApptype) {
                    selectApptype.addEventListener("change", function () {
                        trialChangeOptions(this.value);
                    });
                    trialChangeOptions(selectApptype.value);
                }
            },
        });
    }

    function closeDialogs() {
        if (typeof document !== "undefined") {
            const existingDialogs = document.querySelectorAll(".dialog");
            existingDialogs.forEach((d) => {
                if (typeof Metro !== "undefined") {
                    const instance = Metro.getPlugin(d, "dialog");
                    if (instance && typeof instance.close === "function") {
                        instance.close();
                        return;
                    }
                }
                d.remove();
                const overlay = document.querySelector(".overlay");
                if (overlay) overlay.remove();
            });
        }
    }

    async function processTrialRequest(apptype, email, token) {
        const url = `https://account.korzh.com/api/account/register`;

        let nextHref = "https://korzh.com/easyquery/docs/getting-started";
        let downloadUrl = null;
        switch (apptype) {
            case "asp-net-core-razor":
                downloadUrl = "https://cdn.korzh.com/dot-net-samples/AspNetCore-Razor-Mvc.zip";
                break;
            case "asp-net-core-spa":
                const form = document.forms["trial-option-asp-net-core-spa"];
                if (form && form.elements.frontend) {
                    const spaType = form.elements.frontend.value;
                    switch (spaType) {
                        case "angular":
                            downloadUrl = "https://cdn.korzh.com/dot-net-samples/AspNetCore-Angular.zip";
                            break;
                        case "react":
                            downloadUrl = "https://cdn.korzh.com/dot-net-samples/AspNetCore-React.zip";
                            break;
                        case "vue":
                            downloadUrl = "https://cdn.korzh.com/dot-net-samples/AspNetCore-Vue3.zip";
                            break;
                        case "other":
                            break;
                    }
                }
                break;
            case "asp-net-4-mvc":
                downloadUrl = "https://cdn.korzh.com/dot-net-samples/AspNet4-Mvc.zip";
                break;
            case "asp-net-4-webforms":
                downloadUrl = "https://cdn.korzh.com/dot-net-samples/AspNet4-WebForms.zip";
                break;
            case "net-winforms":
                downloadUrl = "https://cdn.korzh.com/dot-net-samples/WinForms.zip";
                break;
            case "net-wpf":
                downloadUrl = "https://cdn.korzh.com/dot-net-samples/Wpf.zip";
                break;
            case "webapp-other":
            case "other":
                break;
        }

        const trialData = {
            email,
            captchaToken: token,
            data: {
                intent: "get-trial",
                apptype,
            },
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(trialData),
            });

            if (!response.ok) {
                console.error("[EQ] Server error: " + response.status);
                closeDialogs();
                if (typeof Metro !== "undefined" && Metro.toast && typeof Metro.toast.create === "function") {
                    Metro.toast.create("Verification failed. Please try again.", {
                        clsToast: "alert",
                        position: "top",
                    });
                } else {
                    alert("Verification failed. Please try again.");
                }
                return;
            }
        } catch (error) {
            console.error("[EQ] API error:", error);
        }

        let dialogContent = "";

        if (downloadUrl) {
            dialogContent += `
                <div class="mx-auto">
                    <div class="p-4 bd-default mb-6">
                        <h3 id="download-countdown-text" class="text-bold text-center">
                            The sample project download will start in <span id="download-countdown" class="fg-green text-leader">5</span> seconds...
                        </h3>
                        <h4  class="mt-2 text-muted text-center" style="line-height: 1.5;">
                            <span id="manual-download-text">If the download does not start automatically,</span> <a href="${downloadUrl}" id="manual-download-link" class="fg-primary">click here</a>.
                        </h4>
                    </div>
                </div>
            `;
        }

        dialogContent += `
                <div class="mt-2 text-left">
                    <a href="https://korzh.com/easyquery/docs/getting-started/from-sample-to-your-own-project" target="_blank" class="fg-primary">
                        <span class="mif-books pr-2"></span> Getting started with the sample
                    </a>
                </div>
                <div class="mt-2 text-left">
                    <a href="${nextHref}" target="_blank" class="fg-primary">
                        <span class="mif-books pr-2"></span> EasyQuery documentation
                    </a>
                </div>
        `;

        const processingState = document.getElementById("eq-processing-state");
        const resultState = document.getElementById("eq-result-state");
        let downloadInterval = null;

        if (processingState) processingState.style.display = "none";

        if (resultState) {
            resultState.innerHTML = dialogContent;
            resultState.style.opacity = "1";
            resultState.style.pointerEvents = "auto";
            resultState.style.visibility = "visible";

            if (downloadUrl) {
                let count = 5;

                const manualLink = document.getElementById("manual-download-link");
                if (manualLink) {
                    manualLink.addEventListener("click", () => {
                        if (downloadInterval) clearInterval(downloadInterval);
                        const countdownText = document.getElementById("download-countdown-text");
                        if (countdownText) countdownText.style.display = "none";
                    });
                }

                downloadInterval = setInterval(() => {
                    if (!document.getElementById("eq-result-state")) {
                        clearInterval(downloadInterval);
                        return;
                    }

                    count--;
                    const counterEl = document.getElementById("download-countdown");
                    if (counterEl) counterEl.innerText = count;
                    if (count <= 0) {
                        clearInterval(downloadInterval);
                        const countdownText = document.getElementById("download-countdown-text");
                        if (countdownText) countdownText.style.display = "none";
                        const manualDownloadText = document.getElementById("manual-download-text");
                        if (manualDownloadText)
                            manualDownloadText.innerText =
                                "The sample project download should have started automatically.\nIf not,";
                        window.location.href = downloadUrl;
                    }
                }, 1000);
            }
        }
    }
});
```

### Task B5: Write `scripts/src/pages/ersk/index.js`

**Files:**
- Create: `scripts/src/pages/ersk/index.js`

This module contains the ERSK community-download logic, sourced from `source/assets/js/index.js` lines 405–579 (the safer version with `typeof Metro` guards). The duplicate inline copy in `easy-report-starter-kit.html` (lines 396–541) is removed in Task B11.

- [ ] **Step 1: Write the file.**

Write `scripts/src/pages/ersk/index.js` with this exact content:

```js
// ERSK product-page logic: the Get ERSK Community dialog and download flow.
// Loaded only on /easy-report-starter-kit via the `bundle: ersk`
// front-matter key.

document.addEventListener("DOMContentLoaded", () => {
    const reCaptchaSiteKey = "6LeNDYMsAAAAALRDQNC4MOiETC9uD8gIj8AdRNjd";

    let getCommunityDialog = null;

    const btnGetErskCommunity = document.getElementsByClassName("get-ersk-community-btn");
    if (btnGetErskCommunity.length > 0) {
        Array.from(btnGetErskCommunity).forEach((btn) => {
            btn.addEventListener("click", getERSKCommunity);
        });
    }

    function getERSKCommunity() {
        if (typeof Metro === "undefined") return;

        getCommunityDialog = Metro.dialog.create({
            title: "Get ERSK Community",
            content: `
              <div>
                  <p>When you download ERSK Community Edition, you'll get access to:</p>
                  <ul class="unstyled-list">
                      <li><span class="mif-checkmark fg-green mr-1"></span> Report Management</li>
                      <li><span class="mif-checkmark fg-green mr-1"></span> User Management</li>
                      <li><span class="mif-checkmark fg-green mr-1"></span> Report Sharing</li>
                      <li><span class="mif-checkmark fg-green mr-1"></span> Data visualization with tables</li>
                  </ul>
                  <p class="mt-4">You can optionally provide your email to receive setup instructions and updates.</p>
              </div>
              <form id="ersk-community-edition-form">
                  <div class="ersk-community-edition box">
                      <label>Email (optional):</label>
                      <input
                          type="email"
                          name="email"
                          id="ersk-email-input"
                          data-role="input"
                          data-validate="email"
                          placeholder="Enter your email..."
                      >
                  </div>
                  <div class="form-actions mt-4 d-flex flex-justify-right gap-2">
                      <button type="button" class="button js-dialog-close">Cancel</button>
                      <button
                          type="button"
                          id="ersk-download-btn"
                          class="button info"
                      >Download ERSK Community</button>
                  </div>
              </form>
          `,
            clsDialog: "get-community-dialog shadow-large",
            closeButton: true,
            defaultActions: false,
            customButtons: [],
            onOpen: function () {
                const downloadBtn = document.getElementById("ersk-download-btn");
                if (downloadBtn) {
                    downloadBtn.addEventListener("click", handleERSKDownload);
                }
            },
        });
    }

    function setErskButtonState(state) {
        const button = document.getElementById("ersk-download-btn");
        if (!button) return;
        if (state === "loading") {
            button.disabled = true;
            button.textContent = "Processing...";
        } else {
            button.disabled = false;
            button.textContent = "Download ERSK Community";
        }
    }

    function handleERSKDownload() {
        const emailInput = document.getElementById("ersk-email-input");
        const email = emailInput?.value.trim() || "";
        const downloadUrl = "https://cdn.korzh.com/download/ersk_community.zip";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            if (typeof Metro !== "undefined" && Metro.toast) {
                Metro.toast.create("Please enter a valid email address", null, 3000, "alert");
            }
            return;
        }

        const btn = document.getElementById("ersk-download-btn");
        const originalText = btn ? btn.textContent : "Download ERSK Community";

        setErskButtonState("loading");

        if (typeof grecaptcha !== "undefined") {
            grecaptcha.ready(function () {
                grecaptcha
                    .execute(reCaptchaSiteKey, { action: "download_ersk" })
                    .then(function (token) {
                        return submitERSKData(email, token, downloadUrl);
                    })
                    .catch(function (error) {
                        console.error("reCAPTCHA error:", error);
                        if (btn) {
                            btn.disabled = false;
                            btn.textContent = originalText;
                        }
                    });
            });
        } else {
            console.warn("grecaptcha is not defined");
            submitERSKData(email, "dummy_token", downloadUrl);
        }
    }

    async function submitERSKData(email, recaptchaToken, downloadUrl) {
        const nextUrl = "https://korzh.com/easy-report-starter-kit/docs/setup-first-launch";
        const apiAuthoring = "https://account.korzh.com/api/account/register";

        const data = {
            email,
            captchaToken: recaptchaToken,
            data: {
                intent: "get-perk",
                ptag: "ERSK",
                apptype: "ersk-community",
            },
        };

        try {
            const response = await fetch(apiAuthoring, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                console.error("[ERSK] Server error: " + response.status);
                return;
            }

            const result = await response.json();

            if (result?.status === 21) {
                // user already registered — silent
            } else {
                if (typeof Metro !== "undefined" && Metro.toast) {
                    Metro.toast.create("Your account has ben created! Thank you for using our products!", {
                        clsToast: "success",
                        position: "top",
                    });
                }
            }

            if (getCommunityDialog && typeof Metro !== "undefined") {
                Metro.dialog.close(getCommunityDialog);
            }
        } catch (error) {
            console.error("[ERSK] API error:", error);
        }

        window.open(downloadUrl, "_blank");
        setTimeout(() => {
            window.location.href = nextUrl;
        }, 100);

        return null;
    }
});
```

### Task B6: Write `scripts/esbuild.config.js`

**Files:**
- Create: `scripts/esbuild.config.js`

- [ ] **Step 1: Write the file.**

Write `scripts/esbuild.config.js` with this exact content:

```js
// Single esbuild config for the entire site.
// - Builds the Metro UI bundle (JS + CSS) using the curated entry at
//   scripts/src/pages/metro/index.js.
// - Builds three page/site JS bundles: site, easyquery, ersk.
// All outputs land in source/assets/ and are gitignored.

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
    // Metro UI — JS + CSS, curated subset.
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
    // Site-wide + per-page JS bundles.
    {
        ...common,
        entryPoints: {
            site: "scripts/src/shared/site.js",
            easyquery: "scripts/src/pages/easyquery/index.js",
            ersk: "scripts/src/pages/ersk/index.js",
        },
        outdir: "source/assets/js",
        entryNames: "[name]",
    },
];

if (watch) {
    for (const opts of builds) {
        const ctx = await context(opts);
        await ctx.watch();
    }
    console.log("[esbuild] watching for changes...");
} else {
    for (const opts of builds) {
        await build(opts);
    }
}
```

### Task B7: Install `concurrently` and update `package.json` scripts/deps

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install `concurrently`.**

Run:
```bash
npm install --save-dev concurrently
```

- [ ] **Step 2: Replace the contents of `package.json`.**

Write `package.json` with this exact content:

```json
{
  "name": "korzh-website",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "cross-env NODE_ENV=production node scripts/esbuild.config.js",
    "watch": "node scripts/esbuild.config.js --watch",
    "start": "cross-env RUBYOPT=-W0 bundle exec jekyll serve --livereload --incremental",
    "dev": "concurrently -k -n esbuild,jekyll -c blue,yellow \"npm:watch\" \"npm:start\"",
    "lint": "oxlint . --fix",
    "format": "oxfmt . --write"
  },
  "keywords": [],
  "author": "Korzh.com",
  "license": "MIT",
  "devDependencies": {
    "@netlify/plugin-sitemap": "^0.8.1",
    "@olton/esbuild-plugin-autoprefixer": "^0.2.2",
    "@olton/esbuild-plugin-progress": "^0.4.0",
    "@olton/metroui": "^5.1.20",
    "autoprefixer": "^10.4.22",
    "concurrently": "^9.0.0",
    "cross-env": "^10.1.0",
    "esbuild": "^0.26.0",
    "esbuild-plugin-less": "^1.3.31",
    "esbuild-plugin-replace": "^1.4.0",
    "oxfmt": "^0.27.0",
    "oxlint": "^1.42.0",
    "prettier": "3.4.2",
    "shx": "^0.4.0"
  },
  "dependencies": {}
}
```

**What changed from PR 1's `package.json`:**
- Added scripts: `build`, `watch`, `dev`.
- Removed scripts: `clear:metro`, `build:metro` (replaced by the single esbuild pipeline).
- Added dev-dep: `concurrently`.

The `^9.0.0` for `concurrently` is the version `npm install --save-dev concurrently` will produce in early 2026; if `npm install` produced a different version, leave whatever it picked.

- [ ] **Step 3: Sanity-check the lockfile.**

Run:
```bash
grep '"concurrently":' package-lock.json | head -2
```
Expected: at least one match. If empty, re-run `npm install`.

### Task B8: Run the build once and verify outputs

- [ ] **Step 1: Build.**

Run:
```bash
npm run build
```
Expected: prints "Metro UI" progress, then completes. No errors.

- [ ] **Step 2: Verify the four expected outputs exist.**

Run:
```bash
ls -la source/assets/js/ source/assets/metro/
```
Expected files:
- `source/assets/js/site.js`
- `source/assets/js/easyquery.js`
- `source/assets/js/ersk.js`
- `source/assets/metro/metro.js`
- `source/assets/metro/metro.css`

The original `source/assets/js/index.js` is still there too (not yet deleted — done in Task B10).

- [ ] **Step 3: Spot-check one bundle.**

Run:
```bash
head -3 source/assets/js/easyquery.js
grep -c "getTrial" source/assets/js/easyquery.js
```
Expected: head shows minified/bundled JS (NODE_ENV=production minifies). The grep should return a number > 0.

### Task B9: Update `.gitignore` and remove now-built outputs from git

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Replace the contents of `.gitignore`.**

Write `.gitignore` with this exact content:

```
_site
.sass-cache
.jekyll-cache
.jekyll-metadata
vendor
.idea
node_modules
dist

# Build outputs — produced by `npm run build` / `npm run watch`
source/assets/js/site.js
source/assets/js/easyquery.js
source/assets/js/ersk.js
source/assets/metro/

# Local Netlify folder
.netlify
.ai-context/*
```

**What changed:**
- Removed: `app-client.min.js` (the Webpack output that no longer exists).
- Added: the four esbuild outputs and the `source/assets/metro/` directory.
- Note: `source/assets/js/index.js` is NOT added to the ignore list because it will be deleted from git entirely in the next step (it's the old hand-written file being replaced).

- [ ] **Step 2: Remove the now-ignored build outputs from git tracking.**

Run:
```bash
git rm --cached source/assets/metro/metro.js
git rm --cached source/assets/metro/metro.css
git rm source/assets/js/index.js
```

The `--cached` flag for the Metro files removes them from git without deleting the local working copy (they're now build outputs and will be regenerated by `npm run build`). The plain `git rm` for `index.js` deletes it both from git and from disk — it's being permanently replaced.

- [ ] **Step 3: Verify.**

Run:
```bash
git status
ls source/assets/metro/
ls source/assets/js/
```
Expected:
- `git status` shows `.gitignore` modified, the three files deleted, and `package.json`/`package-lock.json` modified.
- `source/assets/metro/` still contains `metro.js` and `metro.css` on disk (untracked).
- `source/assets/js/` contains `easyquery.js`, `ersk.js`, `site.js` (untracked) but NOT `index.js`.

### Task B10: Update `source/_layouts/default.html` — replace `index.js` reference

**Files:**
- Modify: `source/_layouts/default.html`

- [ ] **Step 1: Edit the layout.**

Replace the line in `source/_layouts/default.html`:

OLD:
```html
    <script src="/assets/js/index.js"></script>
```

NEW:
```html
    <script src="/assets/js/site.js"></script>
    {% if page.bundle %}
    <script src="/assets/js/{{ page.bundle }}.js"></script>
    {% endif %}
```

The two new lines should sit in the same position as the old line (right before `</body>`). All other layout content stays unchanged.

- [ ] **Step 2: Verify.**

Run:
```bash
grep -A2 "site.js\|page.bundle" source/_layouts/default.html
```
Expected: two `<script>` lines visible — `site.js` always, and `{{ page.bundle }}.js` inside the `{% if %}`.

### Task B11: Update `source/easyquery.html` — add `bundle` to front matter

**Files:**
- Modify: `source/easyquery.html`

- [ ] **Step 1: Edit the front matter.**

Replace the first 3 lines of `source/easyquery.html`:

OLD:
```yaml
---
title: EASYQUERY.NET >> Korzh.com - Tools from Developers for Developers
---
```

NEW:
```yaml
---
title: EASYQUERY.NET >> Korzh.com - Tools from Developers for Developers
bundle: easyquery
---
```

All other content (the `<style>` block and the page body that follows) stays unchanged.

### Task B12: Update `source/easy-report-starter-kit.html` — add front matter, delete inline script

**Files:**
- Modify: `source/easy-report-starter-kit.html`

- [ ] **Step 1: Add `bundle: ersk` to the front matter.**

Replace the first 3 lines of `source/easy-report-starter-kit.html`:

OLD:
```yaml
---
title: EASYREPORT STARTER KIT >> Korzh.com - Tools from Developers for Developers
---
```

NEW:
```yaml
---
title: EASYREPORT STARTER KIT >> Korzh.com - Tools from Developers for Developers
bundle: ersk
---
```

- [ ] **Step 2: Delete the inline `<script>` block.**

Open `source/easy-report-starter-kit.html`. Locate the `<script>` opening tag (currently at line 396) and the matching `</script>` closing tag (currently the last script tag in the file). Delete everything from `<script>` through `</script>` inclusive — the entire block containing the duplicate ERSK download code (`getERSKCommunity`, `handleERSKDownload`, `submitERSKData`, etc.).

Verify by running:
```bash
grep -n "<script\|</script>" source/easy-report-starter-kit.html
```
Expected: NO matches. The page has no remaining `<script>` tags — the bundle is now loaded via the layout.

- [ ] **Step 3: Verify line count dropped.**

Run:
```bash
wc -l source/easy-report-starter-kit.html
```
Expected: roughly 396 lines (down from 542) — the 146 deleted script lines plus or minus 1.

### Task B13: Run the build and serve, smoke-test in browser

- [ ] **Step 1: Production build sanity-check.**

Run:
```bash
npm run build
bundle exec jekyll build
```
Expected: both complete without errors.

- [ ] **Step 2: Verify the layout-injected scripts appear in built HTML.**

Run:
```bash
grep -E "site\.js|easyquery\.js|ersk\.js" _site/easyquery/index.html _site/easy-report-starter-kit/index.html _site/index.html
```
Expected:
- `_site/easyquery/index.html` references `/assets/js/site.js` AND `/assets/js/easyquery.js`.
- `_site/easy-report-starter-kit/index.html` references `/assets/js/site.js` AND `/assets/js/ersk.js`.
- `_site/index.html` references `/assets/js/site.js` only (no `page.bundle`).

- [ ] **Step 3: Start the dev server with the new unified command.**

Run:
```bash
npm run dev
```
Expected: blue `[esbuild]` lines (initial build then "watching for changes...") and yellow `[jekyll]` lines (server starts on `http://localhost:4000`).

- [ ] **Step 4: Browser smoke-test.**

In a browser:

1. **Site loads at all.** Open `http://localhost:4000/`. Page renders, app-bar is visible, no JS console errors in DevTools.

2. **EasyQuery Get Trial.** Open `http://localhost:4000/easyquery`. Click "Get Trial". The app-type select dialog appears. Pick "ASP.NET Core + MVC or Razor pages", click "Get Trial" in the dialog. The processing dialog appears; it transitions to a download/countdown view. No console errors.

3. **EasyQuery hash routing.** Open `http://localhost:4000/easyquery#get-trial` directly. The Get Trial dialog should open on page load.

4. **ERSK community download.** Open `http://localhost:4000/easy-report-starter-kit`. Click "Get ERSK Community" (the button on the page). The email dialog appears. Enter an invalid email like `notanemail` and click "Download ERSK Community" — a Metro toast says "Please enter a valid email address". Enter a valid email or leave it blank, click again — a download tab opens for `ersk_community.zip` and the page navigates to the setup-first-launch URL after ~100ms.

5. **Slow-loading link indicator.** On any page, click a link with `slow-loading` attribute (e.g. the "SUPPORT" link in the app-bar). The Metro activity overlay should appear briefly before navigation.

6. **DevTools Network tab.** Confirm:
   - On `/easyquery`: `site.js` and `easyquery.js` both load; `ersk.js` does NOT load.
   - On `/easy-report-starter-kit`: `site.js` and `ersk.js` both load; `easyquery.js` does NOT load.
   - On `/`: only `site.js` loads.

If any of those fail, STOP and debug before committing.

- [ ] **Step 5: Stop the dev server.**

Ctrl-C in the terminal. Confirm both `[esbuild]` and `[jekyll]` shut down (`concurrently -k` should kill both).

### Task B14: Commit PR 2

- [ ] **Step 1: Stage and commit.**

Run:
```bash
git add -A
git status
```
Expected files in the commit:
- New: `scripts/esbuild.config.js`, `scripts/src/shared/site.js`, `scripts/src/pages/easyquery/index.js`, `scripts/src/pages/ersk/index.js`
- Renamed: `scripts/src/metro.js` → `scripts/src/pages/metro/index.js`
- Modified: `package.json`, `package-lock.json`, `.gitignore`, `source/_layouts/default.html`, `source/easyquery.html`, `source/easy-report-starter-kit.html`
- Deleted: `source/assets/js/index.js`, `source/assets/metro/metro.js`, `source/assets/metro/metro.css`

```bash
git commit -m "$(cat <<'EOF'
Consolidate build into single esbuild pipeline; split JS by page

- New scripts/esbuild.config.js builds four bundles in one process:
  Metro UI (JS+CSS, curated subset) and three JS bundles (site,
  easyquery, ersk).
- Extract source/assets/js/index.js (monolithic site-wide handler that
  mixed EQ trial logic and ERSK download logic) into:
  - scripts/src/shared/site.js (slow-loading link indicator, bfcache
    reload — loaded on every page)
  - scripts/src/pages/easyquery/index.js (Get Trial dialog, reCAPTCHA
    trial flow, EQ hash routing, EQ-specific mobile dialog CSS)
  - scripts/src/pages/ersk/index.js (single de-duplicated copy of the
    ERSK Get Community dialog + download flow)
- Move scripts/src/metro.js -> scripts/src/pages/metro/index.js for
  consistency with the new pages/ structure.
- Pages opt into their bundle via Jekyll front matter (`bundle: easyquery`,
  `bundle: ersk`); _layouts/default.html emits a conditional <script>.
- Delete the inline <script> block in source/easy-report-starter-kit.html
  (lines 396-541) — it was a duplicate of the ERSK logic in index.js.
- Gitignore all build outputs (source/assets/js/{site,easyquery,ersk}.js,
  source/assets/metro/). They're produced on demand by `npm run build`.
- Add `concurrently` dev-dep; `npm run dev` now starts esbuild watch and
  Jekyll serve in one command.

Local dev: npm install && bundle install, then npm run dev.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 2: Verify the commit.**

Run:
```bash
git show --stat HEAD
```
Expected: ~10 files changed. Confirm the rename (`scripts/src/metro.js` → `scripts/src/pages/metro/index.js`) shows as a rename (not as a delete+create), preserving history.

---

## Group C — PR 3: Netlify CD configuration

**Outcome:** Netlify rebuilds the entire site (esbuild + Jekyll) on every push. The committed build outputs are no longer needed because the pipeline produces them in CI.

### Task C1: Update `netlify.toml`

**Files:**
- Modify: `netlify.toml`

- [ ] **Step 1: Replace the contents of `netlify.toml`.**

Write `netlify.toml` with this exact content:

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

**What changed:** added `[build]` and `[build.environment]` blocks. The existing `[[headers]]` block is preserved verbatim. Indentation uses 2 spaces (TOML convention) — not tabs. The existing file actually uses a mix; the new file is consistent.

### Task C2: Commit PR 3

- [ ] **Step 1: Stage and commit.**

Run:
```bash
git add netlify.toml
git commit -m "$(cat <<'EOF'
Wire Netlify CD to run the new build pipeline

Netlify previously had no [build] section — it ran only
`bundle exec jekyll build` (configured in the UI), which meant
committed build outputs (Metro JS/CSS, source/assets/js/index.js)
shipped as-is. With those outputs now gitignored, Netlify must
rebuild them itself.

- command: npm run build && bundle exec jekyll build
- publish: _site
- Pin NODE_VERSION (20) and RUBY_VERSION (3.3.0) in netlify.toml so the
  build is reproducible from git rather than relying on Netlify UI defaults.
- NODE_ENV=production triggers minification in esbuild.config.js.
- JEKYLL_ENV=production enables Jekyll's production behaviour.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

### Task C3: Push to remote and verify Netlify deploy preview

- [ ] **Step 1: Push the branch.**

Run:
```bash
git push -u origin feature-refactor-js
```

- [ ] **Step 2: Open a draft PR (if one doesn't exist) so Netlify spins up a deploy preview.**

Run:
```bash
gh pr create --draft --title "Frontend asset pipeline reorganisation" --body "$(cat <<'EOF'
Implements the design at \`docs/superpowers/specs/2026-05-25-frontend-asset-reorg-design.md\`.

## Commits in this PR

1. **Remove dead build pipelines and unreferenced source** — Webpack pipeline, dead TS modules, easydata.css, less.bat all removed. Site behaviour unchanged.
2. **Consolidate build into single esbuild pipeline; split JS by page** — extract \`index.js\` into \`site.js\` + per-page bundles; de-duplicate ERSK; gitignore build outputs.
3. **Wire Netlify CD to run the new build pipeline** — netlify.toml now drives the build instead of UI config.

## Test plan

- [ ] Netlify deploy preview build succeeds (green check on this PR).
- [ ] On the deploy preview URL: open /easyquery, click "Get Trial", dialog opens and trial-request flow completes.
- [ ] On the deploy preview URL: open /easy-report-starter-kit, click "Get ERSK Community", email dialog opens and download flow completes.
- [ ] DevTools Network tab on /easyquery: site.js + easyquery.js load; ersk.js does NOT load.
- [ ] DevTools Network tab on /easy-report-starter-kit: site.js + ersk.js load; easyquery.js does NOT load.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: Watch the Netlify build.**

Either via `gh pr checks --watch` or by opening the PR in the browser and clicking "Details" on the Netlify check. Wait for the deploy preview build to succeed (~2–5 minutes).

If the build fails:
- Read the Netlify build log.
- Common failure modes:
  - **`bundle install` fails** → Ruby version mismatch; adjust `RUBY_VERSION` in `netlify.toml`.
  - **`npm install` fails** → Node version mismatch; adjust `NODE_VERSION` in `netlify.toml`.
  - **`npm run build` fails** → reproduce locally with the same `NODE_ENV=production`; check for esbuild plugin errors.
- Fix, commit, push, re-watch.

- [ ] **Step 4: Verify the deploy preview in browser.**

Once the build is green, open the deploy preview URL from the PR's Netlify check. Run the same browser smoke-test as Task B13 Step 4 (all 6 checks) against the preview URL instead of localhost.

- [ ] **Step 5: Mark the PR ready for review and merge.**

If everything looks good:
```bash
gh pr ready
```
Then merge through the GitHub UI (or `gh pr merge --merge` if the user prefers CLI).

---

## Group D — PR 4: Documentation

**Outcome:** `CLAUDE.md` reflects the new architecture; `README.md` has a brief local-development section.

### Task D1: Update `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Replace the contents of `CLAUDE.md`.**

Write `CLAUDE.md` with this exact content:

```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

The marketing/product site at `korzh.com`. A **Jekyll** static site (`source/` is the Jekyll source root — set via `source: source` in `_config.yml`) with a small **plain-JS** frontend bundled by **esbuild**. Deployed by **Netlify**, which runs the build on every push.

## Commands

- `npm run dev` — starts esbuild watch + Jekyll serve concurrently (one Ctrl-C kills both). Browse to `http://localhost:4000`.
- `npm run build` — production esbuild build (minified, no sourcemaps).
- `npm run watch` — esbuild watch only (rarely needed standalone).
- `npm start` — Jekyll serve only (rarely needed standalone).
- `npm run lint` / `npm run format` — `oxlint --fix` and `oxfmt --write`. `source/assets`, `scripts/build-metro.js`, and `scripts/webpack.config.js` are ignored by oxlint per `.oxlintrc.json` (note: `webpack.config.js` no longer exists; the ignore entry is a no-op and can be cleaned up next time `.oxlintrc.json` is touched).

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

All outputs are gitignored. Netlify rebuilds them on every deploy via the `[build]` section of `netlify.toml`.

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
```

### Task D2: Update `README.md`

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace the contents of `README.md`.**

Write `README.md` with this exact content:

```markdown
# korzhcom-website

Source for the [korzh.com](https://korzh.com) marketing site. Built with Jekyll + esbuild, deployed by Netlify on every push to `main`.

## Local development

Requirements: Node 20, Ruby 3.3, Bundler.

First-time setup:

```bash
npm install
bundle install
```

Daily dev (one command, runs esbuild watch + Jekyll serve):

```bash
npm run dev
```

Open `http://localhost:4000`. Editing files under `scripts/src/` or `source/` triggers a live reload.

## Production build

```bash
npm run build
bundle exec jekyll build
```

Output lands in `_site/`. Netlify runs these two commands automatically on push.
```

### Task D3: Commit and push PR 4

- [ ] **Step 1: Stage and commit.**

Run:
```bash
git add CLAUDE.md README.md
git commit -m "$(cat <<'EOF'
Update CLAUDE.md and README for the new build pipeline

CLAUDE.md: replace the three-pipelines description with the single
esbuild pipeline; document the `bundle:` front-matter convention; note
that build outputs are now gitignored.

README.md: add brief Local Development and Production Build sections
(was a one-line placeholder).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 2: Push.**

Run:
```bash
git push
```

If the PR is still open, this adds the commit to it. If the PR was already merged in Group C, this can either be (a) appended to a new PR with just the docs change, or (b) folded into the PR before merging by reordering Groups C and D. Pick whichever the user prefers.

---

## Done.

After all four groups land:

- Local dev is one command: `npm run dev`.
- The site has one build tool (esbuild), one source language (plain JS), one CSS file (hand-written).
- `source/assets/js/index.js` is gone; the EQ/ERSK logic lives in dedicated per-page modules; the ERSK duplicate is gone.
- Build outputs are not in git; Netlify rebuilds on every push.
- Failure mode "I forgot to rebuild before committing" is impossible — there's nothing to commit.
