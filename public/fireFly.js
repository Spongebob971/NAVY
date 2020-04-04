let a = 40;
let b = 0.003;
let c = 1; //2 * Math.PI;
let d = 3;

//nejaky random nevim
let gamma = 4;
let m = 4;
let alfa = 0.3;
let beta_0 = 10;
let vidle = 1;

//xJd a xId --> xJd je lepsi, xId je horsi

export function fireFly() {
  let fireflies = [];
  let arr = [];

  generateGraph(arr);

  generateFireflies(fireflies);

  moveWorseToBetter(arr, fireflies);

  drawGraph(arr, fireflies);
}

function moveWorseToBetter(arr, fireflies) {
  fireflies.forEach(firefly1 => {
    fireflies.forEach(firefly2 => {
      let distanceX = Math.abs(firefly1.x - firefly2.x);
      let distanceY = Math.abs(firefly1.y - firefly2.y);

      let distance = Math.sqrt(distanceX * distanceX + distanceY * distance.Y);

      if (fireFly1.z > firefly2.z) {
        moveFirefly(firefly1, firefly2);
      }
    });
  });
}

function moveFirefly(firefly1, firefly2) {
  firefly1.x =
    firefly1.x +
    beta_0 *
      pow(Math.E, -gamma * pow(distance, m)) *
      (firefly2.x - fireFly1.x) +
    alfa * (vidle - 0.5);

  firefly1.y =
    firefly1.y +
    beta_0 *
      pow(Math.E, -gamma * pow(distance, m)) *
      (firefly2.y - fireFly1.y) +
    alfa * (vidle - 0.5);
}

function getValueFromCoordinates(x, y) {
  let result =
    -a *
      Math.exp(
        -b * Math.sqrt(1 / d) * ((y - 40) * (y - 40) + (x - 40) * (x - 40))
      ) -
    Math.exp((1 / d) * (Math.cos(c * (y - 40)) + Math.cos(c * (x - 40)))) +
    a +
    Math.exp(1);

  return result;
}

function generateFireflies(fireflies) {
  for (let i = 0; i < 10; i++) {
    let x = Math.floor(Math.random() * 80);
    let y = Math.floor(Math.random() * 80);

    fireflies.push({
      x: x,
      y: y,
      z: getValueFromCoordinates(x, y)
    });
  }
}

function generateGraph(arr) {
  let j = -40;

  for (let i = -40; i < 40; i++) {
    arr.push(
      Array(80)
        .fill()
        .map(() => {
          j++;

          return (
            -a * Math.exp(-b * Math.sqrt(1 / d) * (j * j + i * i)) -
            Math.exp((1 / d) * (Math.cos(c * j) + Math.cos(c * i))) +
            a +
            Math.exp(1)
          );
        })
    );
    j = -40;
  }
}

function drawGraph(arr, fireflies) {
  let data_surface = {
    autosize: false,
    z: arr,
    type: "surface",
    opacity: 0.7
  };

  let x = [];
  let y = [];
  let z = [];

  fireflies.forEach(firefly => {
    x.push(firefly.x);
    y.push(firefly.y);
    z.push(firefly.z);
  });

  let data_markers = {
    x: x,
    y: y,
    z: z,
    mode: "markers",
    marker: {
      color: "rgb(255, 255, 127)",
      size: 8,
      symbol: "circle",
      line: {
        color: "rgb(204, 204, 204)",
        width: 1
      },
      opacity: 1
    },
    type: "scatter3d"
  };

  let data = [data_surface, data_markers];

  let myPlot = Plotly.newPlot("myDiv", data);
}
