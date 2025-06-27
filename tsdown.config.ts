import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  target: 'es2015',
  dts: true,
  clean: true,
  format: ['esm'],
  treeshake: true,
  shims: true,
  publint: true,
  unused: true,
  skipNodeModulesBundle: true,
  exports: true,
  silent: true,
})
