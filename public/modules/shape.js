export class Shape {
    constructor(pointRadius,state,color=255) {
        this.points = [],
        this.pointRadius = pointRadius,
        this.color = color,
        this.state = state
    }

    offset(xoffset,yoffset) {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].transform(xoffset,yoffset);
        }
    }

    rotate(degrees) {
    }

    draw(buffer) {
        this.drawVertices(buffer,this.points)
        if (this.state.parameters.fill) {
            buffer.fill(this.color)
            this.drawFill(buffer,this.points,this.color);
        }
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

    drawVertices(buffer,points) {
        for (let i = 0; i < points.length; i++) {
            points[i].draw(buffer)
            if (this.state.parameters.stroke) {
                this.drawPolygonBorders(buffer,points,this.color,i)
            }
        }
    }

    drawPolygonBorders(buffer,points,color,i) {
        if (i > 0) {
            buffer.stroke(color);
            buffer.strokeWeight(this.state.parameters.strokeWeight)
            buffer.line(points[i].x,points[i].y,points[i-1].x,points[i-1].y);
        }
        if (points.length > 2) {
            buffer.line(points[points.length-1].x,points[points.length-1].y,points[0].x,points[0].y);
        }
    }

    drawFill(buffer,points,color) {
        if (points.length > 2) {
            buffer.fill(color)
            buffer.beginShape()
            points.map((point) => {
                if (this.state.parameters.round) {
                    buffer.curveVertex(point.x,point.y)
                } else {
                    buffer.vertex(point.x,point.y)
                }
            })
            if (this.state.parameters.round) {
                buffer.curveVertex(points[0].x,points[0].y)
                buffer.curveVertex(points[1].x,points[1].y)
            } else {
                buffer.vertex(points[0].x,points[0].y)
                buffer.vertex(points[1].x,points[1].y)
            }
            // wrap around the shape with an anchor [0] and a bezier [1]

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