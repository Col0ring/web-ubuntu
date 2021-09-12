import React from 'react'
import Folder from './folder'

const id = '/application/trash'
const Trash: React.FC = () => {
  return (
    <Folder
      id={id}
      emptyProps={{
        img: './themes/Yaru/status/user-trash-symbolic.svg',
        title: 'Trash is Empty',
      }}
    />
  )
}

export default Trash
