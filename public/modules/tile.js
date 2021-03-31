const setup = (state) => {
    const { form, parameters } = state
    const { points } = form
    const gridSize = parameters.gridSize / 2
    return { form, parameters, points, gridSize }
}

export const draw = (state, buffer) => {
    const { form, parameters, points, gridSize } = setup(state)
    let counter = 1

    //translate to (and past) 0,0
    buffer.translate(
        -2 * form.getXOffset(points) + form.getWidth(),
        -2 * form.getYOffset(points) + form.getHeight()
    )

    // count rows
    for (let row = 0; row < (buffer.height / gridSize); row++) {
        const everyOtherFactor = row % 2
        const rx = everyOtherFactor * parameters.gridSize
        const ry = parameters.gridSize * row
        buffer.translate(rx,ry)

        //count columns
        for (let col = 0; col < (buffer.width / gridSize); col++) {

            const cx = parameters.gridSize * col

            buffer.translate(cx, 0)

            //TODO: image the shapebuffer onto the pattern buffer for performance
            form.draw(buffer, parameters.colorArray[counter % 2])

            counter++

            buffer.translate(-cx, 0)
        }

        buffer.translate(-rx, -ry)

        if (counter > 2) {counter = 1}
    }

    //translate back to origin to prepare for another draw()
    buffer.translate(
        2 * form.getXOffset(points) - form.getWidth(),
        2 * form.getYOffset(points) - form.getHeight()
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