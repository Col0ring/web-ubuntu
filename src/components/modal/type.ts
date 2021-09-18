import { ButtonProps } from '@/components/button'

export interface ModalOptions {
  style?: React.CSSProperties
  className?: string
  title?: string
  onOk?: () => void
  okButtonProps?: ButtonProps
  cancelButtonProps?: ButtonProps
  onCancel?: () => void
  footer?: React.ReactNode
}
