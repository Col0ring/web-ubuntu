import useKeyPress from '@/hooks/common/useKeyPress'
import React, { useCallback, useRef, useState } from 'react'
import { useDesktopContext } from '../provider'

const NewFolderModal: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [desktopState, desktopMethods] = useDesktopContext()
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setInputValue(e.target.value)
    },
    [setInputValue]
  )
  const addNewFolder = useCallback(
    (value: string) => {
      const trimValue = value.trim()
      if (!trimValue) {
        return
      }

      desktopMethods.addNewFolder(value, {
        left: desktopState.mousePosition.clientX,
        top: desktopState.mousePosition.clientY,
      })
      desktopMethods.setNewFolderModal(false)
    },
    [desktopMethods, desktopState]
  )

  const onOK: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
    addNewFolder(inputValue)
  }, [inputValue])

  const onCancel: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
    desktopMethods.setNewFolderModal(false)
  }, [desktopMethods])

  useKeyPress(
    'enter',
    () => {
      addNewFolder(inputValue)
    },
    {
      target: inputRef,
    }
  )
  return (
    <div className="absolute rounded-md top-1/2 left-1/2 text-center text-white font-light text-sm bg-ub-cool-grey transform -translate-y-1/2 -translate-x-1/2 sm:w-96 w-3/4 z-50">
      <div className="w-full flex flex-col justify-around items-start px-6 pb-8 pt-6">
        <span>New folder name</span>
        <input
          ref={inputRef}
          value={inputValue}
          onChange={onInputChange}
          className="outline-none mt-4 px-1 w-full  context-menu-bg border-2 border-yellow-700 rounded py-0.5"
          type="text"
          autoComplete="off"
          spellCheck="false"
          autoFocus
        />
      </div>
      <div className="flex">
        <div
          onClick={onOK}
          className="w-1/2 px-4 py-2 border border-gray-900 border-opacity-50 border-r-0 hover:bg-ub-warm-grey hover:bg-opacity-10 hover:border-opacity-50"
        >
          Create
        </div>
        <div
          onClick={onCancel}
          className="w-1/2 px-4 py-2 border border-gray-900 border-opacity-50 hover:bg-ub-warm-grey hover:bg-opacity-10 hover:border-opacity-50"
        >
          Cancel
        </div>
      </div>
    </div>
  )
}

export default NewFolderModal
