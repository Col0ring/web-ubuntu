import React, { useState } from 'react'

const Count: React.FC = () => {
  const [count, setCount] = useState(0)
  return (
    <div>
      <div>count: {count}</div>
      <div>
        <button
          onClick={() => {
            setCount(count + 1)
          }}
        >
          Increment
        </button>
      </div>
    </div>
  )
}

export default Count
