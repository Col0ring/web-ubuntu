import ReactDom from 'react-dom'
import { Direction } from '@/typings/tools'

export interface MessageOptions {
  duration?: number
  direction?: Direction
  content?: React.ReactNode
  description?: React.ReactNode
}

type MessageType = 'info' | 'success' | 'error' | 'warning'

export interface Message {
  (
    options?: MessageOptions & {
      type?: MessageType
    }
  ): void
  info(options?: MessageOptions): void
  success(options?: MessageOptions): void
  error(options?: MessageOptions): void
  warning(options?: MessageOptions): void
}

const directions: Record<Required<MessageOptions>['direction'], string> = {
  top: 'mt-1.5 top-0 left-1/2 transform  -translate-x-1/2',
  bottom: 'mb-1.5 bottom-9 left-1/2 transform  -translate-x-1/2',
  left: 'ml-1.5 top-1/2 transform -translate-y-1/2 left-0',
  right: 'mr-1.5 top-1/2 transform -translate-y-1/2 right-0',
  'top left': 'mt-0.5 left-0 ml-0.5 top-0',
  'top right': 'mt-0.5 right-0 mr-0.5 top-0',
  'bottom left': 'mb-0.5 left-0 ml-0.5 bottom-0',
  'bottom right': 'mb-0.5 right-0 mr-0.5 bottom-0'
}

const message: Message = ((options) => {
  const { duration = 3000, type = 'info', content, description } = options || {}
  ReactDom.createPortal(
    <div className="fixed">
      <div>{content}</div>
      <div>{description}</div>
    </div>,
    document.body
  )
}) as Message
const types: MessageType[] = ['info', 'error', 'success', 'warning']
types.forEach((type) => {
  message[type] = (options) => {
    message({
      ...options,
      type
    })
  }
})

export default message
