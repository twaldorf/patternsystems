
import * as cursor from './cursor.js'
import * as util from './utilities.js'
import * as ui from './ui.js'
import * as stateCore from './state.js'
import * as tile from './tile.js'
import * as save from './save.js'

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
        s.background('#181818')

        const updated = lastFormState == JSON.stringify(state.form) ? false : true
        const populated = state.form.points.length > 1

        //draw things to their respective buffers
        buffers.cursorBuffer.clear()
        cursor.draw(buffers.cursorBuffer, s.mouseX, s.mouseY)

        if (updated && populated) {
            buffers.shapeBuffer.clear()
            state.form.updateParams(state)
            // state.form.draw(buffers.shapeBuffer)
            const width = state.form.getWidth(state.form.points)
            const height = state.form.getHeight(state.form.points)
            buffers.shapeBuffer = s.createGraphics(width, height)
            state.form.drawShapeAt(buffers.shapeBuffer, state.form.points, 0, 0)
        }
        
        if (state.parameters.tiling == true && populated) {
            if (updated) {
                //this is where you would create a new buffer for each shape
                buffers.patternBuffer.clear()
                tile.draw(state, buffers.patternBuffer)
            }
        }
        
        // draw feedback to the cursor buffer
        // let looping = (
        //     state.feedback ? 
        //     state.feedback.draw(buffers.cursorBuffer, s.mouseX, s.mouseY) 
        //     : false)
        // if (looping) {
        //     console.log('looping')
        //     s.loop()
        // } else {
        //     console.log('stop loop')
        //     s.noLoop()
        // }

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
            s.save(baseCanvas, "filename", 'png');
            state.exporting = false;
        }

        lastFormState = JSON.stringify(state.form)
    }

    s.mousePressed = () => {
        if (!util.inCanvas(baseCanvas,s.mouseX,s.mouseY)) {
            console.log('clicked outside')
            s.redraw()
            return
        } else {
            state.selecting = cursor.clickingOnExistingPoint(
                buffers.cursorBuffer,
                s.mouseX,
                s.mouseY,
                state.form.points,
                state.radius
            )

            if (state.selecting) {
                let indexOfClosestPoint = util.findClosestPoint(
                    buffers.cursorBuffer,
                    s.mouseX,
                    s.mouseY,
                    state.form.points);
                state.indexOfClosestPoint = indexOfClosestPoint
                s.noLoop()
            } else if (util.inCanvas(baseCanvas,s.mouseX,s.mouseY)) {
                state.feedback = cursor.updateFeedback(s.mouseX,s.mouseY,state.radius)
                state.form.addPoint(s.mouseX,s.mouseY)
                s.loop()
            }
        }
        
    }
    
    // s.mouseMoved = () => {
    //     if (util.inCanvas(baseCanvas,s.mouseX,s.mouseY)) {
    //         s.loop()
    //     }
    // }
    
    s.mouseDragged = () => {
        s.loop()
        if (state.selecting) {
            state.form.points[state.indexOfClosestPoint].x = s.mouseX
            state.form.points[state.indexOfClosestPoint].y = s.mouseY
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
