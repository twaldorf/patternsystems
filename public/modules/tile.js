export const draw = (state, buffer) => {
    let counter = 1
    const gridSize = state.parameters.gridSize / 2
    // const gridSize = state.form.getWidth(state.form.points) / unit
    // drawFrom each point to eliminate need for offset matrix, in nested for loops
    const normal = state.form.normalize(state.form.points)

    //support different tiling

    //translate to 0,0
    buffer.translate(
        -2 * state.form.getXOffset(state.form.points),
        -2 * state.form.getYOffset(state.form.points)
    )

    for (let row = 0; row < (buffer.height / gridSize); row++) {
        buffer.translate(0, state.parameters.gridSize * row)
        for (let col = 0; col < (buffer.width / gridSize); col++) {
            buffer.translate( state.parameters.gridSize * col, 0)
            //this really ought to just image the shapebuffer onto the pattern buffer
            state.form.draw(buffer, state.parameters.colorArray[counter % 2])
            counter++
            buffer.translate(-1 * state.parameters.gridSize * col, 0)
        }
        buffer.translate(0, -1 * state.parameters.gridSize * row)
        if (counter > 2) {counter = 0}
    }

    //translate back to origin to prepare for another draw()
    buffer.translate(
        2* state.form.getXOffset(state.form.points),
        2* state.form.getYOffset(state.form.points)
    )
}
