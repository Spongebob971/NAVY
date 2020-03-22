//L-system

let const_distance = 1;
let degree = 0; //
let actualPos = {
  x: 0,
  y: 0
};

let array1 = ["F", "+", "F", "-", "F", "F", "+", "F", "+", "F", "-", "F"];
let array2 = ["F", "+", "F", "-", "-", "F", "+", "F"];
let array3 = ["F", "[", "+", "F", "]", "F", "[", "-", "F", "]", "F"];
let array4 = [
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

var pathArray = new Array(4);

for (var i = 0; i < pathArray.length; i++) {
  pathArray[i] = new Array(100);
}

export function cv7doTheWork() {
  //1. F+F-F-FF+F+F-F
  //2. F+F--F+F
  //3. F[+F]F[-F]F
  //4. FF+[+F-F-F]-[-F+F+F]

  computePath(array1, pathArray[0]);

  let secondDetail = replaceFs(array1, array2);
  //let thirdDetail = replaceFs(secondDetail, array3);

  computePath(secondDetail, pathArray[1]);
  //computePath(thirdDetail, pathArray[2]);
  draw(3);
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

    //debugger;

    result.splice.apply(result, [indexes[k], 0].concat(replacingArray));

    //update indexes
    for (let i = 0; i < indexes.length; i++) {
      indexes[i] += replacingArray.length - 1;
    }
  }
  return result;
}

function computePath(array, pathArray) {
  degree = 0;

  let startingPoint = {
    x: 0,
    y: 0
  };

  pathArray.push(startingPoint);

  let i = 0;

  array.forEach(element => {
    if (element == "F") {
      let newPoint = {
        x: actualPos.x + 1 * Math.cos(degree),
        y: actualPos.y + 1 * Math.sin(degree)
      };

      actualPos.x = newPoint.x;
      actualPos.y = newPoint.y;

      pathArray.push(newPoint);
    } else if (element == "+") {
      degree += 45;
      degree = degree > 360 ? degree - 360 : degree;
    } else if (element == "-") {
      let newDegree = degree - 45;
      degree = newDegree < 0 ? 360 + newDegree : newDegree;
    }
  });
}

function draw(amount) {
  let traces = [];

  let data = [];

  for (let i = 0; i < amount; i++) {
    let xArray = [];
    let yArray = [];

    pathArray[i].forEach(element => {
      xArray.push(element.x);
      yArray.push(element.y);
    });

    let trace = {
      x: xArray,
      y: yArray,
      type: "scatter"
    };

    traces.push(trace);
  }

  traces.forEach(trace => {
    data.push(trace);
  });

  //var data = [trace1, trace2];

  Plotly.newPlot("myDiv", data);
}
