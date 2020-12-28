export function findClosestPoint(buffer,x,y,points) {
    let distances = points.map((point) => {
        let distance = buffer.dist(x,y,point.x,point.y)
        return distance
    })
    
    let shortestDistance = distances.reduce((currentValue, accumulator) => {
        let comparison = accumulator - currentValue > 0 ? currentValue : accumulator
        return comparison
    })

    let index = distances.map((value,index) => {
        if (value == shortestDistance) {
            console.log(index)
            return index
        } else return false
    }).filter((item) => {
        if (typeof(item) == 'number') {
            return true
        }
        return false
    })
    
    return index
}

function getXDistFromZero(shape) {
    let lowestNum = cnv.width;
    for (let i = 0; i < shape.length; i++) {
        (shape[i].x < lowestNum) ? lowestNum = shape[i].x : lowestNum = lowestNum;
    }
    return lowestNum;
}

function getYDistFromZero(shape) {
    let lowestNum = cnv.height;
    for (let i = 0; i < shape.length; i++) {
        (lowestNum > shape[i].y) ? lowestNum = shape[i].y : lowestNum = lowestNum;
    }
    return lowestNum;
}

function copyOf(shape) {
    let temporaryCopy = new Form;
    for (let i = 0; i < shape.length; i++) {
        temporaryCopy.shape[i] = new Vertex;
        temporaryCopy.shape[i].x = shape[i].x;
        temporaryCopy.shape[i].y = shape[i].y;
    }
    return temporaryCopy;
}

function getMidpointFromVertices(vertex1,vertex2) {
    let x1 = vertex1.x;
    let x2 = vertex2.x;
    let y1 = vertex1.y;
    let y2 = vertex2.y;
    let midx = (x1 + x2) / 2;
    let midy = (y1 + y2) / 2;
    let midpoint = new Vertex;
    midpoint.x = midx;
    midpoint.y = midy;
    return midpoint;
}

function getShapeOrigin(shape) {
    let firstMidpoint = getMidpointFromVertices(shape[0],shape[1]);
        let secondMidpoint = getMidpointFromVertices(shape[2],shape[3]);
        let thirdMidpoint = getMidpointFromVertices(firstMidpoint,secondMidpoint);
        return thirdMidpoint;
    }

function getShapeWidth(shape) {
    let minx = shape[0].x;
    let maxx = shape[0].x;
    for (let i = 0; i < shape.length; i++) {
        if (shape[i].x < minx) {
            minx = shape[i].x;
        }
    }
    for (let i = 0; i < shape.length; i++) {
        if (shape[i].x > maxx) {
            maxx = shape[i].x;
        }
    }
    return maxx - minx;
}

function getShapeHeight(shape) {
    let miny = shape[0].y;
    let maxy = shape[0].y;
    for (let i = 0; i < shape.length; i++) {
        if (shape[i].y < miny) {
            miny = shape[i].y;
        }
    }
    for (let i = 0; i < shape.length; i++) {
        if (shape[i].x > maxy) {
            maxy = shape[i].y;
        }
    }
    return maxy - miny;
}

function getAverageXFromShape(shape) {
    let tempavgX = 0;
    for (let i = 0; i < shape.length; i++) {
        tempavgX = tempavgX + shape[i].x;
    };
    return tempavgX / shape.length;
}

function getAverageYFromShape(shape) {
    let tempavgY = 0;
    for (let i = 0; i < shape.length; i++) {
        tempavgY = tempavgY + shape[i].y;
    };
    return tempavgY / shape.length;
}

function pullInputValues() {
    gridUnit = slider.value;
    gridUnitValue.innerHTML = gridUnit;
    borderSize = sliderStroke.elt.value;
    borderSizeValue.innerHTML = borderSize;
    if (colorInput1.value != null && colorInput2.value != null) {
        colorway[0] = '#' + colorInput1.value;
        colorway[1] = '#' + colorInput2.value;
    }
}

function checkButtons() {
    buttonPattern.mousePressed(() => {
        gridUnit = validateGridUnit(gridUnit);
        if (!lock) {
            drawPattern(form.shape,numberOfRows,numberOfColumns);
        }
    });
    buttonReset.mousePressed(() => {
        primaryQueue = [];
        primaryQueue.push(form);
    })
    buttonResetForm.mousePressed(() => {
        primaryQueue = [];
        form.shape = [];
        primaryQueue.push(form);
    })
}

export function inCanvas(baseCanvas, x, y) {
    return (x >= 0 && x <= baseCanvas.width && y >= 0 && y <= baseCanvas.height) ? true : false
}

// export {dist,findClosestPoint,inCanvas}