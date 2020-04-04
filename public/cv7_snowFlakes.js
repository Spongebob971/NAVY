let axiom1 = ["F", "+", "F", "+", "F", "+", "F"];
let axiomRule1 = [
  "F",
  "+",
  "F",
  "-",
  "F",
  "-",
  "F",
  "F",
  "+",
  "F",
  "+",
  "F",
  "-",
  "F"
];
let axiomAngle1 = 90;

let axiom2 = ["F", "+", "+", "F", "+", "+", "F"];
let axiomRule2 = ["F", "+", "F", "-", "-", "F", "+", "F"];
let axiomAngle2 = 60;

let axiom3 = ["F"];
let axiomRule3 = ["F", "[", "+", "F", "]", "F", "[", "-", "F", "]", "F"];
let axiomAngle3 = 180 / 7;

let axiom4 = ["F"];
let axiomRule4 = [
  "F",
  "F",
  "+",
  "[",
  "+",
  "F",
  "-",
  "F",
  "-",
  "F",
  "]",
  "-",
  "[",
  "-",
  "F",
  "+",
  "F",
  "+",
  "F",
  "]"
];
let axiomAngle4 = 180 / 8;

var pathArray = [];

let axiom = axiom1;
let rule = axiomRule1;
let axiomAngle = axiomAngle1;

export function cv7doTheWork(iterationValue, patternValue) {
  // switch axiom rule and angle to obtain different pattern.

  pathArray = [];

  console.log(iterationValue, patternValue);

  choosePattern(patternValue);

  let arrayWithReplacedFs = axiom;
  let result = [];

  let iterations = iterationValue; // change value of iterations so result is much more or less detailed.

  for (let i = 0; i < iterations; i++) {
    // replace each F with predefined rules.
    arrayWithReplacedFs = replaceFs(arrayWithReplacedFs, rule);

    // compute path (pattern) with array with already modified array.
    result = computePath(arrayWithReplacedFs, axiomAngle);
  }

  result.forEach(element => {
    pathArray.push(element);
  });

  draw();
}

function choosePattern(patternNumber) {
  switch (patternNumber) {
    case 1:
      axiom = axiom1;
      rule = axiomRule1;
      axiomAngle = axiomAngle1;
      break;

    case 2:
      axiom = axiom2;
      rule = axiomRule2;
      axiomAngle = axiomAngle2;
      break;
    case 3:
      axiom = axiom3;
      rule = axiomRule3;
      axiomAngle = axiomAngle3;
      break;
    case 4:
      axiom = axiom4;
      rule = axiomRule4;
      axiomAngle = axiomAngle4;
      break;
  }
}

function replaceFs(arrayToReplace, replacingArray) {
  let result = [];

  arrayToReplace.forEach(element => {
    result.push(element);
  });

  let indexes = [];

  for (let i = 0; i < result.length; i++) {
    if (result[i] == "F") {
      indexes.push(i);
    }
  }

  for (let k = 0; k < indexes.length; k++) {
    result.splice(indexes[k], 1);

    result.splice.apply(result, [indexes[k], 0].concat(replacingArray));

    //update indexes
    for (let i = 0; i < indexes.length; i++) {
      indexes[i] += replacingArray.length - 1;
    }
  }
  return result;
}

function computePath(array, angle) {
  let degree = 90; // init degree(90 bcs sin 90 = 1)
  let angleToRemember = []; // when "[" occurs, angle needs to be remembered.
  let temporaryPath2 = []; // when "[" occurs, push to result Array points from returnPath that contains same points after "[" but backwards. All that action so graph won't be damaged.
  let result = []; // final array for graph to display.

  //starting point at 10,10.
  let newPoint = {
    x: 10,
    y: 10
  };

  result.push(newPoint);

  array.forEach(element => {
    if (element == "F") {
      newPoint = {
        x: newPoint.x + 1 * Math.cos(degree * (Math.PI / 180)),
        y: newPoint.y + 1 * Math.sin(degree * (Math.PI / 180))
      };

      result.push(newPoint);

      if (temporaryPath2.length != 0) {
        temporaryPath2[temporaryPath2.length - 1].push(newPoint);
      }
    } else if (element == "+") {
      degree += angle; // adding angle
      degree = degree > 360 ? degree - 360 : degree; // handling degrees in <0,360)
    } else if (element == "-") {
      let newDegree = degree - angle; // removing angle
      degree = newDegree < 0 ? 360 + newDegree : newDegree; // handling degrees in <0,360)
    } else if (element == "[") {
      let tmp = result[result.length - 1];

      angleToRemember.push(
        parseFloat((Math.round(degree * 10) / 10).toFixed(0))
      );

      temporaryPath2.push([]);

      temporaryPath2[temporaryPath2.length - 1].push(tmp);
    } else if (element == "]") {
      degree = angleToRemember[angleToRemember.length - 1];

      angleToRemember.pop();

      temporaryPath2[temporaryPath2.length - 1] // adding points from branches to result backwards.(has to be done so graph is looking magnificent.)
        .slice()
        .reverse()
        .forEach(elementReversePath => {
          result.push(elementReversePath);
        });

      newPoint = result[result.length - 1];

      temporaryPath2.pop();
    }
  });

  return result;
}

function draw() {
  let traces = [];

  let data = [];

  let xArray = [];
  let yArray = [];

  pathArray.forEach(element => {
    xArray.push(element.x);
    yArray.push(element.y);
  });

  let trace = {
    x: xArray,
    y: yArray,
    type: "scatter"
  };

  traces.push(trace);

  traces.forEach(trace => {
    data.push(trace);
  });

  var layout = {
    autosize: false,
    width: 800,
    height: 800,
    margin: {
      l: 50,
      r: 50,
      b: 100,
      t: 100,
      pad: 4
    }
  };

  Plotly.newPlot("myDiv", data, layout);
}
