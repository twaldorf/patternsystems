export function draw(buffer,x,y) {
    // buffer.noStroke();
    // buffer.fill(255);
    // buffer.circle(x,y,3);
}

export function updateFeedback(x,y) {
    return new Feedback(x,y,20)
}

export class Feedback {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.r = 0;
    }
    draw(buffer) {
        if (this.r < 20 * 2) {
            this.r += 10
            buffer.fill(255)
            buffer.circle(this.x,this.y,this.r)
            console.log('Feedback.draw()')
            return true
        } else {
            return false
            // queue.splice(this index)
            // this could remove itself from the queue, might be a little weird to set up in the main draw fnc
        }
    }
}

export function clickingOnExistingPoint(x,y,shape) {
    for (let i = 0; i < shape.length; i++) {
        if (dist(x,y,shape[i].x,shape[i].y) < pointRadius) {
            return true;
        };
    };
};