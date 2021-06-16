import React from 'react'
import Dot from './dot'

interface PageLoadingProps {
  tips?: string
  loading?: boolean
}

const PageLoading: React.FC<PageLoadingProps> = ({
  tips = 'loading',
  loading,
  children
}) => {
  return (
    <>
      {loading && (
        <div className="z-50 fixed top-0 left-0 w-screen h-screen bg-black flex flex-col items-center justify-center">
          <img
            className="animate-spin w-20"
            src="/themes/Yaru/status/process-working-symbolic.svg"
            alt="Loading Spinner"
          />
          <p className="text-white">
            <Dot>{tips}</Dot>
          </p>
        </div>
      )}
      {children}
    </>
  )
}

export default PageLoading
