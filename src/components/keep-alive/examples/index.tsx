import React, { useState } from 'react'
import Count from './count'
import { KeepAlive, KeepAliveProvider } from '..'
import { useKeepAlive } from '../hooks'

const ResetButton: React.FC = () => {
  const { clear } = useKeepAlive()
  return (
    <button
      onClick={() => {
        clear()
      }}
    >
      Destroy
    </button>
  )
}

const Example: React.FC = () => {
  const [show, setShow] = useState(true)
  const [listShow, setListShow] = useState(true)
  return (
    <KeepAliveProvider>
      <div>
        <button
          onClick={() => {
            setShow((state) => !state)
          }}
        >
          Show Count
        </button>
        <button
          onClick={() => {
            setListShow((state) => !state)
          }}
        >
          Show List
        </button>
        <ResetButton />
      </div>
      {show && (
        <KeepAlive cacheId="count">
          <Count />
        </KeepAlive>
      )}
      {listShow && (
        <KeepAlive
          style={{
            height: 200,
            overflow: 'scroll',
            backgroundColor: 'green',
          }}
          cacheId="list"
          scroll
        >
          <div>
            2000
            <div style={{ backgroundColor: 'red', height: 1000000 }} />
          </div>
        </KeepAlive>
      )}
    </KeepAliveProvider>
  )
}

export default Example
