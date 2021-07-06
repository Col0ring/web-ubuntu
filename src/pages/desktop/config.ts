import { Percentage } from '@/typings/tools'

export const defaultImages = {
  'wall-1': '/images/wallpapers/wall-1.jpg',
  'wall-2': '/images/wallpapers/wall-2.png',
  'wall-3': '/images/wallpapers/wall-3.jpg',
  'wall-4': '/images/wallpapers/wall-4.jpg',
  'wall-5': '/images/wallpapers/wall-5.jpg',
  'wall-6': '/images/wallpapers/wall-6.png',
  'wall-7': '/images/wallpapers/wall-7.png',
  'wall-8': '/images/wallpapers/wall-8.jpg',
}

export const defaultWindowRect: {
  width: Percentage
  height: Percentage
  minWidth: number
  minHeight: number
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
  desktopApp: 'desktopApp',
  sidebarApp: 'sidebarApp',
}
