let paretLinePoints = [];
let crowdedPoints = [];

export function paretovka() {
  let points = [];

  generatePoints(points);

  setInterval(function() {
    findParetLine(points);
    drawGraph(points, paretLinePoints);

    //odstraneni nalezench bodu z vygenerovanych bodů.
    points = points.filter(function(el) {
      return paretLinePoints.indexOf(el) < 0;
    });

    //Crowded Distance
    crowdDistanceHandle(paretLinePoints);

    console.log(crowdedPoints);
  }, 1500);
}

function crowdDistanceHandle(paretLinePoints) {
  let biggestPoint = getBiggestPoint(paretLinePoints);
  let smallestPoint = getSmallestPoint(paretLinePoints);

  //predchozi, nasledujici

  paretLinePoints.forEach(currentPoint => {
    let beforePoint = getBeforePoint(paretLinePoints, currentPoint);
    let afterPoint = getAfterPoint(paretLinePoints, currentPoint);

    let distanceFromBiggest = getDistance(currentPoint, biggestPoint);
    let distanceFromSmallest = getDistance(currentPoint, smallestPoint);
    let distanceFromBefore = getDistance(currentPoint, beforePoint);
    let distanceFromAfter = getDistance(currentPoint, afterPoint);

    let C =
      (distanceFromBefore - distanceFromAfter) /
      (distanceFromBiggest - distanceFromSmallest);

    currentPoint.C = C;

    addPointToSortedArray(currentPoint);
  });
}

function getDistance(point1, point2) {
  let x = Math.abs(point1.x - point2.x);
  let y = Math.abs(point1.y - point2.y);

  return Math.sqrt(x * x + y * y);
}

function addPointToSortedArray(point) {
  let inserted = false;

  if (crowdedPoints.length == 0) {
    crowdedPoints.push(point);
    return;
  }

  for (let i = 0; i < crowdedPoints.length; i++) {
    if (point.C < crowdedPoints[i].C) {
      crowdedPoints.splice(i, 0, point);

      inserted = true;

      break;
    }
  }

  if (inserted == false) {
    crowdedPoints.splice(0, 0, point);
  }
}

//ano beforePoint, nevim jak se to jmenuje a nejsem na netu.. sedim ve vlaku.
function getBeforePoint(paretLinePoints, currentPoint) {
  let beforePoint = paretLinePoints[0];

  paretLinePoints.forEach(element => {
    if (element.x < currentPoint.x && element.x > beforePoint.x) {
      beforePoint = element;
    }
  });

  return beforePoint;
}

function getAfterPoint(paretLinePoints, currentPoint) {
  let afterPoint = paretLinePoints[0];

  paretLinePoints.forEach(element => {
    if (element.x > currentPoint.x && element.x < afterPoint.x) {
      afterPoint = element;
    }
  });

  return afterPoint;
}

function getBiggestPoint(paretLinePoints) {
  let biggestPoint = paretLinePoints[0];

  paretLinePoints.forEach(element => {
    if (element.y > biggestPoint.y) {
      biggestPoint = element;
    }
  });

  return biggestPoint;
}

function getSmallestPoint(paretLinePoints) {
  let smallestPoint = paretLinePoints[0];

  paretLinePoints.forEach(element => {
    if (element.y < smallestPoint.y) {
      smallestPoint = element;
    }
  });

  return smallestPoint;
}

function findParetLine(points) {
  paretLinePoints = [];

  points.forEach(point => {
    let found = false;

    points.forEach(point2 => {
      if (point2.x < point.x && point2.y < point.y) {
        found = true;
      }
    });

    if (found == false) {
      paretLinePoints.push(point);
    }
  });
}

function generatePoints(points) {
  for (let i = 0; i < 400; i++) {
    let r = 50 * Math.sqrt(Math.random() * 1);
    let theta = Math.random() * 1 * 2 * Math.PI;

    points.push({
      x: 50 + r * Math.cos(theta),
      y: 50 + r * Math.sin(theta),
      index: i,
      C: 0
    });
  }
}

function drawGraph(points, paretLinePoints) {
  var pointsGraph = {
    x: [],
    y: [],
    mode: "markers",
    type: "scatter"
  };

  var paretPointsGraph = {
    x: [],
    y: [],
    mode: "markers",
    type: "scatter"
  };

  points.forEach(point => {
    pointsGraph.x.push(point.x);
    pointsGraph.y.push(point.y);
  });

  paretLinePoints.forEach(point => {
    paretPointsGraph.x.push(point.x);
    paretPointsGraph.y.push(point.y);
  });

  let data = [];

  data.push(pointsGraph, paretPointsGraph);

  Plotly.newPlot("myDiv", data);
}

function isPointDominatingAndSetValue(paretLinePoints, point) {
  let found = false;

  for (let i = 0; i < paretLinePoints.length; i++) {
    let tmpPoint = paretLinePoints[i];

    if (point.x < tmpPoint.x && point.y < tmpPoint.y) {
      if ((found = false)) {
        paretLinePoints[i] = point;

        found = true;
      }
    }
  }

  return found;
}
