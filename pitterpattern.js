import * as shape from '/shape.js'
import * as cursor from '/cursor.js'

const p5Sketch = new p5( (s) => {
    var baseCanvas
    var buffers = {}
    var feedback
    const form = new shape.Shape

    s.setup = () => {
        baseCanvas = s.createCanvas(
            document.getElementById('console-label').offsetWidth - 36,
            innerHeight * 0.665
            );
        buffers.cursorBuffer = s.createGraphics(baseCanvas.width,baseCanvas.height);
        buffers.shapeBuffer = s.createGraphics(baseCanvas.width,baseCanvas.height);
        buffers.patternBuffer = s.createGraphics(baseCanvas.width,baseCanvas.height);
        baseCanvas.parent('sketch-holder');
        // dom.initializeNewInterfaceElements();
    }

    s.draw = () => {
        s.background('#181818')
        //this is temporarily the stuff that a render() fnc would do
        //all functions here should specify the pencil and the canvas (usually buffers)–so no hidden stuff/autonomous functions
        //draw things to their respective buffers
        cursor.draw(buffers.cursorBuffer, s.mouseX, s.mouseY)
        form.draw(buffers.shapeBuffer)

        //diagnostics
        //console.log(form.points, buffers.shapeBuffer);
        
        //draw feedback
        let looping = feedback ? feedback.draw(buffers.cursorBuffer, s.mouseX, s.mouseY) : false
        console.log(feedback, looping)
        if (looping) {
            s.loop()
        } else {
            s.noLoop()
        }
        
        //apply all buffers to the sketch
        Object.keys(buffers).forEach((key) => {
            s.image(buffers[key],0,0)
        })

        //clean the cursor buffer
        buffers.cursorBuffer.clear()
        // s.image(buffers.cursorBuffer,0,0)
        // dom.pullInputValues()
        // renderAll(primaryQueue)
        // dom.checkButtons()
        // stats.updateTimePanel()
    }

    s.mousePressed = () => {
        feedback = cursor.updateFeedback(s.mouseX,s.mouseY)
        form.addPoint(s.mouseX,s.mouseY)
        s.loop()
        // if (cursor.clickingOnExistingPoint(s.mouseX,s.mouseY,form.shape)) {
            // let indexOfClosestPoint = findClosestPoint(mouseX,mouseY,form.shape);
            // form.shape[indexOfClosestPoint].select();
        // } else {
        // }
    }

    s.mouseDown = () => {
        s.loop()
    }

    s.mouseMoved = () => {
        s.loop()
    }
})

// function renderAll(queue) {
//     lock = true;
//     queue.forEach(function(element) {
//         element.updateColor(colorway);
//         element.render();
//     });
//     updateShapeStatistics();
//     lock = false;
// }

function mouseDragged() {
    if (form.shape.length > 1) {
        for (let i = 0; i < form.shape.length; i++) {
            if (form.shape[i].selected == true) {
                form.shape[i].x = mouseX;
                form.shape[i].y = mouseY;
            }
        }
    }
    if (!clickingOnExistingPoint(mouseX,mouseY,form.shape) && over == true) {
        try {
            if (dist(mouseX,mouseY,form.shape[form.shape.length-1].x,form.shape[form.shape.length-1].y) > dragInterval) {
                form.addPoint(mouseX,mouseY);
            }
        }
        catch (error) {
            console.log(`logged error: ${error}, probably because no points exist yet. Draw something!`)
        }
    }
}

function mouseReleased() {
    for (let i = 0; i < form.shape.length; i++) {
        if (form.shape[i].selected == true) {
            form.shape[i].selected = false;
        }
    }
}

function drawInnerShape(points,colorVal) {
    if (points.length > 2) {
        fill(colorVal);
        if (!fillmode) {
            noFill();
        }
        if (buffering) {
            buffer.beginShape();
            for (let i = 0; i < points.length; i++) {
                if (curvemode) {
                    buffer.curveVertex(points[i].x,points[i].y);
                } else {
                    buffer.vertex(points[i].x,points[i].y);
                }
            }
            buffer.endShape(CLOSE);
        }
        if (formBuffering) {
            shapebuffer.beginShape();
            for (let i = 0; i < points.length; i++) {
                if (curvemode) {
                    shapebuffer.curveVertex(points[i].x,points[i].y);
                } else {
                    shapebuffer.vertex(points[i].x,points[i].y);
                }
            }
            shapebuffer.endShape(CLOSE);
        }
        beginShape();
        for (let i = 0; i < points.length; i++) {
            if (curvemode) {
                curveVertex(points[i].x,points[i].y);
            } else {
                vertex(points[i].x,points[i].y);
            }
        }
        endShape(CLOSE);
    }
}

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