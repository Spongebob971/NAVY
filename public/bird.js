let a = 20;
let b = 0.01;
let c = 1; //2 * Math.PI;
let d = 2;

export function birdAglorithm() {
  let birds = [];
  let arr = [];

  let globalBest = {
    x: 99999,
    y: 99999,
    z: 99999
  };

  generateGraph(arr);

  generateBirds(birds);

  drawGraph(arr, birds);

  interval(birds, arr, globalBest, 0);
}

function interval(birds, arr, globalBest, indexOfInterval) {
  setTimeout(function() {
    getBestOfAll(birds, globalBest);

    moveOthersToLeader(arr, birds, globalBest, indexOfInterval);

    drawGraph(arr, birds);

    indexOfInterval++;

    interval(birds, arr, globalBest, indexOfInterval);
  }, 1);
}

function moveOthersToLeader(arr, birds, globalBest, indexOfinterval) {
  let c1 = 1;
  let c2 = 0.2;

  let interiaWeigth = indexOfinterval / 10;

  interiaWeigth += birds.forEach(bird => {
    let random = (Math.random() * 1).toFixed(2);

    let GLOBAL_BEST = { x: 0, y: 0 };

    GLOBAL_BEST.x = Math.round(c1 * random * (globalBest.x - bird.x));
    GLOBAL_BEST.y = Math.round(c1 * random * (globalBest.y - bird.y));

    random = (Math.random() * 2).toFixed(2);

    let PERSONAL_BEST = { x: 0, y: 0 };

    PERSONAL_BEST.x = Math.round(c2 * random * (bird.personalBest.x - bird.x));
    PERSONAL_BEST.y = Math.round(c2 * random * (bird.personalBest.y - bird.y));

    bird.speed.x += Math.round(GLOBAL_BEST.x + PERSONAL_BEST.x);
    bird.speed.y += Math.round(GLOBAL_BEST.y + PERSONAL_BEST.y);

    if (bird.speed.x > 4) {
      bird.speed.x = 4;
    }

    if (bird.speed.y > 4) {
      bird.speed.y = 4;
    }

    if (bird.speed.y < -4) {
      bird.speed.y = -4;
    }

    if (bird.speed.x < -4) {
      bird.speed.x = -4;
    }

    if (bird.speed.x < 0) {
      bird.speed.x += interiaWeigth;
      if (bird.speed.x > 0) bird.speed.x = 0;
    }
    if (bird.speed.y < 0) {
      bird.speed.y += interiaWeigth;
      if (bird.speed.y > 0) bird.speed.y = 0;
    }

    if (bird.speed.x > 0) {
      bird.speed.x -= interiaWeigth;
      if (bird.speed.x < 0) bird.speed.x = 0;
    }
    if (bird.speed.y > 0) {
      bird.speed.y -= interiaWeigth;
      if (bird.speed.y < 0) bird.speed.y = 0;
    }

    console.log(bird.speed);

    if (
      bird.x + bird.speed.x < 80 &&
      bird.x + bird.speed.x >= 0 &&
      bird.y + bird.speed.y < 80 &&
      bird.y + bird.speed.y >= 0
    ) {
      bird.x += bird.speed.x;
      bird.y += bird.speed.y;
      bird.z = getValueFromCoordinates(bird.x, bird.y);
    }
  });
}

function getBestOfAll(birds, globalBest) {
  birds.forEach(bird => {
    if (
      getValueFromCoordinates(bird.x, bird.y) <
      getValueFromCoordinates(bird.personalBest.x, bird.personalBest.y)
    ) {
      bird.personalBest.x = bird.x;
      bird.personalBest.y = bird.y;

      if (getValueFromCoordinates(bird.x, bird.y) < globalBest.z) {
        globalBest.x = bird.x;
        globalBest.y = bird.y;
        globalBest.z = getValueFromCoordinates(bird.x, bird.y);
      }
    }
  });
}

function generateBirds(birds) {
  for (let i = 0; i < 10; i++) {
    let x = Math.floor(Math.random() * 80);
    let y = Math.floor(Math.random() * 80);

    birds.push({
      x: x,
      y: y,
      z: getValueFromCoordinates(x, y),
      speed: { x: 1, y: 1 },
      personalBest: { x: x, y: y }
    });
  }
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

function drawGraph(arr, birds) {
  let data_surface = {
    autosize: false,
    z: arr,
    type: "surface",
    opacity: 0.7
  };

  let x = [];
  let y = [];
  let z = [];

  birds.forEach(bird => {
    x.push(bird.x);
    y.push(bird.y);
    z.push(bird.z);
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
