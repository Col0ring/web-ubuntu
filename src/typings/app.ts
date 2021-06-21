export interface AppConfig {
  id: string
  title: string
  icon: string
  disabled?: boolean
  favorite?: boolean
  // 快捷方式
  shortcut?: boolean
  [prop: string]: any
}

export interface OpenedAppConfig extends AppConfig {
  rect: {
    width: number | string
    height: number | string
  }
  position: {
    left: number | string
    top: number | string
  }
}
