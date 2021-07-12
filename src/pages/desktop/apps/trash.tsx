import React from 'react'
import Folder from './folder'

const Trash: React.FC = () => {
  return (
    <Folder
      id="trash"
      emptyProps={{
        img: './themes/Yaru/status/user-trash-symbolic.svg',
        title: 'Trash is Empty',
      }}
    />
  )
}

export default Trash
