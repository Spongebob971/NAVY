Plotly.newPlot("myDiv", [
  {
    x: [],
    y: [],
    z: [],
    mode: "markers",
    type: "scatter3d",
    marker: {
      color: "rgb(17, 157, 255)",
      size: 10,
    },
  },
]);

let points = [];

// a, b, c, d, e, f, g, h , i , j , k , l, probability
let firstModel = [
  [0.0, 0.0, 0.01, 0.0, 0.26, 0.0, 0.0, 0.0, 0.05, 0.0, 0.0, 0.0, 0.4],
  [0.2, -0.26, -0.01, 0.23, 0.22, -0.07, 0.07, 0.0, 0.24, 0.0, 0.0, 0.0, 0.15],
  [-0.25, 0.28, 0.01, 0.26, 0.24, -0.07, 0.07, 0.0, 0.24, 0.0, 0.22, 0.0, 0.15],
  [0.85, 0.04, -0.01, -0.04, 0.85, 0.09, 0.0, 0.08, 0.84, 0.0, 0.8, 0.0, 0.3],
];

let secondModel = [
  [0.05, 0.0, 0.0, 0.0, 0.6, 0.0, 0.0, 0.0, 0.05, 0.0, 0.0, 0.0, 0.25],
  [
    0.45,
    -0.22,
    0.22,
    0.22,
    0.45,
    0.22,
    -0.22,
    0.22,
    -0.45,
    0.0,
    1.0,
    0.0,
    0.25,
  ],
  [
    -0.45,
    0.22,
    -0.22,
    0.22,
    0.45,
    0.22,
    0.22,
    -0.22,
    0.45,
    0.0,
    1.25,
    0.0,
    0.25,
  ],
  [0.49, -0.08, 0.08, 0.08, 0.49, 0.08, 0.08, -0.08, 0.49, 0.0, 2.0, 0.0, 0.25],
];

export function cv8doTheWork(modelIndex) {
  points = [];
  // generate random starting point.

  let returnPoint = {
    x: Math.random(),
    y: Math.random(),
    z: Math.random(),
  };

  // modelIndex is editable value from html page(0 or 1).

  if (modelIndex == 0) {
    // iterate
    for (let i = 0; i < 2000; i++) {
      // compute each point and return new value and use it as new input.
      returnPoint = compute(
        firstModel,
        returnPoint.x,
        returnPoint.y,
        returnPoint.z
      );
    }
  }

  if (modelIndex == 1) {
    // iterate
    for (let i = 0; i < 5000; i++) {
      // compute each point and return new value and use it as new input.
      returnPoint = compute(
        secondModel,
        returnPoint.x,
        returnPoint.y,
        returnPoint.z
      );
    }
  }

  draw();
}

function getRule(model) {
  //generate random value between 0 and 1 and according it's value choose transform.

  let random = Math.random();

  for (let i = 0; i < 4; i++) {
    if (random >= model[i][12]) {
      // on position 12 each transfrom has probability value.
      random = random - model[i][12];
    } else {
      return i; // return i, which means row index of transform, [each model has 4 rows, which means I can return between 0 and 3].
    }
  }
}

function compute(model, x, y, z) {
  let rule = getRule(model);

  //formula, (+ 10000 is just for graph.)
  let x1 =
    model[rule][0] * x +
    model[rule][1] * y +
    model[rule][2] * z +
    model[0][9] +
    10000;
  let y1 =
    model[rule][3] * x +
    model[rule][4] * y +
    model[rule][5] * z +
    model[0][10] +
    10000;
  let z1 =
    model[rule][6] * x +
    model[rule][7] * y +
    model[rule][8] * z +
    model[0][11] +
    10000;

  //debugger;

  // computed new point.
  let myPoint = {
    x: x1,
    y: y1,
    z: z1,
  };

  // add new point to array of points.
  points.push(myPoint);

  let returnPoint = {
    x: x1,
    y: y1,
    z: z1,
  };

  return returnPoint;
}

function draw() {
  // there is no function that is important, its just few steps so I can display points correctly.
  console.log(points);

  var bluePointsGraph = {
    x: [],
    y: [],
    z: [],
    mode: "markers",
    marker: {
      color: "rgb(5, 5, 255)",
      size: 3,
    },
  };

  points.forEach((point) => {
    bluePointsGraph.x.push(point.x);
    bluePointsGraph.y.push(point.y);
    bluePointsGraph.z.push(point.z);
  });

  let data = [];

  data.push(bluePointsGraph);

  let xs = [];
  let ys = [];
  let zs = [];

  points.forEach((element) => {
    xs.push(element.x);
    ys.push(element.y);
    zs.push(element.z);
  });

  Plotly.newPlot("myDiv", [
    {
      x: xs,
      y: ys,
      z: zs,
      mode: "markers",
      type: "scatter3d",
      marker: {
        color: "rgb(17, 157, 255)",
        size: 2,
      },
    },
  ]);
}
