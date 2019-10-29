function setup() {
  createCanvas(500, 500);
  noLoop()
}

function draw() {
  background(0);
  // for(let i = 0; i < 200; i++) {
  //   push();
  //   translate(random(-200,400),random(-200,400))
  //   splotch(0,0,12,5,0.25,random(0,255))
  //   pop();
  // }
  splotch(250, 150, 8, 1, 255)
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

    function randomRoundNumber() {
      return round(random(1,5)) * 25;
    }
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
    }

    function rowLeftAlignsWithCurrentRow(n) {
      if (n < 0 || n > rowcount) {
        return false;
      } else if (getRowLeftX(n) == getRowLeftX(rowcount)) {
        verticalGlueDown(rowcount,n);
      }
    }

    function rowEndsFurtherLeftThanCurrentRow(n) {
      if (n < 0) {
        return false;
      } else if ((getRowLeftX(n)) < getRowLeftX(rowcount) ) {
        return true;
      } else {
        return false;
      }
    }
    function rowEndsFurtherRightThanCurrentRow(n) {
      if (n < 0) {
        return false;
      } else if ((getRowRightX(n)) > getRowRightX(rowcount) ) {
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

    function glueUpToBiggerRow() {
      glue(
        getRowLeftX(rowcount),
        yrowcenter - r,
        getRowLeftX(rowcount) - d,
        yrowcenter
      )
      glue(
        getRowRightX(rowcount),
        yrowcenter - r,
        getRowRightX(rowcount) + d,
        yrowcenter
      )
      fill(color);
    }

    function glueDownToBiggerRow() {
      glue(
        getRowLeftX(rowcount),
        yrowcenter + r,
        getRowLeftX(rowcount) - d,
        yrowcenter
      )
      glue(
        getRowRightX(rowcount),
        yrowcenter + r,
        getRowRightX(rowcount) + d,
        yrowcenter
      )
      fill(color);
    }
    fill(color);
  }

  function lastRowBigger() {
    if (rowcount == 0) {
      return false;
    }
    if (getRowWidth(rowcount - 1) > getRowWidth(rowcount)) {
      console.log('the last row was wider than the current row');
      return true;
    } else {
      console.log('the last row was not wider than the current row');
      return false;
    }
  }

  function nextRowBigger() {
    console.log('nextRowBigger() says: rowcount = ' + rowcount + ' and rows = ' + rows)
    if (rowcount == rows || rowcount > rows) {
      return false;
    } else if (getRowWidth(rowcount + 1) > getRowWidth(rowcount)) {
      return true;
    } else {
      return false;
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