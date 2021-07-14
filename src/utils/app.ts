import { UbuntuApp, FolderConfig } from '@/typings/app'

export function isFolder(app: UbuntuApp): app is FolderConfig {
  return Array.isArray((app as FolderConfig).apps)
}
