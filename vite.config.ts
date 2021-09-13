import path from 'path'
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import eslintPlugin from 'vite-plugin-eslint'
import viteStylelint from '@amatlash/vite-plugin-stylelint'
import viteMockPlugin from '@col0ring/vite-plugin-mock'

function resolve(relativePath: string) {
  return path.resolve(__dirname, relativePath)
}

const base = process.env.NODE_ENV === 'production' ? '' : ''

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [
    reactRefresh(),
    viteMockPlugin({
      dir: resolve('mock'),
      exclude: /utils/,
    }),
    eslintPlugin({
      fix: true,
      include: ['./src/**/*.[tj]s?(x)'],
    }),
    viteStylelint({
      include: /.*\.(less|css)/,
      exclude: ['node_modules', 'dist', 'dist-ssr'],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
      '@mock': resolve('./mock'),
    },
  },
})
