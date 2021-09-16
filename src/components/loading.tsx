import { addBase } from '@/utils/prod'
import classnames from 'classnames'
import React from 'react'
import Dot from './dot'

export interface LoadingProps {
  tips?: string
  loading?: boolean
  className?: string
  loadingClassName?: string
}

const Loading: React.FC<LoadingProps> = ({
  tips = 'loading',
  loading,
  children,
  className,
  loadingClassName,
}) => {
  const loadingWrapperClassName = classnames(
    'relative w-full h-full',
    className
  )
  const currentLoadingClassName = classnames(
    'absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center',
    loadingClassName
  )
  return (
    <div className={loadingWrapperClassName}>
      {loading && (
        <div style={{ zIndex: 10000 }} className={currentLoadingClassName}>
          <img
            className="animate-spin w-20"
            src={addBase('/themes/Yaru/status/process-working-symbolic.svg')}
            alt="Loading Spinner"
          />
          <p className="text-white">
            <Dot>{tips}</Dot>
          </p>
        </div>
      )}
      {children}
    </div>
  )
}

export default Loading
