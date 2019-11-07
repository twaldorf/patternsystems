//check if placed point is outside the canvas area and stop those points
//fix color flash bug when first drawing

var index = 0;
var pointRadius = 10;
var points = [];
var mode = 'curved';
var scale = 1;

var $shape = points;

function setup() {
    createCanvas(innerWidth,500);
}

var colorway_temp = [50,255,1];
var $colorway = colorway_temp;

function draw() {
    background(0);
    drawButton(50,50);
    makeShape();
}

function drawButton(x,y) {
    noStroke();
    fill(150);
    rect(x-8,y-14,100,20);
    fill(255);
    text('pitter patternize',x,y);
}

function drawPattern($shape,gridUnit,colorway) {
    gridUnit = validateGridUnit(gridUnit);
    for(let i = 0; i < 1000; i++) {
        push();
        let randomWidth = random(0 - getShapeWidth($shape), canvas.width);
        let randomHeight = random(0 - getShapeHeight($shape), canvas.height);
        translate(
            randomWidth,
            randomHeight);
        rotate(round((random()%2)) * PI);
        placeShape(0,0,$shape);
        pop();
  }
}

function placeShape(xcenter, ycenter, shape) {
    fill(getColor($colorway));
    drawInnerShape();
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

function makeShape() {
    drawCursor();
    drawInnerShape();
    drawVertices(255);

    function drawVertices(color) {
        for (let i = 0; i < points.length; i++) {
            fill(color);
            points[i].render();
            feed.update();
            drawBorders(255);

            function drawBorders(color) {
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

function drawInnerShape() {
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

function mousePressed() {
    if (onButton(50,50)) {
      drawPattern($shape,15,$colorway);
    } else {
        feed = new Feedback(mouseX,mouseY,pointRadius);
        if (clickingOnExistingPoint(mouseX,mouseY,points) ) {
        } else {
            addPoint();
        }
    
        function clickingOnExistingPoint(x,y,points) {
            for (let i = 0; i < points.length; i++) {
                if (dist(x,y,points[i].x,points[i].y) < pointRadius) {
                    points[i].select();
                    return true;
                };
            };
        };
    
        function addPoint() {
            points[points.length] = new Vertex(mouseX,mouseY,pointRadius);
        }
        function undoAddPoint() {
            points.pop();
        }
        loop();
    }
}

function mouseDragged() {
    for (let i = 0; i < points.length; i++) {
        if (points[i].selected == true) {
            points[i].x = mouseX;
            points[i].y = mouseY;
        }
    }
}

function mouseReleased() {
    for (let i = 0; i < points.length; i++) {
        points[i].selected = false;
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
    constructor(x,y,r,selected) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.selected = false;
}
    render() {noStroke();circle(this.x,this.y,this.r);}
    select() {
        this.x = mouseX;
        this.y = mouseY;
        this.render();
        this.selected = true;
    }
    x() {return this.x}
    y() {return this.y}
}
