import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/app/index.ts'],
    format: ['esm'],
    target: 'node18',
    dts: false,
    clean: true,
    splitting: false,
    sourcemap: false,
    bundle: true,
    outDir: 'dist',
    minify: true,
    outExtension: () => ({ js: '.js' }),
    banner: {
        js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);"
    },
    noExternal: ['ajv']
})