import React from 'react'
import LoadingSpinner from '@/assets/themes/Yaru/status/process-working-symbolic.svg'
import Dot from './dot'

interface PageLoadingProps {
  tips?: string
}

const PageLoading: React.FC<PageLoadingProps> = ({ tips = 'loading' }) => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black flex flex-col items-center justify-center">
      <img
        className="animate-spin w-20"
        src={LoadingSpinner}
        alt="Loading Spinner"
      />
      <p className="text-white">
        <Dot>{tips}</Dot>
      </p>
    </div>
  )
}

export default PageLoading
