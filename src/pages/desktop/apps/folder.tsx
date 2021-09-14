import React from 'react'
import FolderComponent, {
  FolderProps as FolderComponentProps,
} from '../components/folder'

export type FolderProps = Omit<
  FolderComponentProps,
  'className' | 'wrapperClassName'
>
const Folder: React.FC<FolderProps> = (props) => {
  return (
    <FolderComponent
      className="min-h-full flex-grow flex flex-wrap items-start content-start justify-start"
      wrapperClassName="w-full h-full flex flex-col bg-ub-cool-grey text-white select-none overflow-x-auto overflow-y-auto ub-scrollbar"
      {...props}
    />
  )
}

export default Folder
