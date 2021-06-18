import { useEffect, useRef } from 'react'

export interface UseTitleOptions {
  restoreOnUnmount?: boolean
}

function useTitle(title: string, options?: UseTitleOptions) {
  const prevTitleRef = useRef(document.title)
  document.title = title
  useEffect(() => {
    if (options && options.restoreOnUnmount) {
      return () => {
        document.title = prevTitleRef.current
      }
    }
  }, [])
}

export default useTitle
