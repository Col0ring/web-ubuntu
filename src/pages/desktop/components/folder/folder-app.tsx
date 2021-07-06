import App from '@/components/app'
import React from 'react'
import DesktopApp, { DesktopAppProps } from '../desktop-app'

export type FolderAppProps = DesktopAppProps
const FolderApp: React.FC<FolderAppProps> = (props) => {
  return <App {...props} />
}

export default FolderApp
