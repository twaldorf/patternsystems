export class Shape {
    constructor(buffer) {
        this.points = [];
        this.pointRadius = 15;
    }

    offset(xoffset,yoffset) {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].transform(xoffset,yoffset);
        }
    }

    rotate(degrees) {
    }

    draw(buffer) {
        buffer.clear()
        this.drawVertices(buffer,this.points,255,0)
        // this.drawInnerpoints(buffer,this.points,this.color);
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

    drawVertices(buffer,points,color,bordermode) {
        for (let i = 0; i < points.length; i++) {
            buffer.fill(color)
            points[i].draw(buffer)
            this.drawBorders(buffer,points,255,i);
        };
    }

    drawBorders(buffer,points,color,i) {
        if (i > 0) {
            buffer.stroke(color);
            buffer.strokeWeight(1);
            buffer.line(points[i].x,points[i].y,points[i-1].x,points[i-1].y);
        }
        if (points.length > 2) {
            buffer.line(points[points.length-1].x,points[points.length-1].y,points[0].x,points[0].y);
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