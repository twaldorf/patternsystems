//check if placed point is outside the canvas area and stop those points
//fix color flash bug when first drawing

var index = 0;
var pointRadius = 10;
var mode = 'curved';
// var scale = .1;
var primaryQueue = [];
var form;
var dragInterval = 110;


function setup() {
    createCanvas(innerWidth,500);
    form = new Form;
    primaryQueue.push(form);
    noLoop();
}

var colorway_temp = [50,255,1];
var $colorway = colorway_temp;

function draw() {
    background(0);
    drawCursor();
    drawButton(50,50);
    renderAll(primaryQueue);
}

function renderAll(queue) {
    queue.forEach(function(element) {
        element.render();
    });
}

// function newQueue(queue) {
//     for (let i = 0; i < queue.length; i++) {
        
//     }
// }

function mousePressed() {
    if (onButton(50,50)) {
      drawPattern(form.shape,15,$colorway);
    } else if (clickingOnExistingPoint(mouseX,mouseY,form.shape)) {
        let indexOfClosestPoint = findClosestPoint(mouseX,mouseY,form.shape);
        form.shape[indexOfClosestPoint].select();
    } else {
        feed = new Feedback(mouseX,mouseY,pointRadius);
        form.addPoint(mouseX,mouseY);
    };
    loop();
}

function mouseDragged() {
    for (let i = 0; i < form.shape.length; i++) {
        if (form.shape[i].selected == true) {
            form.shape[i].x = mouseX;
            form.shape[i].y = mouseY;
        }
    }
    if (!clickingOnExistingPoint(mouseX,mouseY,form.shape) && !onButton(50,50)) {
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

function drawButton(x,y) {
    noStroke();
    fill(150);
    rect(x-8,y-14,100,20);
    fill(255);
    text('pitter patternize',x,y);
}

function validateGridUnit(gridUnit) {
  if (gridUnit == 0) {
    gridUnit = getShapeHeight(form.shape);
  } else {
    return gridUnit;
  };
}
  
function getShapeHeight(shape) {
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

function getShapeWidth(shape) {
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

function getColor(colorway) {
  return lerp($colorway[0],$colorway[1],round(random(0,$colorway[2]))*(1/$colorway[2]));
}

function drawPattern(template,gridUnit,colorway) {
    if (form.shape.length > 1) {
        let copies=[];
        for (let i = 0; i < 1000; i++) {
            copies[i] = copyOf(form);
            copies[i].offset(
                random(- getShapeOrigin(form.shape).x, width - getShapeOrigin(form.shape).x) + 100,
                random(- getShapeOrigin(form.shape).y, width - getShapeOrigin(form.shape).y) - getShapeHeight(form.shape)
            );
            primaryQueue.push(copies[i]);
        }
        noLoop();
    } else {
        console.log('not enough vertices to draw a pattern!')
    }
    // let secondForm = Object.assign( Object.create( Object.getPrototypeOf(form)), form)
    // let secondForm = new Form;
    // secondForm.addPoint(300,300);
    // secondForm.addPoint(350,250);
    // secondForm.addPoint(370,200);
    // // secondForm.shape = JSON.parse(JSON.stringify(form.shape));
    // // secondForm.offset(200,200);
    // primaryQueue.push(secondForm);
}

function copyOf(formObj) {
    let temporaryCopy = new Form;
    for (let i = 0; i < formObj.shape.length; i++) {
        temporaryCopy.shape[i] = new Vertex;
        temporaryCopy.shape[i].x = formObj.shape[i].x;
        temporaryCopy.shape[i].y = formObj.shape[i].y;
    }
    console.log(temporaryCopy.shape[1].x)
    return temporaryCopy;
}

function drawCursor() {
  circle(mouseX,mouseY,pointRadius * 0.5);
};

function drawVertices(shape,color) {
    for (let i = 0; i < shape.length; i++) {
        fill(color);
        shape[i].render();
        feed.update();
        drawBorders(shape,255,i);
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
        fill(220);
        stroke(255);
        strokeWeight(1);
        beginShape();
        for (let i = 0; i < points.length; i++) {
            if (mode == 'curved') {
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
            //DIY sort for poor people without means of personal transporation or self expression
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
    };
    offset(xoffset,yoffset) {
        for (let i = 0; i < this.shape.length; i++) {
            this.shape[i].transform(xoffset,yoffset);
        }
    };
    render() {
        drawVertices(this.shape,255);
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
    render() {noStroke();circle(this.x,this.y,this.r);}
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
