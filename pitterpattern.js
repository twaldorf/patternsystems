var index = 0;
var pointRadius = 10;
var curvemode = true;
// var scale = .1; not used yet
var primaryQueue = [];
var form;
var dragInterval = 50;
var gridUnit = 5;
var borderMode = true;
var vertexMode = false;
var fillmode = false;

var cnv;
var over;

var vertexcounter;
var formheight;
var formwidth;
var formXorigin;
var formYorigin;
var currenttime;
var inittime;

var fullDate = new Date();
var minutesDate;
var secondsDate;
var hoursDate;
var dateCurrent;
var newHoursDate;
var newMinutesDate;
var newSecondsDate;


function setup() {
    cnv = createCanvas(document.getElementById('console-label').offsetWidth - 36,innerHeight*.665);
    form = new Form;
    primaryQueue.push(form);

    slider = createSlider(1,100,10,1);
    sliderStroke = createSlider(1,100,10,1);
    buttonPattern = createButton('Patternize');
    buttonReset = createButton('Reset pattern');
    buttonResetForm = createButton('Reset form');

    sliderStroke.elt.classList.add('slider-input');
    slider.elt.classList.add('slider-input');

    buttonFillToggle = createButton('Active / Disable');
    buttonFillToggle.elt.classList.add('toggle');
    buttonBorderToggle = createButton('Active / Disable');
    buttonBorderToggle.elt.classList.add('toggle');
    buttonCurveToggle = createButton('Active / Disable');
    buttonCurveToggle.elt.classList.add('toggle');

    slider.parent('console-layout');
    sliderStroke.parent('stroke-slider');
    buttonPattern.parent('main-control-bar');
    buttonReset.parent('main-control-bar');
    buttonResetForm.parent('main-control-bar');
    buttonFillToggle.parent('fill-toggle')
    buttonBorderToggle.parent('border-toggle')
    buttonCurveToggle.parent('curve-toggle')

    cnv.parent('sketch-holder');
    minutesDate = fullDate.getMinutes();
    secondsDate = fullDate.getSeconds();
    hoursDate = fullDate.getHours();
    date.innerHTML = hoursDate + 'HR ' + minutesDate + 'M ' + secondsDate + 'S';
    noLoop();
}

var colorway_temp = [20,200];
var $colorway = colorway_temp;

function draw() {
    background('#181818');
    drawCursor();
    gridUnit = slider.elt.value; //perfnote: send to event-based
    renderAll(primaryQueue);
    cnv.mouseOver(() => {over = true});
    cnv.mouseOut(() => {over = false});
    buttonPattern.mousePressed(() => {
        gridUnit = validateGridUnit(gridUnit);
        drawPattern(form.shape,gridUnit);
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
    buttonFillToggle.mousePressed(() => {
        if (fillmode) {fillmode = false} else {fillmode=true};
    })
    buttonBorderToggle.mousePressed(() => {
        if (borderMode) {borderMode = false} else {borderMode=true};
    })
    buttonCurveToggle.mousePressed(() => {
        if (curvemode) {curvemode = false} else {curvemode=true};
    })
    let tempdate = new Date();
    newHoursDate = tempdate.getHours();
    newMinutesDate = tempdate.getMinutes();
    newSecondsDate = tempdate.getSeconds();
    currenttime.innerHTML = newHoursDate + 'HR ' + newMinutesDate + 'M ' + newSecondsDate + 'S';
}

function renderAll(queue) {
    queue.forEach(function(element) {
        fill(element.updateColor($colorway));
        element.render();
    });
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
    if (form.shape.length > 3) {
        formXorigin.innerHTML = round(form.shape[0].x);
        formYorigin.innerHTML = round(form.shape[0].y);
    }
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
    if (!clickingOnExistingPoint(mouseX,mouseY,form.shape) && !onButton(50,50) && over == true) {
        if (dist(mouseX,mouseY,form.shape[form.shape.length-1].x,form.shape[form.shape.length-1].y) > dragInterval) {
            form.addPoint(mouseX,mouseY);
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
    if (unit < getShapeHeight(form.shape) / 2 || unit < getShapeWidth(form.shape)/2 ) {
        return getShapeHeight(form.shape) / 2;
    }
    else if (unit == 0) {
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

function drawPattern(template,unit) {
    console.log('drawing!');
    if (template.length > 3) {
        let copies=[];
        for (let i = 0; i < 1000; i++) {
            copies[i] = copyOf(form);
            copies[i].offset(
                getPatternXOffset(unit),
                getPatternYOffset(unit)
            );
            primaryQueue.push(copies[i]);
        }
        noLoop();
    } else {
        console.log('not enough vertices to draw a pattern!')
    }
}

function getPatternXOffset(gridsize) {
    return roundToGridUnit(random(- getShapeOrigin(form.shape).x, canvas.width - getShapeOrigin(form.shape).x), gridsize);
};

function getPatternYOffset(gridsize) {
    return roundToGridUnit(random(- getShapeOrigin(form.shape).y, canvas.height - getShapeOrigin(form.shape).y) - getShapeHeight(form.shape), gridsize);
};

function roundToGridUnit(x, gridsize) {
    return Math.ceil(x / gridsize) * gridsize;
};

function copyOf(formObj) {
    let temporaryCopy = new Form;
    for (let i = 0; i < formObj.shape.length; i++) {
        temporaryCopy.shape[i] = new Vertex;
        temporaryCopy.shape[i].x = formObj.shape[i].x;
        temporaryCopy.shape[i].y = formObj.shape[i].y;
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
        strokeWeight(1);
        line(points[i].x,points[i].y,points[i-1].x,points[i-1].y);
    }
    if (points.length > 2) {
        line(points[points.length-1].x,points[points.length-1].y,points[0].x,points[0].y);
    }
}

function drawInnerShape(points) {
    if (points.length > 2) {
        // noStroke();
        if (!fillmode) {
            noFill();
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

function onButton(x,y) {
    if (dist(mouseX,mouseY,x,y) < 120) {
        return true;
    } else {
        return false;
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
    };
    offset(xoffset,yoffset) {
        for (let i = 0; i < this.shape.length; i++) {
            this.shape[i].transform(xoffset,yoffset);
        }
    };
    updateColor(colorway) {
        this.color = colorway[round(100%random())];
        return this.color;
    }
    render() {
        drawVertices(this.shape,255,borderMode);
        drawInnerShape(this.shape);
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
        this.x += xoffset;
        this.y += yoffset;
    }
}


document.addEventListener("DOMContentLoaded", function() {
    vertexcounter = document.getElementById('vertex-counter');
    formheight = document.getElementById('form-height');
    formwidth = document.getElementById('form-width');
    formXorigin = document.getElementById('form-X-origin');
    formYorigin = document.getElementById('form-Y-origin');
    currenttime = document.getElementById('current-date');
    date = document.getElementById('date');
});

var localStorageSpace = function(){
    var allStrings = '';
    for(var key in window.localStorage){
        if(window.localStorage.hasOwnProperty(key)){
            allStrings += window.localStorage[key];
        }
    }
    return allStrings ? 3 + ((allStrings.length*16)/(8*1024)) + ' KB' : 'Empty (0 KB)';
};

//dom werk
// document.addEventListener('readystatechange', function(element) {
//     element.emit('ready');
// })

// let slider = document.getElementById('slider1');
// slider.addEventListener('input', function(element) {
//     dragInterval = parseInt(element.value);
// });