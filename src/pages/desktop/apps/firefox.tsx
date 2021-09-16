import React, { useCallback, useEffect, useRef, useState } from 'react'
import useKeyPress from '@/hooks/common/useKeyPress'
import { validateUrl } from '@/utils/validator'

interface ToolbarProps {
  onChange?: (value: string) => void
  onEnter?: (value: string) => void
  value?: string
}
const Toolbar: React.FC<ToolbarProps> = ({ onChange, onEnter, value }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  useKeyPress(
    'enter',
    (e) => {
      const target = e.target as HTMLInputElement
      onEnter?.(target.value.trim())
    },
    {
      target: inputRef,
    }
  )
  return (
    <div className="w-full pt-0.5 pb-1 flex justify-start items-center text-white text-sm border-b border-gray-900">
      <div className=" ml-2 mr-1 flex justify-center items-center rounded-full bg-gray-50 bg-opacity-0 hover:bg-opacity-10">
        <img
          className="w-5"
          src="./themes/Yaru/status/chrome_refresh.svg"
          alt="Ubuntu Chrome Refresh"
        />
      </div>
      <div className=" mr-2 ml-1 flex justify-center items-center rounded-full bg-gray-50 bg-opacity-0 hover:bg-opacity-10">
        <img
          className="w-5"
          src="./themes/Yaru/status/chrome_home.svg"
          alt="Ubuntu Chrome Home"
        />
      </div>
      <input
        value={value}
        ref={inputRef}
        onChange={(e) => {
          onChange?.(e.target.value)
        }}
        className="outline-none bg-ub-grey rounded-full pl-3 py-0.5 mr-3 flex-grow text-gray-300 focus:text-white"
        type="url"
        autoComplete="off"
      />
    </div>
  )
}

const Firefox: React.FC = () => {
  const [url, setUrl] = useState('https://www.google.com/webhp?igu=1')
  const [displayUrl, setDisplayUrl] = useState(url)

  const onChange: Required<ToolbarProps>['onChange'] = useCallback(
    (value) => {
      setUrl(value)
    },
    [setUrl]
  )
  const onEnter: Required<ToolbarProps>['onEnter'] = useCallback(
    (value) => {
      if (!value) {
        return
      }
      if (validateUrl(value)) {
        setDisplayUrl(value)
      } else {
        setDisplayUrl(`http://${value}`)
      }
    },
    [setDisplayUrl]
  )
  useEffect(() => {
    setUrl(displayUrl)
  }, [displayUrl, setUrl])
  return (
    <div className="h-full w-full flex flex-col bg-ub-cool-grey">
      <Toolbar onChange={onChange} onEnter={onEnter} value={url} />
      <iframe
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
