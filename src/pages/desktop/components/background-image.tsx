import React from 'react'

export interface BackgroundImageProps {
  src: string
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ src }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPositionX: 'center'
      }}
      className="absolute top-0 right-0 overflow-hidden h-full w-full -z-10"
    ></div>
  )
}

export default BackgroundImage
