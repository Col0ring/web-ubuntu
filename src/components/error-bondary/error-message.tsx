import React from 'react'

export interface ErrorMessageProps {
  title?: string
  message?: string
}
const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message }) => {
  return (
    <div className="p-5 w-full h-full flex flex-col items-center justify-center bg-ub-cool-grey">
      <p className="text-red-500 text-xl">{title}</p>
      <p className="text-ubt-grey mt-3 text-sm">{message}</p>
    </div>
  )
}

export default ErrorMessage
