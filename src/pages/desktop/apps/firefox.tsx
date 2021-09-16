import React, { useCallback, useEffect, useRef, useState } from 'react'
import useKeyPress from '@/hooks/common/useKeyPress'
import { validateUrl } from '@/utils/validator'
import { addBase } from '@/utils/prod'

const homeUrl = 'https://www.google.com/webhp?igu=1'
interface ToolbarProps {
  onInputChange?: (value: string) => void
  onInputEnter?: (value: string) => void
  onRefreshBtnClick?: () => void
  onHomeBtnClick?: () => void
  value?: string
}
const Toolbar: React.FC<ToolbarProps> = ({
  onInputChange,
  onInputEnter,
  onRefreshBtnClick,
  onHomeBtnClick,
  value,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  useKeyPress(
    'enter',
    (e) => {
      const target = e.target as HTMLInputElement
      onInputEnter?.(target.value.trim())
    },
    {
      target: inputRef,
    }
  )
  return (
    <div className="select-none w-full pt-0.5 pb-1 flex justify-start items-center text-white text-sm border-b border-gray-900">
      <div
        onClick={onRefreshBtnClick}
        className=" ml-2 mr-1 flex justify-center items-center rounded-full bg-gray-50 bg-opacity-0 hover:bg-opacity-10"
      >
        <img
          className="w-5"
          src={addBase('/themes/Yaru/status/chrome_refresh.svg')}
          alt="Ubuntu Chrome Refresh"
        />
      </div>
      <div
        onClick={onHomeBtnClick}
        className=" mr-2 ml-1 flex justify-center items-center rounded-full bg-gray-50 bg-opacity-0 hover:bg-opacity-10"
      >
        <img
          className="w-5"
          src={addBase('/themes/Yaru/status/chrome_home.svg')}
          alt="Ubuntu Chrome Home"
        />
      </div>
      <input
        value={value}
        ref={inputRef}
        onChange={(e) => {
          onInputChange?.(e.target.value)
        }}
        className="outline-none bg-ub-grey rounded-full pl-3 py-0.5 mr-3 flex-grow text-gray-300 focus:text-white"
        type="url"
        autoComplete="off"
      />
    </div>
  )
}

const Firefox: React.FC = () => {
  const [url, setUrl] = useState(homeUrl)
  const [displayUrl, setDisplayUrl] = useState(url)

  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const onInputChange: Required<ToolbarProps>['onInputChange'] = useCallback(
    (value) => {
      setUrl(value)
    },
    [setUrl]
  )
  const onInputEnter: Required<ToolbarProps>['onInputEnter'] = useCallback(
    (value) => {
      if (!value) {
        return
      }
      setDisplayUrl((state) => {
        if (state === value) {
          if (iframeRef.current) {
            iframeRef.current.src = `${iframeRef.current.src}`
          }
          return state
        }
        if (validateUrl(value)) {
          return value
        } else {
          return `http://${value}`
        }
      })
    },
    [setDisplayUrl]
  )
  const onRefreshBtnClick: Required<ToolbarProps>['onRefreshBtnClick'] =
    useCallback(() => {
      if (iframeRef.current) {
        // eslint-disable-next-line no-self-assign
        iframeRef.current.src = `${iframeRef.current.src}`
      }
      setUrl(displayUrl)
    }, [setUrl, displayUrl])

  const onHomeBtnClick: Required<ToolbarProps>['onHomeBtnClick'] =
    useCallback(() => {
      if (iframeRef.current) {
        // eslint-disable-next-line no-self-assign
        iframeRef.current.src = iframeRef.current.src
      }
      setDisplayUrl(homeUrl)
      setUrl(homeUrl)
    }, [setDisplayUrl])

  useEffect(() => {
    setUrl(displayUrl)
  }, [displayUrl, setUrl])
  return (
    <div className="h-full w-full flex flex-col bg-ub-cool-grey">
      <Toolbar
        onInputChange={onInputChange}
        onInputEnter={onInputEnter}
        onRefreshBtnClick={onRefreshBtnClick}
        onHomeBtnClick={onHomeBtnClick}
        value={url}
      />
      <iframe
        ref={iframeRef}
        src={displayUrl}
        className="flex-grow"
        id="firefox"
        frameBorder="0"
        title="Firefox"
      />
    </div>
  )
}

export default Firefox
