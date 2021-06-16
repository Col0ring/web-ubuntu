import React from 'react'
import { BackgroundImageType } from '../type'

export interface BackgroundImageProps {
  type: BackgroundImageType
  image?: string
}
const defaultImages = {
  'wall-1': '/images/wallpapers/wall-1.jpg',
  'wall-2': '/images/wallpapers/wall-2.png',
  'wall-3': '/images/wallpapers/wall-3.jpg',
  'wall-4': '/images/wallpapers/wall-4.jpg',
  'wall-5': '/images/wallpapers/wall-5.jpg',
  'wall-6': '/images/wallpapers/wall-6.png',
  'wall-7': '/images/wallpapers/wall-7.png',
  'wall-8': '/images/wallpapers/wall-8.jpg'
}
const BackgroundImage: React.FC<BackgroundImageProps> = ({ type, image }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${image ? image : defaultImages[type]})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPositionX: 'center'
      }}
      className="absolute top-0 right-0 overflow-hidden h-full w-full -z-10"
    ></div>
  )
}

export default BackgroundImage
