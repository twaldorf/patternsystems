var index = 0;
var pointRadius = 10;
var points = [];

var $shape = points;
var colorwayGreen = [[0,0,255],[120,220,255],5];

function setup() {
    createCanvas(innerWidth,500);
  }
  
  function draw() {
    background(0);
    drawButton(50,50);
    makeShape();
  }

  function drawButton(x,y) {
    fill(150);
    rect(x-8,y-14,100,20);
    fill(255);
    text('pitter patternize',x ,y);
  }
  
function drawPattern($shape,gridUnit,colorway) {
  gridUnit = validateGridUnit(gridUnit);

  for(let i = 0; i < 50; i++) {
    push();
    translate(gridUnit,gridUnit);
    placeShape(0,0,$shape);
    pop();
  }
}

function validateGridUnit(gridUnit) {
  if (gridUnit == 0) {
    gridUnit = getShapeHeight() / 2;
  } else {
    return gridUnit;
  };
}
  
function placeShape(xcenter, ycenter, shape) {
  fill(getColor(colorwayGreen));
}

function getColor(colorway) {
  return lerp(colorway[0],colorway[1],
    round(
      10 / random(0,colorway[2]) 
    )
  );
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

    function drawInnerShape() {
        if (points.length > 2) {
            fill(120);
            noStroke();
            beginShape();
            for (let i = 0; i < points.length; i++) {
                vertex(points[i].x,points[i].y);
            }
            endShape();
        }
    }
}

function mousePressed() {
    if (dist(mouseX,mouseY,50,50) < 80) {
      drawPattern($shape,15,colorwayGreen);
    }
    feed = new Feedback(mouseX,mouseY,pointRadius);
    if (clickingOnExistingPoint(mouseX,mouseY,points) ) {
    } else {
        addPoint();
    }

    function clickingOnExistingPoint(x,y,points) {
        for (let i = 0; i < points.length; i++) {
            if (dist(x,y,points[i].x,points[i].y) < 40) {
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

class Feedback {
    constructor(x,y,r) {
        this.r = r;
        this.x = x;
        this.y = y;
        this.r = 0;
    }
    update() {
        console.log('feedback update call at '+ this.x + this.y + this.r);
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
