import * as cursor from './cursor.js'
import * as util from './utilities.js'
import * as ui from './ui.js'
import * as stateCore from './state.js'
import * as tile from './tile.js'
import * as save from './save.js'
import * as exporter from './exporter.js'
import { Shape } from './shape.js'

const p5Sketch = new p5( (s) => {
    var baseCanvas
    var buffers = {}

    var state = new stateCore.State()
    var lastFormState
    
    s.setup = () => {
        baseCanvas = s.createCanvas(
            document.getElementById('console-label').offsetWidth - 36,
            innerHeight * 0.665
        )
        s.frameRate(20)
        buffers.cursorBuffer = s.createGraphics(baseCanvas.width,baseCanvas.height)
        buffers.shapeBuffer = s.createGraphics(baseCanvas.width,baseCanvas.height)
        buffers.patternBuffer = s.createGraphics(baseCanvas.width,baseCanvas.height)
        ui.setup(state, baseCanvas)
        save.setup(state)
    }

    s.draw = () => {
        // clear the baseCanvas
        s.background(s.color(state.parameters.bgColor))

        const updated = lastFormState == JSON.stringify(state.form) ? false : true
        const populated = state.form.points.length > 0

        //draw things to their respective buffers
        buffers.cursorBuffer.clear()
        cursor.draw(buffers.cursorBuffer, s.mouseX, s.mouseY)

        if (updated && populated) {
            buffers.shapeBuffer.clear()
            state.form.updateParameters(state)
            // state.form.draw(buffers.shapeBuffer)
            const width = state.form.getWidth() + 2 * state.form.pointRadius
            const height = state.form.getHeight() + 2 * state.form.pointRadius
            buffers.shapeBuffer = s.createGraphics(width, height)
            state.form.drawShapeAt(buffers.shapeBuffer, state.form.points, state.form.pointRadius,state.form.pointRadius)
        }
        
        if (state.parameters.tiling == true && populated) {
            if (updated) {
                //this is where you would create a new buffer for each shape
                buffers.patternBuffer.clear()
                tile.drawRelativeGrid(state, buffers.patternBuffer)
            }
        } else {
            buffers.patternBuffer.clear()
        }
        
        // draw feedback to the cursor buffer
        let looping = (
            state.feedback ? 
            state.feedback.draw(buffers.cursorBuffer, s.mouseX, s.mouseY) 
            : false)
        if (looping) {
            s.loop()
        } else {
            s.noLoop()
        }

        //apply all buffers to the sketch
        Object.keys(buffers).forEach((key) => {
            if (!populated) {
                buffers[key].clear()
            }
            if (key == 'shapeBuffer' && populated) {
                const xOffset = state.form.getXOffset(state.form.points)
                const yOffset = state.form.getYOffset(state.form.points)
                s.image(buffers[key],xOffset,yOffset)
            } else {
                s.image(buffers[key],0,0)
            }
        })

        if (state.exporting) {
            //TODO: move to export component please
            let { form } = state
            
            const scaledForm = new Shape(10, state)

            scaledForm.points = form.points

            scaledForm.scale(4)

            scaledForm.points = scaledForm.normalize()

            // set up a "single tile" buffer for seamless tile
            // the width and size multiple of this buffer depends on the tile scheme
            // currently 2x for the simple alternating color grid scheme, for 4 complete shapes on the tile
            const width = scaledForm.getWidth() * state.parameters.gridSize * 0.01 * 2
            const height = scaledForm.getHeight() * state.parameters.gridSize * 0.01  * 2

            const singleTileBuffer = s.createGraphics(width, height)
            const name = 'DPS pattern'

            //paint background
            singleTileBuffer.background(state.parameters.bgColor)
            // patternize
            tile.drawRelativeGrid(state, singleTileBuffer, scaledForm)

            state.exporting = false

            exporter.exportToPng(singleTileBuffer, state, width, height, name)
        }

        lastFormState = JSON.stringify(state.form)
    }

    s.mousePressed = () => {
        if (!util.inCanvas(baseCanvas,s.mouseX,s.mouseY)) {
            s.redraw()
            return
        } else {
            let mouseX = s.mouseX - state.form.pointRadius
            let mouseY = s.mouseY - state.form.pointRadius
            state.selecting = cursor.clickingOnExistingPoint(
                buffers.cursorBuffer,
                mouseX,
                mouseY,
                state.form.points,
                state.radius
            )

            if (state.selecting) {
                let indexOfClosestPoint = util.findClosestPoint(
                    buffers.cursorBuffer,
                    mouseX,
                    mouseY,
                    state.form.points);
                state.indexOfClosestPoint = indexOfClosestPoint
                s.noLoop()
            } else if (util.inCanvas(baseCanvas,mouseX,mouseY)) {
                state.feedback = cursor.updateFeedback(mouseX,mouseY,state.radius)
                state.form.addPoint(mouseX,mouseY)
                s.loop()
            }
        }
        
    }
    
    s.mouseMoved = () => {
        if (util.inCanvas(baseCanvas,s.mouseX,s.mouseY)) {
            s.loop()
        }
    }
    
    s.mouseDragged = () => {
        if (!util.inCanvas(baseCanvas,s.mouseX,s.mouseY)) {
            console.log('clicked outside')
            s.redraw()
            return
        } else if (state.selecting) {
            s.loop()
            state.form.points[state.indexOfClosestPoint].x = s.mouseX - state.form.pointRadius
            state.form.points[state.indexOfClosestPoint].y = s.mouseY - state.form.pointRadius
        }

        // drag and draw functionality
        // if (!cursor.clickingOnExistingPoint(mouseX,mouseY,state.form.points) && over == true) {
        //     try {
        //         if (dist(mouseX,mouseY,state.form.points[state.form.points.length-1].x,state.form.points[state.form.points.length-1].y) > dragInterval) {
        //             state.form.addPoint(mouseX,mouseY);
        //         }
        //     }
        //     catch (error) {
        //         console.log(error)
        //     }
        // }
    }

    s.mouseReleased = () => {
    }

})
