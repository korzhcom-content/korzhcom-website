import {build, context} from "esbuild";
import progress from "@olton/esbuild-plugin-progress";
import autoprefixer from "@olton/esbuild-plugin-autoprefixer";
import { lessLoader } from "esbuild-plugin-less";
import { replace } from "esbuild-plugin-replace";

import pkg from "../node_modules/@olton/metroui/package.json" with {type: "json"};

const production = process.env.MODE === "production"

const options = {
    entryPoints: ['./scripts/src/metro.js'],
    outfile: './source/assets/metro/metro.js',
    bundle: true,
    minify: production,
    sourcemap: false,
    plugins: [
        progress({
            text: 'Building Metro UI...',
            succeedText: `Metro UI built successfully in %s ms!`
        }),
        lessLoader(),
        autoprefixer(),
        replace({
            '__BUILD_TIME__': new Date().toLocaleString(),
            '__VERSION__': pkg.version,
        })
    ],
}

if (production) {
    await build({
        ...options,
    });
} else {
    const ctx = await context({
        ...options,
    });

    await ctx.watch();
}