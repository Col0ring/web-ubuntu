import createMethodsContext from '@/hooks/common/factory/createMethodsContext'
import { DragContextValue } from './type'
const [useDragContext, DragProvider, withDragProvider] = createMethodsContext(
  (state) => ({
    setDragArea(options: DragContextValue['dragArea']) {
      return { ...state, dragArea: options }
    }
  }),
  {
    dragArea: {
      width: 0,
      height: 0
    }
  } as DragContextValue
)

export { useDragContext, DragProvider, withDragProvider }
