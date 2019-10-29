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
  let rowkey = []; //2d array of row parameters explained below
  let yrowcenter = ycenter + d * rowcount;
  let index = 0;
  
  generateKey();

  function generateKey() {
    if (rowkey.length == rows) {
      return;
    } else {
      rowkey[index] = [round(random(1, 100)), round(random(-50, 50))];
      if (uniqueRow()) {
        index++;
        generateKey();
      } else {
        generateKey();
      }
    }
    function uniqueRow() {
      for (let i = 0; i < rowkey.length; i++) {
        return rowkey[index] == rowkey[i];
      }
    }
  } 
  //rowkey[[width coefficient, xoffset value]] where rowkey.length = number of rows (such as this.rows)
  //this could be improved by checking the last row and ensuring that the next row is not disconnected, using a bounding box dif coef perhaps
  drawRows();

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

    function lastRowEclipses() {
      if (lastRowBigger() && rowEndsFurtherLeftThanCurrentRow(rowcount - 1) && rowEndsFurtherRightThanCurrentRow(rowcount - 1)) {
        return true;
      }
    }

    function nextRowEclipses() {
      if (nextRowBigger() && rowEndsFurtherLeftThanCurrentRow(rowcount + 1) && rowEndsFurtherRightThanCurrentRow(rowcount + 1)) {
        return true;
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

    // refactored
    // if (nextRowBigger()) {
    //   fill(0, 0, 255)
    //   glue(
    //     getRowRightX(rowcount),
    //     yrowcenter + r,
    //     getRowRightX(rowcount) + d,
    //     yrowcenter
    //   )
    //   glue(
    //     getRowLeftX(rowcount),
    //     yrowcenter + r,
    //     getRowLeftX(rowcount) - d,
    //     yrowcenter
    //   )
    // }
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

    //debug points
    // stroke(0, 150, 0);
    // strokeWeight(10);
    // point(getRowRightX(), yrowcenter);
    // noStroke();

    // stroke(0, 0, 200);
    // strokeWeight(10);
    // point(getRowLeftX(), yrowcenter);
    // noStroke();
  }

  function getPrevRowWidth() {
    if (rowcount != 0) {
      return rowkey[rowcount - 1][0];
    }
  }

  function getNextRowWidth() {
    if (rowcount + 1 < rows) {
      return rowkey[rowcount + 1][0];
    }
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
    // stroke(120,120,10)
    point(o[0], o[1])
    // stroke(50,220,200)
    point(e[0], e[1])
    point(c[0], c[1])
    // stroke(120,220,110)
    point(a[0], a[1])
    // stroke(10,20,200)
    point(b[0], b[1])
    // noStroke()

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