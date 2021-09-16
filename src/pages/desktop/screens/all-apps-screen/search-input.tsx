import React, { useCallback } from 'react'
import classnames from 'classnames'
import { addBase } from '@/utils/prod'

export interface SearchInputProps {
  placeholder?: string
  className?: string
  value?: string
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Type to Search...',
  className,
  value,
  onChange,
}) => {
  const searchInputClassName = classnames(
    'flex w-1/4 h-full items-center pl-2 pr-2 bg-white border-black border-width-2 rounded-xl overflow-hidden left',
    className
  )
  const hasDefaultValue = typeof value === 'undefined'
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      onChange?.(e.target.value, e)
    },
    [onChange]
  )
  return (
    <div className={searchInputClassName}>
      <img
        className="w-5 h-5"
        alt="search icon"
        src={addBase('/images/logos/search.png')}
      />
      <input
        className="w-full p-1 bg-transparent focus:outline-none"
        placeholder={placeholder}
        value={hasDefaultValue ? undefined : value}
        onChange={onInputChange}
      />
    </div>
  )
}

export default SearchInput
