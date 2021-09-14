import React from 'react'
import Folder from './folder'
import { SpecialFolder } from '../constants'

const id = SpecialFolder.Desktop
const DesktopFolder: React.FC = () => {
  return <Folder id={id} showEmpty={false} />
}

export default DesktopFolder
