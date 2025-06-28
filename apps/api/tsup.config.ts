import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  platform: 'node',
  target: 'node18',
  dts: true,
  sourcemap: false,
  clean: true,
  splitting: false,
  treeshake: true,
  minify: false,
  bundle: true,
  noExternal: [/./]
});