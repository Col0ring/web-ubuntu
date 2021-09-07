import path from 'path'
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import eslintPlugin from 'vite-plugin-eslint'
import viteStylelint from '@amatlash/vite-plugin-stylelint'
import viteMockPlugin from './mock/plugin'

function resolve(relativePath: string) {
  return path.resolve(__dirname, relativePath)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    viteMockPlugin(),
    // eslintPlugin({
    //   fix: true,
    //   include: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx'],
    //   exclude: ['node_modules', 'dist', 'dist-ssr'],
    // }),
    // viteStylelint({
    //   include: /.*\.(less|css)/,
    //   exclude: ['node_modules', 'dist', 'dist-ssr'],
    // }),
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
    },
  },
})
