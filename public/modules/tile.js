export const draw = (state, buffer) => {
    const { form, parameters } = state
    const { points } = form
    const gridSize = parameters.gridSize / 2
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
        buffer.translate(x,y)

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

export const drawAlternateFlip = () => {
    setup
}