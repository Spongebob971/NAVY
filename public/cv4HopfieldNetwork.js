let pattern1 = [
  [-1, 1, 1, 1, -1],
  [-1, 1, -1, 1, -1],
  [-1, 1, 1, 1, -1],
  [-1, 1, -1, 1, -1],
  [-1, 1, 1, 1, -1]
];

let pattern2 = [
  [-1, 1, 1, 1, -1],
  [-1, -1, -1, 1, -1],
  [-1, 1, 1, 1, -1],
  [-1, 1, -1, -1, -1],
  [-1, 1, 1, 1, -1]
];

let pattern3 = [
  [1, -1, -1, -1, 1],
  [-1, 1, -1, 1, -1],
  [-1, -1, 1, -1, -1],
  [-1, 1, -1, 1, -1],
  [1, -1, -1, -1, 1]
];

let destroyedPattern1 = [
  [1, 1, 1, 1, -1],
  [-1, 1, -1, 1, -1],
  [-1, 1, 1, 1, 1],
  [-1, 1, -1, -1, -1],
  [1, 1, 1, 1, -1]
];

export function cv4HopfieldNetwork() {
  //prevedeni matice do vektoru
  let vector1 = createVectorFromMatrix(pattern1);
  let vector2 = createVectorFromMatrix(pattern2);
  let vector3 = createVectorFromMatrix(pattern3);

  //vytvoreni weightedMatrix
  let weightedMatrix1 = createWeightedMatrix(vector1);
  let weightedMatrix2 = createWeightedMatrix(vector2);
  let weightedMatrix3 = createWeightedMatrix(vector3);

  //nastaveni hodnot na 0 na diagonale
  putZerosToDiagonal(weightedMatrix1);
  putZerosToDiagonal(weightedMatrix2);
  putZerosToDiagonal(weightedMatrix3);

  let weightedMatrices = [];

  weightedMatrices.push(weightedMatrix1);
  weightedMatrices.push(weightedMatrix2);
  weightedMatrices.push(weightedMatrix3);

  //sum of all weightedMatrices
  let weightedMatrix = getMatricesSum(weightedMatrices);

  ///////asynchronous recover method

  // matice recoverTo, je pattern do ktereho to chci opravit, recoverFrom je matice ktera je deformovana
  let recoverTo1 = createVectorFromMatrix(pattern1);
  let recoverTo2 = createVectorFromMatrix(pattern2);
  let recoverTo3 = createVectorFromMatrix(pattern3);

  let recoverFrom = createVectorFromMatrix(destroyedPattern1);

  let chooseMethod = 2;

  switch (chooseMethod) {
    case 1:
      asynchronousRecover(weightedMatrix, recoverFrom);
      break;
    case 2:
      synchronousRecover(weightedMatrix, recoverFrom);
      break;
  }
}

function synchronousRecover(weightedMatrix, recoverFrom) {
  let ret = [];

  for (let i = 0; i < 25; i++) {
    ret.push(0);
  }

  for (let i = 0; i < 25; i++) {
    for (let k = 0; k < 25; k++) {
      let tmp = 0;

      for (let m = 0; m < 25; m++) {
        tmp += weightedMatrix[k][i] * recoverFrom[k];
      }

      ret[i][k] = tmp;
    }
  }

  for (let i = 0; i < ret.length; i++) {
    ret[i] = Math.sign(ret[i]);
  }

  let resultMatrix = convertVectorToMatrix(ret);
  let resultMatrix2 = convertVectorToMatrix(recoverFrom);

  drawGraph(resultMatrix, resultMatrix2);

  console.log(ret);
}

function getMatricesSum(matrices) {
  const ret = [];

  console.log(matrices);

  console.log(ret);

  for (let i = 0; i < 25; i++) {
    ret.push([]);
    for (let j = 0; j < 25; j++) {
      ret[i].push(matrices.reduce((prev, curr) => prev + curr[i][j], 0));
    }
  }

  for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 25; j++) {
      ret[i][j] = Math.sign(ret[i][j]);
    }
  }

  return ret;
}

function asynchronousRecover(weightedMatrix, recoverTo, recoverFrom) {
  let recoverFromOriginal = [];

  recoverFrom.forEach(element => {
    recoverFromOriginal.push(element);
  });

  for (let i = 0; i < recoverTo.length; i++) {
    if (recoverTo[i] != recoverFrom[i]) {
      let columnVector = getColumnAsVector(weightedMatrix, i);

      let skalar = 0;

      for (let index = 0; index < columnVector.length; index++) {
        skalar += columnVector[index] * recoverFrom[index];
      }
      let x_r = Math.sign(skalar);

      recoverFrom[i] = x_r;
    }
  }

  for (let i = 0; i < recoverFrom.length; i++) {
    let columnVector = getColumnAsVector(weightedMatrix, i);

    let skalar = 0;

    for (let index = 0; index < columnVector.length; index++) {
      skalar += columnVector[index] * recoverFrom[index];
    }
    let x_r = Math.sign(skalar);

    recoverFrom[i] = x_r;
  }

  console.log(recoverFrom);

  // graficky ukazka

  let resultMatrix = convertVectorToMatrix(recoverFrom);
  let resultMatrix2 = convertVectorToMatrix(recoverFromOriginal);

  drawGraph(resultMatrix, resultMatrix2);
}

function getColumnAsVector(matrix, column) {
  let vector = [];

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (j == column) {
        vector.push(matrix[i][j]);
      }
    }
  }
  return vector;
}

function createWeightedMatrix(vector) {
  var transposeMatrix = [];

  for (var i = 0; i < vector.length; i++) {
    transposeMatrix.push([]);
  }

  for (var i = 0; i < vector.length; i++) {
    for (var j = 0; j < vector.length; j++) {
      transposeMatrix[j].push(vector[i] * vector[j]);
    }
  }

  return transposeMatrix;
}

function putZerosToDiagonal(matrix) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (i == j) matrix[i][j] = 0;
    }
  }
}

function convertVectorToMatrix(vector) {
  let matrixSize = Math.sqrt(vector.length);

  let matrix = [];

  for (let i = 0; i < matrixSize; i++) {
    matrix.push([]);
  }

  for (let i = 0; i < vector.length; i++) {
    let row = Math.floor(i / matrixSize);
    let column = i % matrixSize;

    matrix[row][column] = vector[i];
  }

  return matrix;
}

function createVectorFromMatrix(pattern) {
  let columnVector = [];

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      columnVector.push(pattern[i][j]);
    }
  }

  return columnVector;
}

function drawGraph(matrix1, matrix2) {
  let redPointsGraph = {
    x: [],
    y: [],
    mode: "markers",
    marker: {
      color: "rgb(255, 5, 5)",
      size: 25
    },
    name: "recoveredTo"
  };

  let bluePointsGraph = {
    x: [],
    y: [],
    mode: "markers",
    marker: {
      color: "rgb(5, 5, 255)",
      size: 10
    },
    name: "map"
  };

  let purplePointsGraph = {
    x: [],
    y: [],
    mode: "markers",
    marker: {
      color: "rgb(255, 255, 5)",
      size: 25
    },
    name: "recoveredFrom"
  };

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (matrix1[i][j] == 1) {
        redPointsGraph.x.push(j);
        redPointsGraph.y.push(i);
      } else {
        bluePointsGraph.x.push(j);
        bluePointsGraph.y.push(i);
      }

      if (matrix2[i][j] == 1) {
        purplePointsGraph.x.push(j + 0.5);
        purplePointsGraph.y.push(i);
      } else {
        bluePointsGraph.x.push(j);
        bluePointsGraph.y.push(i);
      }
    }
  }

  let data = [];

  data.push(redPointsGraph, bluePointsGraph, purplePointsGraph);

  Plotly.newPlot("myDiv", data);
}
