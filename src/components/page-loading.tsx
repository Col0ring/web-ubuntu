import React from 'react'
import Loading, { LoadingProps } from './loading'
import classnames from 'classnames'

export type PageLoadingProps = LoadingProps

const PageLoading: React.FC<PageLoadingProps> = ({
  loadingClassName,
  ...props
}) => {
  const pageLoadingClassName = classnames('bg-black', loadingClassName)
  return <Loading loadingClassName={pageLoadingClassName} {...props} />
}

export default PageLoading
