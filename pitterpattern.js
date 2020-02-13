var index = 0;
var pointRadius = 10;
var curvemode = false;
// var scale = .1; not used yet
var primaryQueue = [];
var form;
var dragInterval = 50;
var gridUnit = 50;
var borderMode = true;
var vertexMode = false;
var fillmode = false;
var lock = false;

var cnv;
var over;

var vertexcounter;
var formheight;
var formwidth;
var formXorigin;
var formYorigin;
var currenttime;
var inittime;
var colorInput1;
var colorInput2;

var buttons;

var fullDate = new Date();
var minutesDate;
var secondsDate;
var hoursDate;
var dateCurrent;
var newHoursDate;
var newMinutesDate;
var newSecondsDate;
var colorway;

var offsetMatrix;
var offsetXIndex = 0;
var offsetYIndex = 0;

var numberOfRows;
var numberOfColumns;

var buttonExport;

var buffer;
var shapebuffer;
var bufferform;
var buffering = false;
var formBuffering = false;

function setup() {
    noLoop();
    cnv = createCanvas(document.getElementById('console-label').offsetWidth - 36,innerHeight*.665);
    buffer = createGraphics(cnv.width,cnv.height);
    cnv.parent('sketch-holder');
    form = new Form;
    primaryQueue.push(form);
    initializeNewInterfaceElements();
    colorway = [90,210];
}

function draw() {
    if (buffering) {buffer.background('#181818');};
    if (formBuffering) {shapebuffer.background('#181818');}
    background('#181818');
    drawCursor();
    pullInputValues();
    renderAll(primaryQueue);
    checkMouseOverCanvas(cnv);
    checkButtons();
    updateTimePanel();
}

function renderAll(queue) {
    lock = true;
    queue.forEach(function(element) {
        element.updateColor(colorway);
        element.render();
    });
    updateShapeStatistics();
    lock = false;
}

function mousePressed() {
    if (clickingOnExistingPoint(mouseX,mouseY,form.shape)) {
        let indexOfClosestPoint = findClosestPoint(mouseX,mouseY,form.shape);
        form.shape[indexOfClosestPoint].select();
    } else if (over == true) {
        feed = new Feedback(mouseX,mouseY,pointRadius);
        form.addPoint(mouseX,mouseY);
    };
    loop();
}

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
    noLoop();
}

function validateGridUnit(unit) {
    if (unit == 0) {
        return getShapeHeight(form.shape);
    } else {
        return gridUnit;
    };
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

function getShapeOrigin(shape) {
let firstMidpoint = getMidpointFromVertices(shape[0],shape[1]);
    let secondMidpoint = getMidpointFromVertices(shape[2],shape[3]);
    let thirdMidpoint = getMidpointFromVertices(firstMidpoint,secondMidpoint);
    return thirdMidpoint;
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

function drawPattern(shape,numberOfRows,numberOfColumns) {
    if (!buffering) {
        numberOfRows = round(cnv.height / gridUnit) + 1;
        numberOfColumns = round(cnv.width / gridUnit) + 1;
        offsetMatrix = populateOffsetTargetMatrix(numberOfRows,numberOfColumns);
    }
    let averageX = getAverageXFromShape(shape);
    let averageY = getAverageYFromShape(shape);
    console.log(averageX,averageY);
    if (shape.length > 2) {
        let copies=[];
        let i = 0;
        for (let rowIndex = 0; rowIndex < numberOfRows - 1; rowIndex++) {
            for (let colIndex = 0; colIndex < numberOfColumns - 1; colIndex++) {
                copies[i] = copyOf(shape);
                copies[i].offset(
                    getPatternXOffset(rowIndex,colIndex,averageX) + 50,
                    getPatternYOffset(rowIndex,colIndex,averageY) - 50);
                copies[i].regenColorCoinToss();
                primaryQueue.push(copies[i]);
                i++;
            }
        }
        primaryQueue.shift();
        noLoop();
    } else {
        console.log('not enough vertices to draw a pattern!')
    }
}

function populateOffsetTargetMatrix(numberOfRows,numberOfColumns) {
    let tempoffsetMatrix = [];
    // numberOfRows *= 1.2
    // numberOfColumns *= 1.2
    for (let rowNumber = 1; rowNumber < numberOfRows; rowNumber++) {
        tempoffsetMatrix.push(genColumnArray(numberOfColumns,rowNumber));
    }
    return tempoffsetMatrix;
}

function genColumnArray(numberOfColumns,rowNumber) {
    let array = [];
    for (let column = 0; column < numberOfColumns; column++) {
        array.push(
            [gridUnit * column, gridUnit * rowNumber]
            );
    }
    return array;
}

function getPatternXOffset(rowIndex,colIndex,averageX) {
    return offsetMatrix[rowIndex][colIndex][0] - averageX;
};

function getPatternYOffset(rowIndex,colIndex,averageY) {
    return offsetMatrix[rowIndex][colIndex][1] - averageY;
};

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

function roundToGridUnit(x, gridsize) {
    return Math.ceil(x / gridsize) * gridsize;
};

function copyOf(shape) {
    let temporaryCopy = new Form;
    for (let i = 0; i < shape.length; i++) {
        temporaryCopy.shape[i] = new Vertex;
        temporaryCopy.shape[i].x = shape[i].x;
        temporaryCopy.shape[i].y = shape[i].y;
    }
    return temporaryCopy;
}

function drawCursor() {
  circle(mouseX,mouseY,pointRadius * 0.5);
};

function drawVertices(shape,color,bordermode) {
    for (let i = 0; i < shape.length; i++) {
        fill(color);
        if (!vertexMode) {
            shape[i].render();
        }
        feed.update();
        if (bordermode) {
            drawBorders(shape,255,i);
        }
    };
}

function drawBorders(points,color,i) {
    if (i > 0) {
        stroke(color);
        strokeWeight(borderSize);
        line(points[i].x,points[i].y,points[i-1].x,points[i-1].y);
    }
    if (points.length > 2) {
        line(points[points.length-1].x,points[points.length-1].y,points[0].x,points[0].y);
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

function findClosestPoint(x,y,shape) {
    let distances = [];
    for (let i = 0; i < shape.length; i++) {
        distances.push([dist(x,y,shape[i].x,shape[i].y),i]);
    }
    distances = sortByFirstColumn(distances,0);
    return distances[0][1];
}

function sortByFirstColumn(array) {
    for (let i = 0; i < array.length; i++) {
        for (let i = 0; i < array.length-1; i++) {
            if (array[i][0] > array[i+1][0]) {
                let temp = array[i];
                array[i] = array[i+1];
                array[i+1] = temp;
            }
        }
    }
    return array;
}

function clickingOnExistingPoint(x,y,shape) {
    for (let i = 0; i < shape.length; i++) {
        if (dist(x,y,shape[i].x,shape[i].y) < pointRadius) {
            return true;
        };
    };
};

//not exposed
function scaleShape(shape,scale) {
    for (let i = 0; i < shape.length; i++) {
        shape[i].x *= scale;
        shape[i].y *= scale;
    }
    return shape;
}

class Form {
    constructor() {
        this.shape = [];
        this.color = color;
        this.oneOrZero = round(100%random());
    };
    offset(xoffset,yoffset) {
        for (let i = 0; i < this.shape.length; i++) {
            this.shape[i].transform(xoffset,yoffset);
        }
    };
    rotate(degrees) {
    }
    regenColorCoinToss() {
        this.oneOrZero = round(100%random());
    }
    updateColor(colorway) {
        this.color = colorway[this.oneOrZero];
    }
    render() {
        drawVertices(this.shape,255,borderMode);
        drawInnerShape(this.shape,this.color);
    };
    addPoint(x,y) {
        this.shape[this.shape.length] = new Vertex(x,y,pointRadius);
    };
    rmPoint(x,y) {
        let point = [x,y];
        for (let i = 0; i < this.shape.length; i++) {
            if (point == this.shape[i]) {
                this.shape.splice(i,1);
            }
        }
    }
}

class Feedback {
    constructor(x,y,r) {
        this.r = r;
        this.x = x;
        this.y = y;
        this.r = 0;
    }
    update() {
        if (this.r < pointRadius*5) {
            this.r+=20;
            fill(255);
            circle(this.x,this.y,this.r);
        }
    }
}
class Vertex {
    constructor(x,y,r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.selected = false;
}
    render() {
        noStroke();circle(this.x,this.y,this.r);}
    select() {
        this.selected = true;
    }
    x() {return this.x}
    y() {return this.y}
    transform(xoffset,yoffset) {
        this.x = this.x + xoffset;
        this.y = this.y + yoffset;
    }
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

function updateTimePanel() {
    let tempdate = new Date();
    newHoursDate = tempdate.getHours();
    newMinutesDate = tempdate.getMinutes();
    newSecondsDate = tempdate.getSeconds();
    currenttime.innerHTML = newHoursDate + 'HR ' + newMinutesDate + 'M ' + newSecondsDate + 'S';
}

function checkMouseOverCanvas(canvas) {
    canvas.mouseOver(() => {over = true});
    canvas.mouseOut(() => {over = false});
}

function initializeNewInterfaceElements() {
    sliderStroke = createSlider(1,10,0,1);
    buttonPattern = createButton('Bake layout');
    buttonReset = createButton('Reset layout');
    buttonResetForm = createButton('Reset shape');

    sliderStroke.elt.classList.add('slider-input');

    sliderStroke.parent('stroke-slider');
    buttonPattern.parent('main-control-bar');
    buttonReset.parent('main-control-bar');
    buttonResetForm.parent('main-control-bar');

    minutesDate = fullDate.getMinutes();
    secondsDate = fullDate.getSeconds();
    hoursDate = fullDate.getHours();
    date.innerHTML = hoursDate + 'HR ' + minutesDate + 'M ' + secondsDate + 'S';
}

document.addEventListener("DOMContentLoaded", function() {
    colorInput1 = document.getElementById('color-input-1');
    colorInput2 = document.getElementById('color-input-2');
    slider = document.getElementById('grid-slider');
    gridUnitValue = document.getElementById('gridunit-value');
    borderSlider = document.getElementById('border-slider');
    borderSizeValue = document.getElementById('bordersize-value');
    vertexcounter = document.getElementById('vertex-counter');
    formheight = document.getElementById('form-height');
    formwidth = document.getElementById('form-width');
    formXorigin = document.getElementById('form-X-origin');
    formYorigin = document.getElementById('form-Y-origin');
    currenttime = document.getElementById('current-date');
    buttonExport = document.getElementById('button-export');
    date = document.getElementById('date');
    headerTitle = document.getElementById('header');
    buttonFillToggle = document.getElementById('fill-toggle');
    buttonBorderToggle = document.getElementById('border-toggle');
    buttonCurveToggle = document.getElementById('curve-toggle');
    buttons = document.querySelectorAll('button');
    buttons.forEach(function(e) {
        if (e.classList.contains('toggle')) {
            e.addEventListener('click', () => {
                updateButtonState(e)
            });
        }
    });
    buttonFillToggle.addEventListener('click', () => {
        toggleFill();
    });
    buttonBorderToggle.addEventListener('click', () => {
        toggleBorder();
    });
    buttonCurveToggle.addEventListener('click', () => {
        toggleCurve();
    });
    buttonExport.addEventListener('click', () => {
        exportPattern();
    });
    buttonExport.addEventListener('click', () => {
        editHeader();
    });
});

function editHeader() {
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

function updateButtonState(e) {
    if (e.className.includes('on')) {
        console.log('was active');
        e.classList.remove('on');
        e.classList.add('off');
        e.innerHTML = 'INACTIVE <span>ENABLE</span>';
    }
    else {
        console.log('was inactive');
        e.classList.remove('off');
        e.classList.add('on');
        e.innerHTML = 'ACTIVE <span>DISABLE</span>';
    };
}

function updateShapeStatistics() {
    vertexcounter.innerHTML = form.shape.length;
    if (form.shape.length > 10) {
        vertexcounter.innerHTML = form.shape.length + ' (WARN) ';
        vertexcounter.classList.add('warn');
    }
    if (form.shape.length < 10) {
        vertexcounter.classList.remove('warn');
    }
    if (form.shape.length > 0) {
        formheight.innerHTML = round(getShapeHeight(form.shape));
        formwidth.innerHTML = round(getShapeWidth(form.shape));
    }
    // if (form.shape.length > 3) {
    //     formXorigin.innerHTML = round(form.shape[0].x);
    //     formYorigin.innerHTML = round(form.shape[0].y);
    // }
}

function exportPattern() {
    buffering = true;
    console.log(buffering);
    let exportscalex = document.getElementById('export-scale-x').value;
    let exportscaley = document.getElementById('export-scale-y').value;
    buffer = createGraphics(exportscalex * cnv.width, exportscaley * cnv.height);
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