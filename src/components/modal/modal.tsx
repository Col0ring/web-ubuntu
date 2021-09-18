import React from 'react'
import classnames from 'classnames'
import Transition from '@/components/transition'
import Button from '@/components/button'
import 'style.less'
import { ModalOptions } from './type'

export interface ModalProps extends ModalOptions {
  visible?: boolean
}

const Modal: React.FC<ModalProps> = ({
  visible,
  className,
  title,
  onCancel,
  onOk,
  cancelButtonProps,
  okButtonProps,
  footer,
  children,
  style,
}) => {
  const modalClassName = classnames(className, 'modal-container')
  return (
    <Transition visible={visible} duration={300}>
      <div className={modalClassName} style={style}>
        <div>{title}</div>
        <div>{children}</div>
        <div>
          {typeof footer === 'undefined' ? (
            <>
              <Button className="mr-2">取消</Button>
              <Button>确定</Button>
            </>
          ) : (
            footer
          )}
        </div>
      </div>
    </Transition>
  )
}

export default Modal
