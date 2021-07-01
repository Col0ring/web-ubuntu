import React from 'react'
import DesktopApp, { DesktopAppProps } from '../desktop-app'

export interface FolderAppProps extends DesktopAppProps {}
const FolderApp: React.FC<FolderAppProps> = (props) => {
  return <DesktopApp {...props} />
}

export default FolderApp
