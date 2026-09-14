import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: '0.0.0.0', port: 5173, allowedHosts: true },
  preview: { host: '0.0.0.0', port: 4173, allowedHosts: true },
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Rolldown (Vite 8) requires a function form.
        manualChunks(id: string) {
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion'))
            return 'motion';
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler'))
            return 'react';
          return undefined;
        },
      },
    },
  },
});
