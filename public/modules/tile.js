const setup = (state) => {
    const { form, parameters } = state
    const { points } = form
    const gridSize = parameters.gridSize / 2
    return { form, parameters, points, gridSize }
}

export const drawGridFromShapeBufferArray = (state, targetBuffer, buffers, form = state.form) => {
    const { parameters, gridSize, points } = setup(state)
    let counter = 1

    const gridSizeMultiple = gridSize * 0.01
    const xGap = form.getWidth() * gridSizeMultiple
    const yGap = form.getHeight() * gridSizeMultiple

    // translate pen to 0,0 then one shape dimension further
    targetBuffer.translate(
        -1 * form.getXOffset(points) - form.getWidth(),
        -1 * form.getYOffset(points) - form.getHeight()
    )

    // count rows
    for (let row = 0; row < ((targetBuffer.height * 2) / yGap); row++) {
        const everyOtherFactor = row % 2
        // temp row shifts for the alternation
        const rx = everyOtherFactor * xGap
        // row shift
        const ry = yGap * row

        // count columns
        for (let col = 0; col < ((targetBuffer.width * 1.5) / xGap); col++) {
            // col shift
            const cx = xGap * col

            targetBuffer.image(buffers[counter % 2], cx + rx, ry)

            counter++
        }
        if (counter > 2) {counter = 1}
    }

    //translate back to origin to prepare for another draw()
    targetBuffer.translate(
        1 * form.getXOffset(points) + form.getWidth(),
        1 * form.getYOffset(points) + form.getHeight() 
    )
}

export const drawRelativeGrid = (state, buffer, form=state.form) => {
    const { parameters, gridSize } = setup(state)
    const { points } = form
    let counter = 1

    const gridSizeMultiple = gridSize * 0.01
    const xGap = form.getWidth() * gridSizeMultiple
    const yGap = form.getHeight() * gridSizeMultiple

    // translate pen to 0,0 then one shape dimension further
    buffer.translate(
        -1 * form.getXOffset(points) - form.getWidth(),
        -1 * form.getYOffset(points) - form.getHeight()
    )

    // count rows
    for (let row = 0; row < ((buffer.height * 2) / yGap); row++) {
        const everyOtherFactor = row % 2
        // temp row shifts for the alternation
        const rx = everyOtherFactor * xGap
        // row shift
        const ry = yGap * row
        buffer.translate(rx, ry)

        // count columns
        for (let col = 0; col < ((buffer.width * 1.5) / xGap); col++) {
            // col shift
            const cx = xGap * col
            buffer.translate(cx, 0)

            //TODO: image the shapebuffer onto the pattern buffer for performance
            form.draw(buffer, parameters.colorArray[counter % 2])

            counter++
            // reverse col shift
            buffer.translate(-cx, 0)
        }

        // reverse row shift
        buffer.translate(-rx, -ry)

        if (counter > 2) {counter = 1}
    }

    //translate back to origin to prepare for another draw()
    buffer.translate(
        1 * form.getXOffset(points) + form.getWidth(),
        1 * form.getYOffset(points) + form.getHeight() 
    )
}

export const drawAlternateFlip = () => {
    setup
}