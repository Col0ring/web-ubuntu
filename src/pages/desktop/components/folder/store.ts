import { createLocalStorage } from '@/utils/local-storage'

const { setFolderDragTarget, removeFolderDragTarget, getFolderDragTarget } =
  createLocalStorage('folderDragTarget', {
    defaultValue: '',
  })

export { setFolderDragTarget, removeFolderDragTarget, getFolderDragTarget }
