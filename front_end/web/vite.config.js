import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // GitHub Pages serves the app under /FlameGuard_AI/
    base: '/FlameGuard_AI/',
    build: {
        outDir: 'dist',
    },
})
