import chokidar from 'chokidar'
import path from 'path'
import qs from 'querystring'
import { pathToRegexp, match } from 'path-to-regexp'
import { Plugin } from 'vite'
import { loadMockFiles, loadMockFilesOptions, parseBody } from './plugin-util'

export default function viteMockPlugin(): Plugin {
  return {
    name: 'vite-mock-plugin',
    enforce: 'pre',
    apply: 'serve',
    async configureServer({ middlewares }) {
      const dir = path.resolve(__dirname, './modules')
      const loadOptions: loadMockFilesOptions = {
        dir,
      }
      let mockFiles = await loadMockFiles(loadOptions)

      // watch
      chokidar.watch(dir).on('all', async () => {
        mockFiles = await loadMockFiles(loadOptions)
      })

      middlewares.use('/mock', async (req, res) => {
        if (mockFiles) {
          const [url, search] = req.url!.split('?')
          for (const [pathname, { handler, method }] of Object.entries(
            mockFiles
          )) {
            if (
              pathToRegexp(pathname).test(url) &&
              req.method?.toLowerCase() === method.toLowerCase()
            ) {
              const body = await parseBody(req)
              const query = qs.parse(search)
              const matched = match(pathname)(url)
              const result = await handler(
                {
                  body,
                  query,
                  params:
                    (matched && (matched.params as Record<string, string>)) ||
                    {},
                },
                req,
                res
              )
              if (!res.headersSent && result) {
                res.setHeader('Content-Type', 'application/json')
                res.statusMessage = result.message || 'ok'
                res.statusCode = result.status || 200
                res.end(
                  JSON.stringify({
                    message: 'ok',
                    status: 200,
                    ...result,
                  })
                )
              }
              return
            }
          }
        }
      })
    },
  }
}
