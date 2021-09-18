import React from 'react'
import ReactDom from 'react-dom'
import { MessageMethods, MessageOptions, MessageType } from './type'
import Message from './message'

export interface MessageInstance {
  (options?: MessageOptions): void
  info(options?: MessageOptions): void
  success(options?: MessageOptions): void
  error(options?: MessageOptions): void
  warning(options?: MessageOptions): void
}

const ref = React.createRef<MessageMethods>()
const message: MessageInstance = ((options) => {
  // single instance
  if (ref.current) {
    ref.current.close()
  }
  const messageContainer = document.createElement('div')
  document.body.append(messageContainer)
  ReactDom.render(
    React.createElement(Message, {
      ref,
      ...options,
    }),
    messageContainer
  )
  document.body.removeChild(messageContainer)
}) as MessageInstance

const types: MessageType[] = ['info', 'error', 'success', 'warning']
types.forEach((type) => {
  message[type] = (options) => {
    message({
      ...options,
      type,
    })
  }
})
export { message }
export default message
