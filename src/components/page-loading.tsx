import React from 'react'
import Loading, { LoadingProps } from './loading'
import Dot from './dot'
import classnames from 'classnames'

export interface PageLoadingProps extends LoadingProps {}

const PageLoading: React.FC<PageLoadingProps> = ({
  loadingClassName,
  ...props
}) => {
  const pageLoadingClassName = classnames('bg-black', loadingClassName)
  return <Loading loadingClassName={pageLoadingClassName} {...props} />
}

export default PageLoading
