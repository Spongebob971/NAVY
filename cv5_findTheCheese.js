let map = [];
let Q = [];
let graphDatas = [];
let redPointsGraph = [];
let bluePointsGraph = [];
let yellowPointsGraph = [];
let greenPointsGraph = [];
let newPointToMove = { x: 0, y: 0 };

export function cv5FindTheCheese() {
  //vygenerovani matic
  generateMap();
  generateAgentMemory();

  drawGraph();

  doTheWork();
}

function doTheWork() {
  //asi training???
  for (let x = 0; x < 20; x++) {
    let startingRow = 0; // row 0 je coord 0,0 kdyby row = 7 tak coord je 1, 2

    for (let i = 0; i < 250; i++) {
      startingRow = recalucalateQMatrix(startingRow);
      if (startingRow == 18) {
        // 18 protoze na pozici 18 se v matici nachazi syr.
        i = 99999;
      }

      //animate() se muze odkomentovat pro zobrazeni mysi jak běhá při učení, jinak je defaultně funkce animate jak až když je to dobře naučené.
      //mys zelena, syr zluta, prekazka cervena, modra je cesta.
      //animate();
    }
  }

  //výpis naučené Q matice po 20 iteracích nalezení sýra
  console.log(Q);

  // nalezení sýra pomocí naučené matice
  findCheese();
}

function findCheese() {
  //using learned matrix Q to find a cheese.(Konecne to funguje haha).

  let startingRow = 0;

  for (let i = 0; i < 20; i++) {
    //ziskani nejlepsi hodoty z Q matice
    let ret = getMaximumOfRow(startingRow);

    startingRow = ret.y;

    let pointInMatrix = convertToMatrix(ret);

    newPointToMove = pointInMatrix;

    animate();
  }
}

function convertToMatrix(row) {
  let pointInMatrix = {
    x: Math.floor(row.y / 5),
    y: row.y % 5
  };

  return pointInMatrix;
}

function getMaximumOfRow(actualRow) {
  let maximum = -999;
  let chosenQ = {
    x: 0,
    y: 0,
    value: 0
  };

  for (let i = 0; i < 25; i++) {
    if (i == actualRow) {
    } else if (Q[actualRow][i] > maximum) {
      maximum = Q[actualRow][i];

      let tmp = {
        x: actualRow,
        y: i,
        value: Q[actualRow][i]
      };

      chosenQ = tmp;
    }
  }

  console.log(chosenQ);

  return chosenQ;
}

function recalucalateQMatrix(actualPosX) {
  let possiblePaths = getPossiblePaths(actualPosX);

  let selectedPath = selectPathFromPossiblePaths(
    possiblePaths,
    possiblePaths.length
  );

  //nalezeni nejvetsiho Q atributu v radku
  let chosenQ = getMaximumOfQ(selectedPath);

  //update Q atributu
  Q[selectedPath.x][selectedPath.y] = selectedPath.value + 0.5 * chosenQ.value;

  newPointToMove = {
    x: Math.floor(selectedPath.y / 5),
    y: selectedPath.y % 5
  };

  return selectedPath.y;
}

function getMaximumOfQ(selectedPath) {
  let temporaryPossiblePaths = getPossiblePaths(selectedPath.y);

  let Qs = [];

  temporaryPossiblePaths.forEach(element => {
    let tmp = {
      x: element.x,
      y: element.y,
      value: Q[element.x][element.y]
    };

    Qs.push(tmp);
  });

  let maxValue = -1;
  let chosenQ = 0;

  Qs.forEach(element => {
    if (element.value > maxValue) {
      chosenQ = element;
      maxValue = element.value;
    }
  });

  return chosenQ;
}

function selectPathFromPossiblePaths(possiblePaths, size) {
  let selectedPath = Math.floor(Math.random() * size);

  return possiblePaths[selectedPath];
}

function getPossiblePaths(actualPosX) {
  let possiblePaths = [];

  for (let i = 0; i < 25; i++) {
    if (map[actualPosX][i] != -1) {
      let tmp = {
        x: actualPosX,
        y: i,
        value: map[actualPosX][i]
      };

      possiblePaths.push(tmp);
    }
  }

  return possiblePaths;
}

function generateAgentMemory() {
  Q = new Array(25);
  for (let i = 0; i < 25; i++) {
    Q[i] = new Array(25);
    for (let j = 0; j < 25; j++) {
      Q[i][j] = 0;
    }
  }
}

function animate() {
  // Tady to je jen pro vykreslovani animace

  let datas = [];

  greenPointsGraph = [];

  greenPointsGraph = {
    x: [newPointToMove.x],
    y: [newPointToMove.y],
    mode: "markers",
    marker: {
      color: "rgb(5, 255, 5)",
      size: 15
    }
  };

  datas.push(
    redPointsGraph,
    bluePointsGraph,
    yellowPointsGraph,
    greenPointsGraph
  );

  Plotly.animate(
    "myDiv",
    {
      data: datas
    },
    {
      transition: {
        duration: 500,
        easing: "cubic-in-out"
      },
      frame: {
        duration: 500,
        redraw: false
      }
    }
  );
}

function drawGraph() {
  // tady to je rovnez jen pro vykreslovani

  redPointsGraph = {
    x: [],
    y: [],
    mode: "markers",
    marker: {
      color: "rgb(255, 5, 5)",
      size: 15
    }
  };
  bluePointsGraph = {
    x: [],
    y: [],
    mode: "markers",
    marker: {
      color: "rgb(5, 5, 255)",
      size: 15
    }
  };
  yellowPointsGraph = {
    x: [],
    y: [],
    mode: "markers",
    marker: {
      color: "rgb(255, 255, 5)",
      size: 15
    }
  };
  greenPointsGraph = {
    x: [1],
    y: [1],
    mode: "markers",
    marker: {
      color: "rgb(5, 255, 5)",
      size: 15
    }
  };

  let matrix = [
    [0, 0, 0, 0, 0],
    [0, -1, 0, 0, 0],
    [0, 0, 0, -1, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0]
  ];

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (matrix[i][j] == -1) {
        redPointsGraph.x.push(i);
        redPointsGraph.y.push(j);
      }
      if (matrix[i][j] == 0) {
        bluePointsGraph.x.push(i);
        bluePointsGraph.y.push(j);
      }
      if (matrix[i][j] == 1) {
        yellowPointsGraph.x.push(i);
        yellowPointsGraph.y.push(j);
      }
    }
  }

  greenPointsGraph.x.push(0);
  greenPointsGraph.y.push(0);

  let graphDatas = [];

  graphDatas.push(
    redPointsGraph,
    bluePointsGraph,
    yellowPointsGraph,
    greenPointsGraph
  );

  Plotly.newPlot("myDiv", graphDatas);
}

function generateMap() {
  map = [
    [
      -1,
      0,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1
    ],
    [
      0,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1
    ],
    [
      -1,
      0,
      -1,
      0,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1
    ],
    [
      -1,
      -1,
      0,
      -1,
      0,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1
    ],
    [
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1
    ],
    /////////////////////
    [
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1
    ],
    /*prek*/ [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1
    ],
    [
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1
    ],
    [
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      0,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1
    ],
    [
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1
    ],
    /////////////////////
    [
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1
    ],
    [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      0,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1
    ],
    [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1
    ],
    [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1
    ],
    [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1
    ],
    ///////////
    [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1
    ],
    [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      0,
      -1,
      0,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1
    ],
    [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      0,
      -1,
      100,
      -1,
      -1,
      -1,
      0,
      -1,
      -1
    ],
    [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      100,
      0,
      -1,
      -1,
      -1,
      0,
      -1
    ],
    [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      100,
      -1,
      -1,
      -1,
      -1,
      -1,
      0
    ],
    ///////////
    [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1
    ],
    [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      0,
      -1,
      0,
      -1,
      -1
    ],
    [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      0,
      -1,
      0,
      -1
    ],
    [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      100,
      1,
      -1,
      -1,
      0,
      -1,
      0
    ],
    [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      0,
      -1
    ]
  ];
}
