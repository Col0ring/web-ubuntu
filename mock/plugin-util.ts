import fs from 'fs'
import { build } from 'esbuild'
import path from 'path'
import { MethodsType, MockRoutes, NodeModuleWithCompile, Routes } from './type'
import { Connect } from 'vite'

export interface loadMockFilesOptions {
  dir: string
  prefix?: string
}

function safeJsonParse<T extends Record<string | number | symbol, any>>(
  jsonStr: string,
  defaultValue: T
) {
  try {
    return JSON.parse(jsonStr)
  } catch (err) {
    return defaultValue
  }
}

// TODO: parse file
export function parseBody(
  req: Connect.IncomingMessage
): Promise<Record<string, any>> {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', function (chunk) {
      body += chunk
    })
    req.on('end', function () {
      resolve(safeJsonParse(body, {}))
    })
  })
}

export async function loadMockFiles({
  dir,
  prefix,
}: loadMockFilesOptions): Promise<MockRoutes | null> {
  const mockRoutes: MockRoutes = {}
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const currentPath = path.resolve(dir, file)
      const stat = fs.statSync(currentPath)
      if (stat.isDirectory()) {
        // eslint-disable-next-line no-await-in-loop
        const childMockRoutes = await loadMockFiles({
          dir: currentPath,
          prefix,
        })
        if (childMockRoutes) {
          Object.keys(childMockRoutes).forEach((key) => {
            mockRoutes[key as keyof Routes] =
              childMockRoutes[key as keyof MockRoutes]
          })
        }
      } else {
        // eslint-disable-next-line no-await-in-loop
        const { prefix: routePrefix, default: routes } = (await resolveModule(
          currentPath
        )) as {
          prefix?: string
          default: Routes
        }
        Object.keys(routes).forEach((routeKey) => {
          const [method, routePath] = routeKey.split(' ')
          mockRoutes[
            path.join(
              prefix || '',
              routePrefix || '',
              routePath
            ) as keyof MockRoutes
          ] = {
            method: method as MethodsType,
            handler: routes[routeKey as keyof Routes],
          }
        })
      }
    }
    return mockRoutes
  }
  return null
}

async function resolveModule(filename: string): Promise<any> {
  const res = await build({
    entryPoints: [filename],
    write: false,
    platform: 'node',
    bundle: true,
    format: 'cjs',
    target: 'es2015',
  })
  const { text } = res.outputFiles[0]
  return loadConfigFromBundledFile(filename, text)
}

async function loadConfigFromBundledFile(
  filename: string,
  bundle: string
): Promise<any> {
  const extension = path.extname(filename)
  const defaultLoader = require.extensions[extension]
  require.extensions[extension] = (module: NodeModule, fName: string) => {
    if (filename === fName) {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(module as NodeModuleWithCompile)._compile(bundle, filename)
    } else {
      defaultLoader?.(module, fName)
    }
  }

  // 删除缓存
  delete require.cache[filename]
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const moduleValue = require(filename)
  // 改回原样
  if (defaultLoader) {
    require.extensions[extension] = defaultLoader
  }
  return moduleValue
}
