//check if placed point is outside the canvas area and stop those points
//fix color flash bug when first drawing

var index = 0;
var pointRadius = 10;
// var points = [];
var mode = 'curved';
var scale = .1;

var $shape = [];

function setup() {
    createCanvas(innerWidth,500);
}

var colorway_temp = [50,255,1];
var $colorway = colorway_temp;

function draw() {
    background(0);
    drawButton(50,50);
    makeShape($shape);
}

function drawButton(x,y) {
    noStroke();
    fill(150);
    rect(x-8,y-14,100,20);
    fill(255);
    text('pitter patternize',x,y);
}

function drawPattern(shape,gridUnit,colorway) {
    gridUnit = validateGridUnit(gridUnit);
    for(let i = 0; i < 1000; i++) {
        push();
        let randomWidth = random(0 - getShapeWidth($shape), canvas.width);
        let randomHeight = random(0 - getShapeHeight($shape), canvas.height);
        translate(
            randomWidth,
            randomHeight);
        rotate(round((random()%2)) * PI);
        placeShape(0,0,shape);
        pop();
  }
}

function placeShape(xcenter, ycenter, shape) {
    fill(getColor($colorway));
    drawInnerShape(shape);
}

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

    function drawVertices(shape,color) {
        for (let i = 0; i < shape.length; i++) {
            fill(color);
            shape[i].render();
            feed.update();
            drawBorders(shape,255);

            function drawBorders(points,color) {
                if (i > 0) {
                    stroke(color);
                    strokeWeight(1);
                    line(points[i].x,points[i].y,points[i-1].x,points[i-1].y);
                }
                if (points.length > 2) {
                    line(points[points.length-1].x,points[points.length-1].y,points[0].x,points[0].y);
                }
            }
        };
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

// function getClosestPoint(x,y,shape) {
//     let lastDist;
//     let newDist;
//     for (let i = 0; i < shape.length; i++) {
//         if (dist(x,y,shape[i].x,shape[i].y) < dist(x,y,shape[i].x,shape[i].y)) {
//             return i;
//             newDist = dist(x,y,shape[i].x,shape[i].y);
//         };
//     };
// }

function findClosestPoint(x,y,shape) {
    let distances = [];
    for (let i = 0; i < shape.length; i++) {
        distances.push([dist(x,y,shape[i].x,shape[i].y),i]);
    }
    distances = sortByFirstColumn(distances,0);
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
    return distances[0][1];
}

function clickingOnExistingPoint(x,y,shape) {
    for (let i = 0; i < shape.length; i++) {
        if (dist(x,y,shape[i].x,shape[i].y) < pointRadius) {
            return true;
        };
    };
};

function mousePressed() {
    if (onButton(50,50)) {
      drawPattern($shape,15,$colorway);
    } else if (clickingOnExistingPoint(mouseX,mouseY,$shape)) {
        let indexOfClosestPoint = findClosestPoint(mouseX,mouseY,$shape);
        console.log(indexOfClosestPoint);
        $shape[indexOfClosestPoint].select();
    } else {
        feed = new Feedback(mouseX,mouseY,pointRadius);
        addPoint($shape);
    };
    function undoAddPoint() {
        points.pop();
    }
    loop();
}

function addPoint(points) {
    points[points.length] = new Vertex(mouseX,mouseY,pointRadius);
}

function mouseDragged() {
    for (let i = 0; i < $shape.length; i++) {
        if ($shape[i].selected == true) {
            $shape[i].x = mouseX;
            $shape[i].y = mouseY;
        }
    }
    if (!clickingOnExistingPoint(mouseX,mouseY,$shape)) {
        if (dist(mouseX,mouseY,$shape[$shape.length-1].x,$shape[$shape.length-1].y) > 30) {
            addPoint($shape);
        }
    }
}

function mouseReleased() {
    for (let i = 0; i < $shape.length; i++) {
        if ($shape[i].selected == true) {
            $shape[i].selected = false;
        }
    }
    noLoop();
}

function scaleShape(shape,scale) {
    for (let i = 0; i < shape.length; i++) {
        shape[i].x = shape[i].x * scale;
        shape[i].y = shape[i].y * scale;
    }
    return shape;
}

class Feedback {
    constructor(x,y,r) {
        this.r = r;
        this.x = x;
        this.y = y;
        this.r = 0;
    }
    update() {
        if (this.r < pointRadius*10) {
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
