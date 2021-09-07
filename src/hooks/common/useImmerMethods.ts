import { createUseMethods } from 'react-use-methods'
import { combineReducers } from 'react-use-methods/reducer-mapper/es/immer'

const useImmerMethods = createUseMethods({
  reducerMapper: combineReducers,
})

export default useImmerMethods
