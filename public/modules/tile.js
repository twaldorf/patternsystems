export const draw = (state, buffer) => {
    console.log('draw')
    const gridSize = state.parameters.gridSize / 2
    // const gridSize = state.form.getWidth(state.form.points) / unit
    // drawFrom each point to eliminate need for offset matrix, in nested for loops
    const normal = state.form.normalize(state.form.points)

    //translate to 0,0
    buffer.translate(
        -1 * state.form.getXOffset(state.form.points),
        -1 * state.form.getYOffset(state.form.points)
    )

    for (let row = 0; row < (buffer.height / gridSize); row++) {
        buffer.translate(0, state.parameters.gridSize * row)
        for (let col = 0; col < (buffer.width / gridSize); col++) {
            buffer.translate( state.parameters.gridSize * col, 0)
            state.form.draw(buffer)
            buffer.translate(-1 * state.parameters.gridSize * col, 0)
        }
        buffer.translate(0, -1 * state.parameters.gridSize * row)
    }

    //translate back to origin to prepare for another draw()
    buffer.translate(
        state.form.getXOffset(state.form.points),
        state.form.getYOffset(state.form.points)
    )
}
