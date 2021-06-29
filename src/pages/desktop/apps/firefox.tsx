import React, { useState } from 'react'

// TODO: function
const Toolbar: React.FC = () => {
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
        className="outline-none bg-ub-grey rounded-full pl-3 py-0.5 mr-3 flex-grow text-gray-300 focus:text-white"
        type="url"
        autoComplete="off"
      />
    </div>
  )
}

const Firefox: React.FC = () => {
  const [url, setUrl] = useState('https://www.google.com/webhp?igu=1')
  return (
    <div className="h-full w-full flex flex-col bg-ub-cool-grey">
      <Toolbar />
      <iframe
        src={url}
        className="flex-grow"
        id="firefox"
        frameBorder="0"
        title="Firefox"
      ></iframe>
    </div>
  )
}

export default Firefox
