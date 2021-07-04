export interface DragContextValue {
  dragArea: {
    width: number
    height: number
    limitRange: {
      x: [xMin: number, xMax: number]
      y: [yMin: number, yMax: number]
    }
  }
}
