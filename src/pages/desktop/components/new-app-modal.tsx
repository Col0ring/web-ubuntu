import useKeyPress from '@/hooks/common/useKeyPress'
import { percentage2Decimal } from '@/utils/misc'
import React, { useCallback, useRef, useState } from 'react'
import { SpecialFolder } from '../constants'
import { useDesktopContext } from '../provider'

export interface NewAppModalProps {
  type: 'file' | 'folder'
}

const NewAppModal: React.FC<NewAppModalProps> = ({ type }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [desktopState, desktopMethods] = useDesktopContext()
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setInputValue(e.target.value)
    },
    [setInputValue]
  )
  const addNewApp = useCallback(
    (value: string) => {
      const trimValue = value.trim()
      if (!trimValue) {
        return
      }

      if (desktopState.newAppModalFolderId === SpecialFolder.Desktop) {
        if (type === 'file') {
          desktopMethods.addNewFile(desktopState.newAppModalFolderId, value, {
            left: desktopState.mousePosition.clientX,
            top: desktopState.mousePosition.clientY,
          })
        } else {
          desktopMethods.addNewFolder(desktopState.newAppModalFolderId, value, {
            left: desktopState.mousePosition.clientX,
            top: desktopState.mousePosition.clientY,
          })
        }
        return
      }
      const parentFolder =
        desktopState.openedAppMap[desktopState.newAppModalFolderId]

      const offsetLeft =
        typeof parentFolder.windowPosition.left === 'string'
          ? window.innerWidth *
            percentage2Decimal(parentFolder.windowPosition.left)
          : parentFolder.windowPosition.left
      const offsetTop =
        typeof parentFolder.windowPosition.top === 'string'
          ? window.innerWidth *
            percentage2Decimal(parentFolder.windowPosition.top)
          : parentFolder.windowPosition.top
      if (type === 'file') {
        desktopMethods.addNewFile(desktopState.newAppModalFolderId, value, {
          left: desktopState.mousePosition.clientX - offsetLeft,
          top: desktopState.mousePosition.clientY - offsetTop,
        })
      } else {
        desktopMethods.addNewFolder(desktopState.newAppModalFolderId, value, {
          left: desktopState.mousePosition.clientX - offsetLeft,
          top: desktopState.mousePosition.clientY - offsetTop,
        })
      }
    },
    [desktopMethods, type, desktopState]
  )

  const onOK: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
    addNewApp(inputValue)
  }, [addNewApp, inputValue])

  const onCancel: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
    if (type === 'file') {
      desktopMethods.setNewFileModal(false)
    } else {
      desktopMethods.setNewFolderModal(false)
    }
  }, [desktopMethods, type])

  useKeyPress(
    'enter',
    () => {
      addNewApp(inputValue)
    },
    {
      target: inputRef,
    }
  )
  return (
    <div className="absolute rounded-md top-1/2 left-1/2 text-center text-white font-light text-sm bg-ub-cool-grey transform -translate-y-1/2 -translate-x-1/2 sm:w-96 w-3/4 z-60">
      <div className="w-full flex flex-col justify-around items-start px-6 pb-8 pt-6">
        <span>{type === 'file' ? 'New File Name' : 'New Folder Name'}</span>
        <input
          ref={inputRef}
          value={inputValue}
          onChange={onInputChange}
          className="outline-none mt-4 px-1 w-full  context-menu-bg border-2 border-yellow-700 rounded py-0.5"
          type="text"
          autoComplete="off"
          spellCheck="false"
          // eslint-disable-next-line jsx-a11y/no-autofocus
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

export default NewAppModal
