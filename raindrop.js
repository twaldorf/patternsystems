function setup() {
  createCanvas(innerWidth,500)
  noLoop()
}

function draw() {
  background(random(100,150),random(100,150),random(100,150))
  stroke(random(0,100),random(0,100),0)
  strokeWeight(4)
  let interval = 140;
  for (let y = 0; y + 1.2 < height/interval; y++) {
       for (let x = 1; (x + 25) < width/10; x++) {
         let lineheight = interval * 4/5
         let gap = lineheight/4
         if(x % 2) {
           y1 = (lineheight / 2 + gap) 
             + y * interval 
             + random(1,40)
           
           y2 = (lineheight / 2) 
             + y * interval + lineheight 
             + random(1,40)
         } else {
           y1 = y * interval + gap / 2 
             + random(1,40)
           
           y2 = y * interval + lineheight - gap / 2 
             + random(1,40)
         }
         line(
               x * 20,
                y1,
               x * 20,
               y2
           )
       }
  }
//second horizontal lines
//   stroke(random(1,255))
//   strokeWeight(4)
//   for (let y = 0; y + 1.2 < height/interval; y++) {
//        for (let x = 1; (x + 25) < width/10; x++) {
//          let lineheight = interval * 4/5
//          let gap = lineheight/4
//          if(x % 2) {
//            y1 = (lineheight / 2 + gap) 
//              + y * interval 
//              + random(1,40)
           
//            y2 = (lineheight / 2) 
//              + y * interval + lineheight 
//              + random(1,40)
//          } else {
//            y1 = y * interval + gap / 2 
//              + random(1,40)
           
//            y2 = y * interval + lineheight - gap / 2 
//              + random(1,40)
//          }
//          line(
//                y1,
//                x * 20,
//                y2,
//                x * 20
//            )
//        }
//   }
}