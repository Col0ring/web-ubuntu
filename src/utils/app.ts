import { App, FolderConfig } from '@/typings/app'

export function isFolder(app: App): app is FolderConfig {
  return Array.isArray((app as FolderConfig).apps)
}
