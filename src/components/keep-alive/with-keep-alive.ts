import React from 'react'
import KeepAlive, { KeepAliveProps } from './keep-alive'

export interface WithKeepAliveOptions extends KeepAliveProps {}
const withKeepAlive = <P>(
  WrapperComponent: React.ElementType<P>,
  options: WithKeepAliveOptions
) => {
  return function ProviderWrapper(props) {
    return React.createElement(
      KeepAlive,
      options,
      React.createElement(WrapperComponent, props)
    )
  } as React.FC<P>
}

export { withKeepAlive }
export default withKeepAlive
