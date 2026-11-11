import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  // Chemins relatifs : le build est servi dans projets/siplec-flotte/ du portfolio.
  base: command === 'build' || isPreview ? './' : '/',
  build: {
    outDir: '../../projets/siplec-flotte',
    emptyOutDir: true,
    // Recharts représente l’essentiel du bundle ; acceptable pour un prototype de démonstration.
    chunkSizeWarningLimit: 800,
  },
}));
