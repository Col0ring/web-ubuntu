import React, { useCallback } from 'react'
import Clock from '@/components/clock'
import Transition from '@/components/transition'
import { useDesktopContext } from '../../provider'
import './style.less'

const LockScreen: React.FC = () => {
  const [{ backgroundImage, lockScreen }, desktopMethods] = useDesktopContext()

  const onActive = useCallback(() => {
    desktopMethods.setLockScreen(false)
  }, [desktopMethods])
  return (
    <Transition
      visible={lockScreen}
      duration={200}
      enterClassName="lock-screen-show"
      leaveClassName="lock-screen-leave"
    >
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`
        }}
        onClick={onActive}
        onKeyPress={onActive}
        className="lock-screen absolute w-full h-full outline-none select-none top-0 right-0 overflow-hidden m-0 p-0 bg-opacity-50"
      >
        <div className="lock-screen-content flex flex-col justify-center items-center text-white">
          <div className="text-7xl">
            <Clock type="time" />
          </div>
          <div className="mt-4 text-xl font-medium">
            <Clock type="date" />
          </div>
          <div className=" mt-16 text-base">Click or Press a key to unlock</div>
        </div>
      </div>
    </Transition>
  )
}

export default LockScreen
