import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState
} from 'react'
import classnames from 'classnames'
import Transition from '@/components/transition'
import { MessageMethods, MessageOptions } from './type'
import './style.less'
import useTimeoutFn from '@/hooks/common/useTimeoutFn'

export interface MessageProps extends MessageOptions {}

const directions: Record<Required<MessageProps>['direction'], string> = {
  'top left': 'left-0 top-0',
  'top right': 'right-0 top-0',
  'bottom left': 'left-0 bottom-0',
  'bottom right': 'right-0  bottom-0'
}

const types: Record<Required<MessageProps>['type'], string> = {
  info: 'bg-ub-cool-grey',
  error: 'bg-red-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500'
}

const Message: React.ForwardRefRenderFunction<MessageMethods, MessageProps> = (
  {
    duration = 3000,
    type = 'info',
    direction = 'top right',
    content,
    description,
    wrapperClassName
  },
  ref
) => {
  const [visible, setVisible] = useState(true)
  const { run, cancel } = useTimeoutFn(() => {
    setVisible(false)
  }, duration)
  const close = useCallback(() => {
    cancel()
    setVisible(false)
  }, [setVisible, cancel])
  useImperativeHandle(
    ref,
    () => ({
      close
    }),
    [close]
  )
  const messageClassName = classnames(
    'message-container',
    {
      'message-left': direction.includes('left'),
      'message-right': direction.includes('right')
    },
    directions[direction],
    types[type],
    wrapperClassName
  )
  useEffect(() => {
    run()
  }, [])
  return (
    <Transition
      visible={visible}
      duration={300}
      enterClassName="message-container-show"
      leaveClassName="message-container-leave"
    >
      <div className={messageClassName}>
        <div className="text-white">{content}</div>
        <div className="text-xs mt-1 text-ubt-grey">{description}</div>
      </div>
    </Transition>
  )
}

export default forwardRef(Message)
