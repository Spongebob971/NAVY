let weights_origin = [];
let pointsGreen = [];
let pointsBlue = [];
let pointsRed = [];

export function perceptron() {
  //weights
  weights_origin.push(Math.random() * 1);
  weights_origin.push(Math.random() * 2 - 1);
  weights_origin.push(1); //bias

  //training
  let train_points = generateTrainPoints(1000);
  train(train_points, weights_origin, 20);

  //testing
  let test_points = generatePoints(1000);
  test(test_points, weights_origin);

  drawGraph(pointsRed, pointsGreen);
}

function generateTrainPoints(numberOfPoints) {
  let points = [];

  for (let i = 0; i < numberOfPoints; i++) {
    let point = [];

    point.push(Math.floor(Math.random() * 100));
    point.push(Math.floor(Math.random() * 400));

    let testY = 4 * point[0] - 5;

    if (point[1] > testY) {
      point.push(1); // nad
    } else if (point[1] == testY) {
      point.push(0); //na
    } else {
      point.push(-1); //pod
    }

    points.push(point);
  }

  return points;
}

function train(points, weights, epochs) {
  let learning_rate = 0.1;

  for (let i = 0; i < epochs; i++) {
    points.forEach(point => {
      let sumOfInputs =
        point[0] * weights[0] + point[1] * weights[1] + weights[2];

      let Y_Aguess = Math.sign(sumOfInputs);

      //recalculate weights

      let error = point[2] - Y_Aguess;

      weights[0] = weights[0] + error * point[0] * learning_rate;
      weights[1] = weights[1] + error * point[1] * learning_rate;
      weights[2] = weights[2] + error * learning_rate;
    });
  }

  weights_origin[0] = weights[0];
  weights_origin[1] = weights[1];
  weights_origin[2] = weights[2];
}

function generatePoints(numberOfPoints) {
  let points = [];

  for (let i = 0; i < numberOfPoints; i++) {
    let point = [];
    point.push(Math.floor(Math.random() * 100));
    point.push(Math.floor(Math.random() * 400));
    points.push(point);
  }

  return points;
}

function test(points, weights) {
  points.forEach(point => {
    let sumOfInputs =
      point[0] * weights[0] + point[1] * weights[1] + weights[2];

    let Y_Aguess = Math.sign(sumOfInputs);

    ////////////////////////

    let signResult = Math.sign(Y_Aguess);

    if (signResult > 0) {
      pointsGreen.push({
        x: point[0],
        y: point[1]
      });
    } else if (signResult < 0) {
      pointsRed.push({
        x: point[0],
        y: point[1]
      });
    } else {
      pointsBlue.push({
        x: point[0],
        y: point[1]
      });
    }
  });

  console.log(pointsBlue);
  console.log(pointsRed);
  console.log(pointsGreen);
}

function drawGraph(pointsGreen, pointsBlue) {
  var redPointsGraph = {
    x: [],
    y: [],
    mode: "markers",
    marker: {
      color: "rgb(17, 157, 5)",
      size: 5
    }
  };

  var bluePointsGraph = {
    x: [],
    y: [],
    mode: "markers",

    marker: {
      color: "rgb(17, 17, 255)",
      size: 5
    }
  };

  pointsGreen.forEach(point => {
    redPointsGraph.x.push(point.x);
    redPointsGraph.y.push(point.y);
  });

  pointsBlue.forEach(point => {
    bluePointsGraph.x.push(point.x);
    bluePointsGraph.y.push(point.y);
  });

  let data = [];

  var myLine = {
    x: [0, 100],
    y: [0, 4 * 100 - 5],
    mode: "lines",
    type: "scatter",
    lines: {
      color: "rgb(255,0,255)"
    }
  };

  data.push(redPointsGraph, bluePointsGraph, myLine);

  Plotly.newPlot("myDiv", data);
}
