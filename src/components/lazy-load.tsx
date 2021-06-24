import React, { Suspense } from 'react'
import { ErrorBoundary } from './error-bondary'
import Loading from './loading'
export interface LazyLoadProps {
  fallback?: React.ReactNode
}

const LazyLoad: React.FC<LazyLoadProps> = ({ children, fallback }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback ? fallback : <Loading loading />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

export default LazyLoad
