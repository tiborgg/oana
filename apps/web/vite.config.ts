import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import * as path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "@babel/plugin-proposal-decorators",
            {
              version: "2023-05"
            }
          ]
        ]
      }
    }), 
    tailwindcss()],
    
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
