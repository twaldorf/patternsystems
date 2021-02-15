import * as shape from '../shape.js'

export const action = (state) => {
    state.form = new shape.Shape(state.parameters.radius, state)
    return true
}