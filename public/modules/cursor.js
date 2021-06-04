export var selecting = false

export function draw(buffer, x, y) {
  // buffer.noStroke();
  // buffer.fill(255);
  // buffer.circle(x,y,3);
}

export function updateFeedback(x, y, r) {
  return new Feedback(x, y, r)
}

export class Feedback {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.radius = r;
  }

  draw(buffer) {
    if (this.r < this.radius * 4) {
      this.r += 10
      buffer.fill(255)
      buffer.circle(this.x, this.y, this.r)
      return true
    }
    return false
    // queue.splice(this index)
    // this could remove itself from the queue, might be a little weird to set up in the main draw fnc
  }
}

export function clickingOnExistingPoint(buffer, x, y, points, selectionRadius) {
  return points.some((point) => {
    const distance = buffer.dist(x, y, point.x, point.y)

    if (distance < selectionRadius) {
      return true
    } return false
  })
}
