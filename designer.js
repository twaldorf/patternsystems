function setup() {
  createCanvas(500, 500);
  noLoop();
  noStroke();
}

function draw() {
  background(color(250,250,0));
  for(let i = 0; i < 200; i++) {
    push();
    translate(round(random(-5,5))*60,round(random(-5,5))*60);
    splotch(width/2 - 10, height/2 - 10, round(random(0,15)), .80, color(255,random(0,200),random(0,255)));
    pop();
  }
  for(let i = 0; i < 10; i++) {
    push();
    translate(round(random(-5,5))*60,round(random(-5,5))*60);
    splotch(width/2 - 10, height/2 - 10, round(random(0,1)),.80,255);
    pop();
  }
  for(let i = 0; i < 10; i++) {
    push();
    translate(round(random(-5,5))*60,round(random(-5,5))*60);
    splotch(width/2 - 10, height/2 - 10, round(random(0,1)),.80,color(50,120,250));
    pop();
  }
  
}



function splotch(xcenter, ycenter, rows, scale, color) {
  rectMode(RADIUS);
  noStroke();
  fill(color);
  let r = 15 * scale;
  let d = 2 * r;
  let rowcount = 0; //count index
  let rowkey;
  let yrowcenter = ycenter + d * rowcount;

  rowkey = generateKey(rows); //2d array of row parameters explained below
  
  drawRows();
  
  function generateKey(length) {
    let array = [];
    for (let i = 0; i <= length; i++) {
      array[i] = [randomRoundNumber(),randomRoundNumber()];
    }
    return array;
    
  }

  function randomRoundNumber() {
    return round(random(0,3)) * 25 * scale;
  }
  
  function drawRows() {
    yrowcenter = ycenter + d * rowcount;
    fillRow();
    superGlue();
    rowcount++;
    if (rowcount < rows) {
      drawRows();
    }

    function superGlue() {
      if (rowEndsFurtherLeftThanCurrentRow(rowcount+1)) {
        glueDownLeft();
      } 

      if (rowEndsFurtherRightThanCurrentRow(rowcount+1)) {
        glueDownRight();
      } 

      if (rowEndsFurtherLeftThanCurrentRow(rowcount-1)) {
        glueUpLeft();
      } 

      if (rowEndsFurtherRightThanCurrentRow(rowcount-1)) {
        glueUpRight();
      } 

      if (rowLeftAlignsWithCurrentRow(rowcount-1)) {
        verticalGlueLeftDown(rowcount);
      }

      if (rowRightAlignsWithCurrentRow(rowcount-1)) {
        verticalGlueRightDown(rowcount);
      }
    }

    function rowLeftAlignsWithCurrentRow(n) {
      if (n < 0 || n > rows) {
        return false;
      } else if (getRowLeftX(n) == getRowLeftX(rowcount)) {
        return true;
      }
    }

    function rowRightAlignsWithCurrentRow(n) {
      if (n < 0 || n > rows) {
        return false;
      } else if (getRowRightX(n) == getRowRightX(rowcount)) {
        return true;
      }
    }

    function rowEndsFurtherLeftThanCurrentRow(n) {
      if (n < 0 || n > rows - 1) {
        return false;
      } else if ((getRowLeftX(n)) < getRowLeftX(rowcount) ) {
        return true;
      } else {
        return false;
      }
    }
    function rowEndsFurtherRightThanCurrentRow(n) {
      if (n < 0 || n > rows - 1) {
        return false;
      } else if ((getRowRightX(n))> getRowRightX(rowcount) ) {
        return true;
      } else {
        return false;
      }
    }

    function glueUpLeft() {
      glue(
        getRowLeftX(rowcount),
        yrowcenter - r,
        getRowLeftX(rowcount) - d,
        yrowcenter
      )
    }

    function glueUpRight() {
      glue(
        getRowRightX(rowcount),
        yrowcenter - r,
        getRowRightX(rowcount) + d,
        yrowcenter
      )
    }

    function glueDownRight() {
      glue(
        getRowRightX(rowcount),
        yrowcenter + r,
        getRowRightX(rowcount) + d,
        yrowcenter
      )
    }

    function glueDownLeft() {
      glue(
        getRowLeftX(rowcount),
        yrowcenter + r,
        getRowLeftX(rowcount) - d,
        yrowcenter
      )
    }

    function verticalGlueLeftDown(rowcount) {
      verticalGlue(getRowLeftX(rowcount),yrowcenter-r,r,r);
    }

    function verticalGlueRightDown(rowcount) {
      verticalGlue(getRowRightX(rowcount),yrowcenter-r,r,r);
    }
  }

  function fillRow() {
    fill(color)
    console.log(rowcount);
    rect(xcenter + rowkey[rowcount][1], yrowcenter, getRowWidth(rowcount), r)
    circle(getRowLeftX(rowcount), yrowcenter, d)
    circle(getRowRightX(rowcount), yrowcenter, d)
  }

  function getRowLeftX(n) {
    return xcenter - getRowWidth(n) + rowkey[n][1];
  }

  function getRowRightX(n) {
    return xcenter + getRowWidth(n) + rowkey[n][1];
  }

  function getRowWidth(n) {
    return rowkey[n][0];
  }

  function verticalGlue(x,y,r,d) {
    fill(color);
    rect(x,y,r,d);
  }

  function glue(xorigin, yorigin, xdiag, ydiag) {
    beginShape()

    let width = abs(xorigin - xdiag)
    let height = abs(yorigin - ydiag)
    let o = [xorigin, yorigin]
    let e = [xorigin, findTexE()]
    let c = midpoint(e[0], e[1], xdiag, ydiag)
    let a = [xdiag, yorigin]
    let b = midpoint(a[0], a[1], o[0], o[1])

    strokeWeight(5)
    point(o[0], o[1])
    point(e[0], e[1])
    point(c[0], c[1])
    point(a[0], a[1])
    point(b[0], b[1])

    vertex(e[0], e[1])
    vertex(o[0], o[1])
    vertex(b[0], b[1])
    vertex(a[0], a[1])
    vertex(c[0], c[1])

    beginContour()
    vertex(a[0], a[1])
    bezierVertex(
      a[0], a[1],
      b[0], b[1],
      c[0], c[1]
    )
    endContour()
    endShape()

    function findTexE() {
      if (yorigin < ydiag) {
        return yorigin + r;
      }
      else { return yorigin - r; }
    }
  }
}

function midpoint(x, y, x2, y2) {
  let midx = (x + x2) / 2;
  let midy = (y + y2) / 2;
  return [midx, midy];
}