import { ButtonProps } from '@/components/button'
import React from 'react'

export interface ModalOptions {
  style?: React.CSSProperties
  className?: string
  title?: string
  content?: React.ReactNode
  onOk?: () => Promise<void> | void
  okText?: React.ReactNode
  okButtonProps?: ButtonProps
  hideCancelButton?: boolean
  cancelText?: React.ReactNode
  onCancel?: () => Promise<void> | void
  cancelButtonProps?: ButtonProps
  footer?: React.ReactNode
  getContainer?: HTMLElement | (() => HTMLElement)
  destroyOnClose?: boolean
  afterClose?: () => void
}

export interface ModalMethods {
  open(): void
  destroy(): void
}
