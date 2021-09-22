import React from 'react'
import Folder from './folder'
import { SpecialFolder } from '../constants'

const id = SpecialFolder.Desktop
const DesktopFolder: React.FC = () => {
  return (
    <Folder row={false} id={id} wrapperClassName="pt-8" showEmpty={false} />
  )
}

export default DesktopFolder
