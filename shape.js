export class Shape {
    constructor(pointRadius,color=255) {
        this.points = [];
        this.pointRadius = pointRadius;
        this.color = color;
    }

    offset(xoffset,yoffset) {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].transform(xoffset,yoffset);
        }
    }

    rotate(degrees) {
    }

    draw(buffer) {
        this.drawVertices(buffer,this.points,false)
        buffer.fill(this.color)
        this.drawFill(buffer,this.points,this.color);
    }

    addPoint(x,y) {
        this.points = [...this.points, new Vertex(x,y,this.pointRadius)]
    }

    rmPoint(x,y) {
        let point = [x,y];
        for (let i = 0; i < this.points.length; i++) {
            if (point == this.points[i]) {
                this.points.splice(i,1);
            }
        }
    }

    drawVertices(buffer,points,bordermode=true) {
        for (let i = 0; i < points.length; i++) {
            points[i].draw(buffer)
            this.drawPolygonBorders(buffer,points,this.color,i)
        }
    }

    drawPolygonBorders(buffer,points,color,i) {
        if (i > 0) {
            buffer.stroke(color);
            buffer.strokeWeight(1);
            buffer.line(points[i].x,points[i].y,points[i-1].x,points[i-1].y);
        }
        if (points.length > 2) {
            buffer.line(points[points.length-1].x,points[points.length-1].y,points[0].x,points[0].y);
        }
    }

    drawFill(buffer,points,color,roundCorners=true) {
        if (points.length > 2) {
            buffer.fill(color)
            buffer.beginShape()

            // start with a first point to provide closed shape (CLOSE is broken in instanced mode or something)

            points.map((point) => {
                if (roundCorners) {
                    buffer.curveVertex(point.x,point.y)
                } else {
                    buffer.vertex(point.x,point.y)
                }
            })

            // wrap around the shape with an anchor [0] and a bezier [1]
            buffer.curveVertex(points[0].x,points[0].y)
            buffer.curveVertex(points[1].x,points[1].y)

            buffer.endShape(buffer.CLOSE)
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
    draw(buffer) {
        buffer.noStroke()
        buffer.circle(this.x,this.y,this.r)
    }
    x(int) {this.x = int;return this.x}
    y(int) {this.y = int;return this.y}
    transform(xoffset,yoffset) {
        this.x = this.x + xoffset;
        this.y = this.y + yoffset;
    }
}