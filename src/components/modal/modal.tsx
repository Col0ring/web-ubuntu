import React, {
  useMemo,
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react'
import ReactDom from 'react-dom'
import classnames from 'classnames'
import Transition from '@/components/transition'
import Button from '@/components/button'
import { ModalMethods, ModalOptions } from './type'
import './style.less'
import useUpdateEffect from '@/hooks/common/useUpdateEffect'

export interface ModalProps extends ModalOptions {
  visible?: boolean
  children?: React.ReactNode
}

const Modal: React.ForwardRefRenderFunction<ModalMethods, ModalProps> = (
  {
    visible,
    className,
    title,
    getContainer,
    onCancel,
    afterClose,
    destroyOnClose,
    onOk,
    okText,
    cancelText,
    hideCancelButton,
    cancelButtonProps,
    okButtonProps,
    footer,
    children,
    content,
    style,
  },
  ref
) => {
  const [modalVisible, setModalVisible] = useState(visible || false)
  const visibleState = useMemo(() => {
    return visible ?? modalVisible
  }, [visible, modalVisible])
  const modalClassName = classnames(className, 'modal-container')
  const container = useMemo(() => {
    return typeof getContainer === 'function'
      ? getContainer()
      : getContainer ?? document.body
  }, [getContainer])

  useImperativeHandle(
    ref,
    () => ({
      destroy: () => {
        visible ?? setModalVisible(false)
      },
      open: () => {
        visible ?? setModalVisible(true)
      },
    }),
    [setModalVisible, visible]
  )

  useUpdateEffect(() => {
    if (!visibleState) {
      afterClose?.()
    }
  }, [visibleState])

  return ReactDom.createPortal(
    <Transition exist={!destroyOnClose} visible={visibleState} duration={200}>
      <div className="fixed left-0 top-0 w-full h-full z-9999">
        <Transition
          exist
          visible={visibleState}
          duration={200}
          enterClassName="modal-container-show"
          leaveClassName="modal-container-leave"
        >
          <div className={modalClassName} style={style}>
            <div className="text-lg mb-3">{title}</div>
            {children ?? content}
            <div className="mt-5 border-t w-full pt-3">
              {typeof footer === 'undefined' ? (
                <div className="w-full flex justify-end items-center">
                  {!hideCancelButton && (
                    <Button
                      type="error"
                      onClick={onCancel}
                      className="mr-2"
                      {...cancelButtonProps}
                    >
                      {cancelText || 'Cancel'}
                    </Button>
                  )}
                  <Button onClick={onOk} {...okButtonProps}>
                    {okText || 'Ok'}
                  </Button>
                </div>
              ) : (
                footer
              )}
            </div>
          </div>
        </Transition>
      </div>
    </Transition>,
    container
  )
}

export default forwardRef(Modal)
