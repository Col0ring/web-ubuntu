import { addBase } from '@/utils/prod'
import React from 'react'
import { SpecialFolder } from '../constants'
import Folder from './folder'

const Trash: React.FC = () => {
  return (
    <Folder
      id={SpecialFolder.Trash}
      emptyProps={{
        img: addBase('/themes/Yaru/status/user-trash-symbolic.svg'),
        title: 'Trash is Empty',
      }}
    />
  )
}

export default Trash
