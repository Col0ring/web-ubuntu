import { Plugin } from 'vite'
import * as fs from 'fs'

async function copyFile(source: string, target: string) {
  const rd = fs.createReadStream(source)
  const wr = fs.createWriteStream(target)
  return new Promise((resolve, reject) => {
    rd.on('error', reject)
    wr.on('error', reject)
    wr.on('finish', resolve)
    console.log(`copy: ${source} > ${target}`)
    rd.pipe(wr)
  }).catch((error) => {
    rd.destroy()
    wr.end()
    console.log(`copy-error: ${source} > ${target}`)
    throw error
  })
}

/**
 *
 * @param options {from: to}
 * @returns: Plugin
 */
function vitePluginCopy(options: Record<string, string>): Plugin {
  return {
    name: 'vite-plugin-copy',
    async closeBundle() {
      await Promise.all(
        Object.keys(options).map((src) => copyFile(src, options[src]))
      )
    },
  }
}

export default vitePluginCopy
