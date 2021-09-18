import React from 'react'
import ReactDom from 'react-dom'
import Modal from './modal'

export interface ModalInstance {
  (): void
  alert(): void
  confirm(): void
}

const ref = React.createRef()
