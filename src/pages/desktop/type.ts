export type BackgroundImageType = `wall-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`

export interface StatusIcon {
  icon: string
  name: string
}

export interface DesktopContextValue {
  backgroundImage: BackgroundImageType
}
