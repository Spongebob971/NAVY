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

export function cv7doTheWork() {
  // switch axiom rule and angle to obtain different pattern.
  let axiom = axiom1;
  let rule = axiomRule1;
  let axiomAngle = axiomAngle1;

  let arrayWithReplacedFs = axiom;
  let result = [];

  let iterations = 3;
  // change value of iterations so result is much more detailed.
  for (let i = 0; i < iterations; i++) {
    arrayWithReplacedFs = replaceFs(arrayWithReplacedFs, rule);

    result = computePath(arrayWithReplacedFs, axiomAngle);
  }

  result.forEach(element => {
    pathArray.push(element);
  });

  draw();
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
  let degree = 90;
  let angleToRemember = [];
  let temporaryPath2 = []; // when "[" occurs, push to result Array points from returnPath that contains same points after "[" but backwards. All that action so graph won't be damaged.
  let result = [];

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
      degree += angle;
      degree = degree > 360 ? degree - 360 : degree;
    } else if (element == "-") {
      let newDegree = degree - angle;
      degree = newDegree < 0 ? 360 + newDegree : newDegree;
    } else if (element == "[") {
      let tmp = result[result.length - 1];

      angleToRemember.push(
        parseFloat((Math.round(degree * 10) / 10).toFixed(0))
      );

      temporaryPath2.push([]);

      temporaryPath2[temporaryPath2.length - 1].push(tmp);

      console.log(temporaryPath2);
    } else if (element == "]") {
      degree = angleToRemember[angleToRemember.length - 1];

      angleToRemember.pop();

      temporaryPath2[temporaryPath2.length - 1]
        .slice()
        .reverse()
        .forEach(elementReversePath => {
          result.push(elementReversePath);
        });

      newPoint = result[result.length - 1]; // newPoint je actual point od ktere se pak pokracuje, proto musi byt posledni bod z result newPoint

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
