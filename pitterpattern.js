import * as shape from '/shape.js'
import * as cursor from '/cursor.js'
import * as util from '/utilities.js'

const p5Sketch = new p5( (s) => {
    var baseCanvas
    var buffers = {}
    var state = {
        feedback: null,
        selecting: false
    }
    const radius = 10
    const form = new shape.Shape(radius)

    s.setup = () => {
        baseCanvas = s.createCanvas(
            document.getElementById('console-label').offsetWidth - 36,
            innerHeight * 0.665
        )
        s.frameRate(30)
        buffers.cursorBuffer = s.createGraphics(baseCanvas.width,baseCanvas.height);
        buffers.shapeBuffer = s.createGraphics(baseCanvas.width,baseCanvas.height);
        buffers.patternBuffer = s.createGraphics(baseCanvas.width,baseCanvas.height);
        baseCanvas.parent('sketch-holder');
        // dom.initializeNewInterfaceElements();
    }

    s.draw = () => {
        // clear the baseCanvas
        s.background('#181818')

        //draw things to their respective buffers
        cursor.draw(buffers.cursorBuffer, s.mouseX, s.mouseY)
        form.draw(buffers.shapeBuffer)
        
        //draw feedback to the cursor buffer and do it smOooth
        let looping = state.feedback ? state.feedback.draw(buffers.cursorBuffer, s.mouseX, s.mouseY) : false
        if (looping) {
            s.loop()
        } else {
            console.log('noLoop()')
            s.noLoop()
        }
        
        //apply all buffers to the sketch
        Object.keys(buffers).forEach((key) => {
            s.image(buffers[key],0,0)
            //clear all buffers
            //TODO: only clear when you need to (especially shape buffers with fills)
            buffers[key].clear()
        })

        // dom.pullInputValues()
        // dom.checkButtons()
        // stats.updateTimePanel()
    }

    s.mousePressed = () => {
        state.selecting = cursor.clickingOnExistingPoint(
            buffers.cursorBuffer,
            s.mouseX,
            s.mouseY,
            form.points,
            radius
        )

        if (state.selecting) {
            let indexOfClosestPoint = util.findClosestPoint(
                buffers.cursorBuffer,
                s.mouseX,
                s.mouseY,
                form.points);
            state.indexOfClosestPoint = indexOfClosestPoint
            s.noLoop()
        } else if (util.inCanvas(baseCanvas,s.mouseX,s.mouseY)) {
            state.feedback = cursor.updateFeedback(s.mouseX,s.mouseY,radius)
            form.addPoint(s.mouseX,s.mouseY)
            s.loop()
        }
    }
    
    s.mouseMoved = () => {
        if (util.inCanvas(baseCanvas,s.mouseX,s.mouseY)) {
            s.loop()
        }
    }
    
    s.mouseDragged = () => {
        s.loop()
        if (state.selecting) {
            form.points[state.indexOfClosestPoint].x = s.mouseX
            form.points[state.indexOfClosestPoint].y = s.mouseY
        }

        // drag and draw functionality
        // if (!cursor.clickingOnExistingPoint(mouseX,mouseY,form.points) && over == true) {
        //     try {
        //         if (dist(mouseX,mouseY,form.points[form.points.length-1].x,form.points[form.points.length-1].y) > dragInterval) {
        //             form.addPoint(mouseX,mouseY);
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

//not exposed
function scaleShape(shape,scale) {
    for (let i = 0; i < shape.length; i++) {
        shape[i].x *= scale;
        shape[i].y *= scale;
    }
    return shape;
}

function toggleFill() {
    if (fillmode) {
        fillmode = false
        buttonFillToggle.classList.remove('active')
    } else {
        fillmode = true
        buttonFillToggle.classList.add('active')
    };
}

function toggleBorder() {
    if (borderMode) {
        borderMode = false
        buttonBorderToggle.classList.remove('active')
    } else {
        borderMode = true
        buttonBorderToggle.classList.add('active')
    };
}

function toggleCurve() {
    if (curvemode) {
        curvemode = false
        buttonCurveToggle.classList.remove('active')
    } else {
        curvemode = true
        buttonCurveToggle.classList.add('active')
    }
}

function exportPattern() {
    buffering = true;
    console.log(buffering);
    let exportscalex = document.getElementById('export-scale-x').value;
    let exportscaley = document.getElementById('export-scale-y').value;
    buffer = createGraphics(exportscalex * baseCanvas.width, exportscaley * baseCanvas.height);
    numberOfRows = round(buffer.height / gridUnit) + 1;
    numberOfColumns = round(buffer.width / gridUnit) + 1;
    offsetMatrix = populateOffsetTargetMatrix(numberOfRows,numberOfColumns);
    buffer = syncBuffer(buffer,borderMode,borderSize,fillmode);
    drawPattern(form.shape,numberOfRows,numberOfColumns);
    draw();
    save(buffer, "filename", 'png');
    buffering = false;
}

function exportForm(form) {
    formBuffering = true;
    shapebuffer = createGraphics(getShapeWidth(form.shape), getShapeHeight(form.shape));
    bufferform = copyOf(form.shape);
    bufferform.offset(-getXDistFromZero(bufferform.shape),-getYDistFromZero(bufferform.shape));
    shapebuffer = syncBuffer(shapebuffer,borderMode,borderSize,fillmode,colorway);
    console.log(bufferform);
    draw();
    save(shapebuffer, "filename", 'png');
    formBuffering = false;
}

function syncBuffer(graphics,bordermode,bordersize,fillmode,color) {
    if (bordermode) {
        graphics.strokeWeight(bordersize)
        graphics.stroke(255);
    } else {
        graphics.noStroke();
    }
    if (!fillmode) {
        graphics.noFill();
    } else {
        graphics.fill(color)
    }
    return graphics;
}
