import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: command === 'serve' ? [react()] : [],
  test: {
    globals: true,
    environment: 'jsdom',
    css: false,
  },
}))
