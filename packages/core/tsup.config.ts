import * as path from 'node:path';
import { defineConfig, Options } from 'tsup';

const clientConfig: Options = {
  name: 'client',
  platform: 'browser',
  entry: ['./src/index.ts'],
  format: ['esm', 'cjs'],
  outDir: './dist/client',
  bundle: true,
  splitting: false,
  sourcemap: true,
  dts: true,
  tsconfig: path.resolve(__dirname, './tsconfig.client.json'),
  define: {
    
  }
}

export default defineConfig([
  clientConfig
]);