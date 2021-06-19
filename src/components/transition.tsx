import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import useTimeoutFn from '@/hooks/common/useTimeoutFn'

export interface TransitionProps {
  enterClassName?: string
  leaveClassName?: string
  duration?: number
  exist?: boolean
  visible?: boolean
}

const Transition: React.FC<TransitionProps> = ({
  children,
  visible = false,
  exist = false,
  duration = 500,
  leaveClassName = '',
  enterClassName = ''
}) => {
  const [show, setShow] = useState(visible)
  const { run } = useTimeoutFn((visible: boolean) => {
    setShow(visible)
  }, duration)
  useEffect(() => {
    if (visible) {
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
          ['hidden']: exist && !(visible || show),
          [enterClassName]: show,
          [leaveClassName]: !visible
        }
      )
      return exist || visible || show
        ? React.cloneElement(children, {
            ...props,
            style: {
              ...(props.style ? props.style : {}),
              transitionDuration: duration + 'ms'
            } as React.CSSProperties,
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
                ['hidden']: exist && !show,
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
