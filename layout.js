function drawPattern(shape,numberOfRows,numberOfColumns) {
    if (!buffering) {
        numberOfRows = round(cnv.height / gridUnit) + 1;
        numberOfColumns = round(cnv.width / gridUnit) + 1;
        offsetMatrix = populateOffsetTargetMatrix(numberOfRows,numberOfColumns);
    }
    let averageX = getAverageXFromShape(shape);
    let averageY = getAverageYFromShape(shape);
    console.log(averageX,averageY);
    if (shape.length > 2) {
        let copies=[];
        let i = 0;
        for (let rowIndex = 0; rowIndex < numberOfRows - 1; rowIndex++) {
            for (let colIndex = 0; colIndex < numberOfColumns - 1; colIndex++) {
                copies[i] = copyOf(shape);
                copies[i].offset(
                    getPatternXOffset(rowIndex,colIndex,averageX) + 50,
                    getPatternYOffset(rowIndex,colIndex,averageY) - 50);
                copies[i].regenColorCoinToss();
                primaryQueue.push(copies[i]);
                i++;
            }
        }
        primaryQueue.shift();
        noLoop();
    } else {
        console.log('not enough vertices to draw a pattern!')
    }
}

function populateOffsetTargetMatrix(numberOfRows,numberOfColumns) {
    let tempoffsetMatrix = [];
    // numberOfRows *= 1.2
    // numberOfColumns *= 1.2
    for (let rowNumber = 1; rowNumber < numberOfRows; rowNumber++) {
        tempoffsetMatrix.push(genColumnArray(numberOfColumns,rowNumber));
    }
    return tempoffsetMatrix;
}

function genColumnArray(numberOfColumns,rowNumber) {
    let array = [];
    for (let column = 0; column < numberOfColumns; column++) {
        array.push(
            [gridUnit * column, gridUnit * rowNumber]
            );
    }
    return array;
}

function getPatternXOffset(rowIndex,colIndex,averageX) {
    return offsetMatrix[rowIndex][colIndex][0] - averageX;
};

function getPatternYOffset(rowIndex,colIndex,averageY) {
    return offsetMatrix[rowIndex][colIndex][1] - averageY;
};

function validateGridUnit(unit) {
    if (unit == 0) {
        return getShapeHeight(form.shape);
    } else {
        return gridUnit;
    };
}

function roundToGridUnit(x, gridsize) {
    return Math.ceil(x / gridsize) * gridsize;
};