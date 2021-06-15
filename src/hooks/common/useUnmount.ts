import { useEffect, useRef, EffectCallback } from 'react'

function useUnmount(destructor: ReturnType<EffectCallback>) {
  const fnRef = useRef(destructor)
  fnRef.current = destructor
  useEffect(() => {
    return fnRef.current
  }, [])
}

export default useUnmount
