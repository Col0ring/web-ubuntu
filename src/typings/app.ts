import { Key } from './tools'

export interface AppConfig {
  id: string
  title: string
  icon: string
  disabled?: boolean
  favorite?: boolean
  // 快捷方式
  shortcut?: boolean
  meta?: Record<Key, any>
}
