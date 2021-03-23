export class Shape {
    constructor(pointRadius,state) {
        this.points = [],
        this.pointRadius = pointRadius,
        this.color = '#ffffff',
        this.parameters = state.parameters,
        this.counter = 0
    }

    updateParameters(state) {
        this.parameters = state.parameters
    }

    offset(xoffset,yoffset) {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].transform(xoffset,yoffset);
        }
    }

    rotate(degrees) {
    }

    draw(buffer, colorInput=this.color) {
        //todo: validate color
        const color = colorInput.includes('#') ? colorInput : `#${colorInput}`

        if (!this.parameters.tiling) {
            this.drawVertices(buffer,this.points)
        }
        if (this.parameters.stroke) {
            this.drawPolygonBorders(
                buffer,
                this.points,
                buffer.color(color))
        }
        if (this.parameters.fill) {
            buffer.fill(buffer.color(color))
            this.drawFill(
                buffer,
                this.points,
                buffer.color(color)
            );
        }
    }

    drawShapeAt(buffer, points, x,y) {
        let normals = this.normalize(points)
        buffer.translate(x,y)
        this.drawVertices(buffer,normals)
        if (this.parameters.fill) {
            buffer.fill(buffer.color(this.parameters.colorArray[0]))
            this.drawFill(
                buffer,
                normals,
                buffer.color(this.parameters.colorArray[0])
            );
        }
    }

    getWidth(pointsArray=this.points) {
        const left = this.leastmost(pointsArray,'x')
        const right = this.foremost(pointsArray,'x')
        return right - left
    }

    getHeight(pointsArray=this.points) {
        const top = this.leastmost(pointsArray,'y')
        const bottom = this.foremost(pointsArray,'y')
        return bottom - top
    }

    normalize(points=this.points) {
        const left = this.leastmost(points,'x')
        const top = this.leastmost(points,'y')

        const normals = points.map((point) => {
            const newPointX = point.x - left
            const newPointY = point.y - top
            const newPoint = new Vertex(newPointX, newPointY, this.pointRadius)
            return newPoint
        })

        return normals
    }

    leastmost(points=this.points, type='x') {
        const edge = points.reduce((prev,curr,index,array) => {
            return array[index][type] < prev ? array[index][type] : prev
        }, points[0][type])

        return edge
    }

    foremost(points=this.points, type='x') {
        const edge = points.reduce((prev,curr,index,array) => {
            return array[index][type] > prev ? array[index][type] : prev
        }, points[0][type])

        return edge
    }

    getXOffset(points=this.points) {
        return this.leastmost(points,'x')
    }

    getYOffset(points=this.points) {
        return this.leastmost(points,'y')
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
        }
    }

    pasteVertices(buffers) {
        buffer.image()
    }

    drawPolygonBorders(buffer,points,color,i) {
        for (let i = 0; i < points.length; i++) {
            if (i > 0) {
                buffer.stroke(color);
                buffer.strokeWeight(this.parameters.strokeWeight)
                buffer.line(points[i].x,points[i].y,points[i-1].x,points[i-1].y);
            }
            if (points.length > 2) {
                buffer.line(points[points.length-1].x,points[points.length-1].y,points[0].x,points[0].y);
            }
        }
    }

    drawFill(buffer,points,color) {
        if (points.length > 2) {
            buffer.fill(color)
            buffer.beginShape()
            points.map((point) => {
                if (this.parameters.round) {
                    buffer.curveVertex(point.x,point.y)
                } else {
                    buffer.vertex(point.x,point.y)
                }
            })
            if (this.parameters.round) {
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