import React from 'react'
import ReactDom from 'react-dom'
import { ModalOptions, ModalMethods } from './type'
import Modal from './modal'

export interface ModalInstance {
  alert(options: ModalOptions): void
  confirm(options: ModalOptions): void
}

const ref = React.createRef<ModalMethods>()
function createModal(options: ModalOptions) {
  // single instance
  if (ref.current) {
    ref.current.destroy()
  }
  const messageContainer = document.createElement('div')
  document.body.append(messageContainer)
  ReactDom.render(
    React.createElement(Modal, {
      ref,
      destroyOnClose: true,
      ...options,
      async onOk() {
        await options.onOk?.()
        ref.current?.destroy()
      },
      async onCancel() {
        await options.onCancel?.()
        ref.current?.destroy()
      },
    }),
    messageContainer
  )
  if (ref.current) {
    ref.current.open()
  }
  document.body.removeChild(messageContainer)
}

const modal: ModalInstance = {
  alert: (options) => createModal({ hideCancelButton: true, ...options }),
  confirm: (options) => createModal({ ...options }),
}

export { modal }
export default modal
