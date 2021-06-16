import React from 'react'

export interface LoginButtonProps {
  onClick?: (e: React.MouseEvent) => void
  loading?: boolean
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick, loading }) => {
  return (
    <div
      className="w-10 h-10 flex justify-center items-center rounded-full outline-none cursor-pointer"
      onClick={onClick}
    >
      {loading ? (
        <img
          className="w-10 animate-spin"
          src='/themes/Yaru/status/process-working-symbolic.svg'
          alt="Ubuntu Process Symbol"
        />
      ) : (
        <div className="bg-white rounded-full flex justify-center items-center w-10 h-10 hover:bg-gray-300">
          <img className="w-8" src='/themes/Yaru/status/power-button.svg' alt="Power Button" />
        </div>
      )}
    </div>
  )
}

export default LoginButton
