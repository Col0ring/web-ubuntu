import React from 'react'
import Folder from '../components/folder'

const apps = [
  {
    id: 'php',
    title: 'php',
    icon: './themes/filetypes/php.png',
    position: {
      left: 0,
      top: 0,
    },
  },
  {
    title: 'Angular.js',
    id: 'Angular.js',
    icon: './themes/filetypes/js.png',
    position: {
      left: 0,
      top: 0,
    },
  },
]
const Trash: React.FC = () => {
  return (
    <Folder
      apps={apps}
      emptyProps={{
        img: './themes/Yaru/status/user-trash-symbolic.svg',
        title: 'Trash is Empty',
      }}
    />
  )
}

export default Trash
