import * as shape from '../shape.js'

export const action = (state) => {
  state.form = new shape.Shape(state.radius, state)
  state.parameters.tiling = false
  return true
}
