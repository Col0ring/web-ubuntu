import path from 'path'
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import viteMockPlugin from './mock/plugin'
function resolve(relativePath: string) {
  return path.resolve(__dirname, relativePath)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), viteMockPlugin()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve('./src')
    }
  }
})
