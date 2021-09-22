import { AppPositionValue } from '@/typings/app'
import { addBase } from '@/utils/prod'

export const defaultImages = {
  'wall-1': addBase('/images/wallpapers/wall-1.jpg'),
  'wall-2': addBase('/images/wallpapers/wall-2.png'),
  'wall-3': addBase('/images/wallpapers/wall-3.jpg'),
  'wall-4': addBase('/images/wallpapers/wall-4.jpg'),
  'wall-5': addBase('/images/wallpapers/wall-5.jpg'),
  'wall-6': addBase('/images/wallpapers/wall-6.png'),
  'wall-7': addBase('/images/wallpapers/wall-7.png'),
  'wall-8': addBase('/images/wallpapers/wall-8.jpg'),
}

export const defaultAppRect: {
  width: AppPositionValue
  height: AppPositionValue
} = {
  width: 95,
  height: 74,
}

export const defaultWindowRect: {
  width: AppPositionValue
  height: AppPositionValue
  minWidth: AppPositionValue
  minHeight: AppPositionValue
} = {
  width: '85%',
  height: '80%',
  minWidth: (window.innerWidth * 1) / 3,
  minHeight: (window.innerHeight * 1) / 3,
}

export const defaultDesktop = {
  navbar: 30,
  sidebar: 52,
}

export const dataTarget = {
  editButtons: 'edit-buttons',
  toolbar: 'toolbar',
  folderApp: 'folderApp',
  sidebarApp: 'sidebarApp',
}
