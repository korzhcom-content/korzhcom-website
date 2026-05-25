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
