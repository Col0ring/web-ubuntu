import React, { useMemo } from 'react'
import { useDesktopContext } from '../provider'

const Settings: React.FC = () => {
  const [{ backgroundImage, backgroundImages }, desktopMethods] =
    useDesktopContext()
  const wallpapers = useMemo(() => {
    return Object.entries(backgroundImages)
  }, [backgroundImages])
  return (
    <div className="flex w-full h-full flex-col z-20 overflow-y-auto select-none bg-ub-cool-grey">
      <div
        className="md:w-2/5 h-1/3 w-2/3 m-auto my-4 flex-shrink-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
        }}
      />
      <div className="flex flex-grow flex-wrap justify-center content-start items-center border-t border-gray-900">
        {wallpapers.map(([name, url], index) => {
          return (
            <div
              key={index}
              tabIndex={0}
              onFocus={() => {
                desktopMethods.chooseBackgroundImage(url)
              }}
              data-path={name}
              className={`${
                url === backgroundImage
                  ? ' border-yellow-700 '
                  : ' border-transparent '
              } md:px-28 md:py-20 md:m-4 m-2 px-14 py-10 outline-none border-4 border-opacity-80`}
              style={{
                backgroundImage: `url(${url})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Settings
