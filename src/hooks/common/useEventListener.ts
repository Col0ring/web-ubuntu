import React, { useEffect, useRef } from 'react'
import { DomElement } from '../../typings/tools'

function useEventListener<K extends keyof HTMLElementEventMap>(
  ref: React.RefObject<DomElement>,
  eventName: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: EventListenerOptions
): void
function useEventListener<K extends keyof ElementEventMap>(
  ref: React.RefObject<DomElement>,
  eventName: K,
  handler: (ev: ElementEventMap[K]) => void,
  options?: EventListenerOptions
): void
function useEventListener<K extends keyof DocumentEventMap>(
  ref: React.RefObject<DomElement>,
  eventName: K,
  handler: (ev: DocumentEventMap[K]) => void,
  options?: EventListenerOptions
): void
function useEventListener<K extends keyof WindowEventMap>(
  ref: React.RefObject<DomElement>,
  eventName: K,
  handler: (ev: WindowEventMap[K]) => void,
  options?: EventListenerOptions
): void
function useEventListener(
  ref: React.RefObject<DomElement>,
  eventName: string,
  handler: Function,
  options: EventListenerOptions
): void
function useEventListener(
  ref: React.RefObject<DomElement>,
  eventName: string,
  handler: Function,
  options: AddEventListenerOptions = {}
) {
  const handlerRef = useRef<Function>()
  handlerRef.current = handler

  useEffect(() => {
    if (!ref.current) {
      return
    }
    const { current: el } = ref

    const eventListener: EventListener = (event) => {
      return handlerRef.current?.(event)
    }

    el.addEventListener(eventName, eventListener, {
      capture: options.capture,
      once: options.once,
      passive: options.passive
    })

    return () => {
      el.removeEventListener(eventName, eventListener, {
        capture: options.capture
      })
    }
  }, [ref, eventName, ...Object.values(options)])
}

export default useEventListener
