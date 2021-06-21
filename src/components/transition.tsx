import React, { useEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import useTimeoutFn from '@/hooks/common/useTimeoutFn'

export interface TransitionProps {
  enterClassName?: string
  leaveClassName?: string
  duration?: number
  exist?: boolean
  visible?: boolean
  nodeRef?: React.RefObject<Element>
}

const Transition: React.FC<TransitionProps> = ({
  children,
  visible = false,
  exist = false,
  duration = 20,
  leaveClassName = '',
  enterClassName = '',
  nodeRef
}) => {
  duration = duration < 20 ? 20 : duration
  const [show, setShow] = useState(visible)
  const { run, cancel } = useTimeoutFn((visible: boolean) => {
    setShow(visible)
  }, duration)
  const defaultNodeRef = useRef<Element | null>(null)
  useEffect(() => {
    cancel()
    if (visible) {
      // This is to force a repaint,
      // which is necessary in order to transition styles when adding a class name.
      ;(nodeRef || defaultNodeRef).current?.scrollTop
      setShow(visible)
    } else {
      run(visible)
    }
  }, [visible, run])

  if (React.isValidElement(children)) {
    if (React.Children.only(children)) {
      const props = children.props
      const transitionClassName = classnames(
        props.className,
        'transition-all',
        {
          hidden: exist && !(visible || show),
          [enterClassName]: show,
          [leaveClassName]: !visible
        }
      )
      return exist || visible || show
        ? React.cloneElement(children, {
            ...props,
            ref: nodeRef || defaultNodeRef,
            style: Object.assign({}, props.style, {
              transitionDuration: duration + 'ms'
            } as React.CSSProperties),
            className: transitionClassName
          })
        : null
    } else {
      return (
        <>
          {React.Children.map(children, (child) => {
            const props = child.props
            const transitionClassName = classnames(
              props.className,
              'transition-all',
              {
                hidden: exist && !(visible || show),
                [enterClassName]: show,
                [leaveClassName]: !visible
              }
            )
            return exist || visible || show
              ? React.cloneElement(child, {
                  ...props,
                  style: {
                    ...(props.style ? props.style : {}),
                    transitionDuration: duration + 'ms'
                  } as React.CSSProperties,
                  className: transitionClassName
                })
              : null
          })}
        </>
      )
    }
  }

  return <>{children}</>
}

export default Transition
