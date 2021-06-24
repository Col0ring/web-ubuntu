import React from 'react'
import ErrorMessage from './error-message'
export interface ErrorBoundaryProps {
  fallback?: React.ReactNode
  showError?: boolean
}

const initialState = {
  hasError: false,
  error: null as Error | null
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  typeof initialState
> {
  readonly state: Readonly<typeof initialState> = initialState
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error
    }
  }
  render() {
    const { fallback, showError, children } = this.props
    const { error, hasError } = this.state
    const message = showError ? error?.message : 'Something Wrong!'
    const description = showError
      ? error?.stack
      : 'it looks like there are some problems, please try again later.'
    if (hasError) {
      return fallback ? (
        fallback
      ) : (
        <ErrorMessage title={message} message={description} />
      )
    }
    return children
  }
}
export function WithErrorBoundary<P = {}>(props: ErrorBoundaryProps = {}) {
  return (WrappedComponent: React.ComponentType<P>) => {
    class ErrorBoundary extends React.Component<P, typeof initialState> {
      readonly state: Readonly<typeof initialState> = initialState
      static getDerivedStateFromError(error: Error) {
        return {
          hasError: true,
          error
        }
      }
      render() {
        const { fallback, showError } = props
        const { children, ...rest } = this.props
        const { error, hasError } = this.state
        const message = showError ? error?.message : 'Something Wrong!'
        const description = showError
          ? error?.stack
          : 'it looks like there are some problems, please try again later.'
        if (hasError) {
          return fallback ? (
            fallback
          ) : (
            <ErrorMessage title={message} message={description} />
          )
        }
        return <WrappedComponent {...(rest as P)}>{children}</WrappedComponent>
      }
    }
    return ErrorBoundary
  }
}
