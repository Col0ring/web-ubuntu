import React from 'react'
import classnames from 'classnames'
import { addBase } from '@/utils/prod'

type ButtonType = 'error' | 'success' | 'warning' | 'info'
type ButtonSize = 'large' | 'small' | 'middle'
type ButtonShape = 'round' | 'square'
export interface ButtonProps {
  type?: ButtonType
  className?: string
  loading?: boolean
  onClick?: (e: React.MouseEvent) => void
  size?: ButtonSize
  shape?: ButtonShape
}

const buttonType: Record<ButtonType, string> = {
  error: 'bg-red-600 active:bg-red-500 border-red-600 active:border-red-500',
  info: 'bg-gray-600 active:bg-gray-500 border-gray-600 active:border-gray-500',
  success:
    'bg-green-600 active:bg-green-500 border-green-600 active:border-green-500',
  warning:
    'bg-yellow-600 active:bg-yellow-500 border-yellow-600 active:border-yellow-500',
}

const buttonSize: Record<ButtonSize, string> = {
  large: 'text-lg',
  middle: 'text-base',
  small: 'text-sm',
}

const buttonShape: Record<ButtonShape, string> = {
  round: 'rounded-full',
  square: 'rounded-sm',
}

const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  type = 'info',
  size = 'middle',
  shape = 'square',
  className,
  onClick,
}) => {
  const buttonClassName = classnames(
    className,
    'flex justify-center items-center text-white outline-none py-1 px-2 transition-colors border border-solid',
    buttonType[type],
    buttonSize[size],
    buttonShape[shape]
  )
  return (
    <button className={buttonClassName} onClick={onClick}>
      {loading && (
        <img
          className="animate-spin mr-2 w-1.5f"
          src={addBase('/themes/Yaru/status/process-working-symbolic.svg')}
          alt="Loading Spinner"
        />
      )}
      {children}
    </button>
  )
}

export default Button
