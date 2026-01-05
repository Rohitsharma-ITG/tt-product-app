import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Define the fixed bundle names
const bundleFileName = 'ugapp.bundle.js';
const cssFileName = 'ugapp.style.css';

export default defineConfig({
  root: dirname(fileURLToPath(import.meta.url)),
  plugins: [react(), viteTsconfigPaths()],
  build: {
    outDir: resolve(__dirname, '../extensions/ugapp/assets'),
    emptyOutDir: false,
    assetsDir: '',
    rollupOptions: {
      input: resolve(__dirname, 'src/main.tsx'),
      output: {
        entryFileNames: bundleFileName,
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return cssFileName;
          }
          return '[name].[ext]';
        },
      },
    },
  },
});
