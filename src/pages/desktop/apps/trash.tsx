import { addBase } from '@/utils/prod'
import React from 'react'
import Folder from './folder'

const id = '/application/trash'
const Trash: React.FC = () => {
  return (
    <Folder
      id={id}
      emptyProps={{
        img: addBase('/themes/Yaru/status/user-trash-symbolic.svg'),
        title: 'Trash is Empty',
      }}
    />
  )
}

export default Trash
