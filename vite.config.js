import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Admin Live Wiring: proxy /v1/factory → local P-INT-01 Slice A Service Edge (dev only).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const edgeTarget =
    env.VITE_FACTORY_EDGE_PROXY_TARGET?.trim() || 'http://127.0.0.1:8787'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/v1/factory': {
          target: edgeTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
