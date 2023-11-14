import {nodeResolve} from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from "autoprefixer"
import progress from 'rollup-plugin-progress';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy'

const sourcemap = false

export default {
    input: "./scripts/src/metro.js",
    watch: {
        include: 'source/**',
        clearScreen: false
    },
    plugins: [
        progress({
            clearLine: true,
        }),
        replace({
            preventAssignment: true,
        }),
        postcss({
            extract: true,
            minimize: true,
            use: ['less'],
            sourceMap: sourcemap,
            plugins: [
                autoprefixer(),
            ]
        }),
        nodeResolve({
            browser: true
        }),
        commonjs(),
        copy({
            targets: [
                {src: './node_modules/metro4/icons/*', dest: './source/assets/metro'},
            ]
        }),
    ],
    output: {
        file: './source/assets/metro/metro.js',
        format: 'iife',
        sourcemap,
        plugins: [
            terser()
        ]
    }
}