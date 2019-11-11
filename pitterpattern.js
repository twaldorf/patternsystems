//check if placed point is outside the canvas area and stop those points
//fix color flash bug when first drawing

var index = 0;
var pointRadius = 10;
var mode = 'curved';
var $shape = [];
// var scale = .1;
var primaryQueue = [];
var form;


function setup() {
    createCanvas(innerWidth,500);
    form = new Form;
}

var colorway_temp = [50,255,1];
var $colorway = colorway_temp;

function draw() {
    background(0);
    drawButton(50,50);
    renderQueue(primaryQueue);
}

function renderQueue(queue=[]) {
    queue.forEach(element => {
        element.render();
    });
}

// function patternize(shape) {
//     for (let i = 0; i < 1000; i++) {
//         let offsetX = random(0, canvas.width);
//         let offsetY = (0, canvas.height);
//         let rotation = round((random()%2)) * PI;
//         let camoShape = patternizeShapeArray(shape,offsetX,offsetY,rotation);
//         drawInnerShape(camoShape);
//     }
// }

// function patternizeShapeArray(shape,offsetX,offsetY,rotation) {
//     for (let i = 0; i < shape.length; i++) {
//         shape[i][0] = shape[i][0] + offsetX;
//         shape[i][1] = shape[i][1] + offsetY;
//     }
//     return shape;
// }

// function drawPattern(shape,gridUnit,colorway) {
//     gridUnit = validateGridUnit(gridUnit);
//     for(let i = 0; i < 1000; i++) {
//         push();
//         let randomWidth = random(0, canvas.width);
//         let randomHeight = random(0, canvas.height);
//         translate(
//             randomWidth,
//             randomHeight);
//         rotate(round((random()%2)) * PI);
//         placeShape(shape);
//         pop();
//   }
// }

function mousePressed() {
    if (onButton(50,50)) {
      drawPattern(form.shape,15,$colorway);
    // patternize($shape);
    } else if (clickingOnExistingPoint(mouseX,mouseY,form.shape)) {
        let indexOfClosestPoint = findClosestPoint(mouseX,mouseY,form.shape);
        form.shape[indexOfClosestPoint].select();
    } else {
        feed = new Feedback(mouseX,mouseY,pointRadius);
        form.addPoint(mouseX,mouseY);
        console.log(form);
        primaryQueue.push(form);
    };
    loop();
}

function addPoint(points) {
    points[points.length] = new Vertex(mouseX,mouseY,pointRadius);
}
function undoAddPoint(array) {
    array.pop();
}

function mouseDragged() {
    for (let i = 0; i < form.shape.length; i++) {
        if (form.shape[i].selected == true) {
            form.shape[i].x = mouseX;
            form.shape[i].y = mouseY;
        }
    }
    if (!clickingOnExistingPoint(mouseX,mouseY,form.shape) && !onButton(50,50)) {
        if (dist(mouseX,mouseY,form.shape[form.shape.length-1].x,form.shape[form.shape.length-1].y) > 30) {
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

// function placeShape(shape) {
//     fill(getColor($colorway));
//     drawInnerShape(shape);
// }

function validateGridUnit(gridUnit) {
  if (gridUnit == 0) {
    gridUnit = getShapeHeight($shape);
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
    let origin = [getShapeWidth(shape),getShapeHeight(shape)];
    return origin;
}

function getColor(colorway) {
  return lerp($colorway[0],$colorway[1],round(random(0,$colorway[2]))*(1/$colorway[2]));
}

function drawCursor() {
  circle(mouseX,mouseY,pointRadius * 0.5);
};

function makeShape(shape) {
    drawCursor();
    drawInnerShape(shape);
    drawVertices(shape,255);
}

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
        fill(getColor($colorway));
        noStroke();
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
    if (dist(mouseX,mouseY,x,y) < 80) {
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
        this.shape=[];
    }
    offset(x,y) {
        for (let i = 0; i < this.shape.length; i++) {
            this.shape[i][0] += x;
            this.shape[i][1] += y;
        }
    }
    render() {
        console.log('rendnering' + this);
        drawVertices(this.shape,$colorway);
        drawInnerShape(this.shape);
    }
    addPoint(x,y) {
        this.shape[this.shape.length] = new Vertex(mouseX,mouseY,pointRadius);
    }
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
}
