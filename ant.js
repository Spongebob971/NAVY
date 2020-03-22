let a = 20;
let b = 0.01;
let c = 1; //2 * Math.PI;
let d = 2;

let TOTAL_DISTANCE_PATH = 99999999;

let alfa = 7.2;
let beta = 3.5;
let Q = 1;
let ro = 0.1;

let celkovaProbability = 0;

let pheremones = [];
let bestPath = [];
let ants = [];
let cities = [];

export function antAlgo() {
  generateCities(cities);

  generatePheremones();

  generateAnts(cities, ants);

  console.log("START");

  for (let k = 0; k < 5; k++) {
    ants.forEach(ant => {
      generatePath2(cities, ant); // nezapomenout PREDELAT NA ANT!!!!
    });
    reducePheremones();
    console.log("NASeL " + TOTAL_DISTANCE_PATH);

    drawGraph(ants, cities);
  }
}

function generatePath2(cities, ant) {
  let firstCity = ant.path[0];
  ant.path = [];
  ant.path.push(firstCity);

  let tmpCities = [];

  cities.forEach(city => {
    tmpCities.push(city);
  });

  // nalezeni cesty
  for (let i = 0; i < 130; i++) {
    let ohodnoceniCesty = [];
    celkovaProbability = 0;

    let currentCity = tmpCities.find(
      element => element.number == ant.path[ant.path.length - 1]
    );

    var index = tmpCities.indexOf(currentCity);
    tmpCities.splice(index, 1);

    ohodnoceniCesty = getProbabilities(currentCity, tmpCities);

    let cityIndexToMove = getCityToMoveIndex(ohodnoceniCesty);

    ant.path.push(cityIndexToMove);

    updatePheremones(
      currentCity,
      tmpCities.find(x => x.number == cityIndexToMove)
    );
  }

  ant.path.push(ant.path[0]);

  let totalDistance = calculateTotalDistance(ant.path);

  if (totalDistance < TOTAL_DISTANCE_PATH) {
    TOTAL_DISTANCE_PATH = totalDistance;

    bestPath = [];

    ant.path.forEach(element => {
      bestPath.push(element);
    });
  }
}

function calculateTotalDistance(path) {
  let pathDistance = 0;

  for (let a = 0; a < path.length - 2; a++) {
    let city1 = cities.find(x => x.number == path[a]);
    let city2 = cities.find(x => x.number == path[a + 1]);

    pathDistance += getDistance(city1.x, city1.y, city2.x, city2.y);
  }
  pathDistance += getDistance(
    cities[path.length - 2].x,
    cities[path.length - 2].y,
    cities[path[0]].x,
    cities[path[0]].y
  );
  return pathDistance;
}

function getCityToMoveIndex(ohodnoceniCesty) {
  let randomProbability = Math.random() * celkovaProbability;

  let cityIndexToMove = 0;

  for (let i = 0; i < ohodnoceniCesty.length; i++) {
    randomProbability = randomProbability - ohodnoceniCesty[i].probability;

    if (randomProbability <= 0) {
      cityIndexToMove = ohodnoceniCesty[i].cityIndex;

      break;
    }
  }
  return cityIndexToMove;
}

function getProbabilities(currentCity, citiesToGo) {
  let ohodnoceniCesty = [];

  citiesToGo.forEach(cityToGo => {
    let propability =
      getPheremoneValue(cityToGo, currentCity) ** alfa *
      (1 / getDistance(cityToGo.x, cityToGo.y, currentCity.x, currentCity.y)) **
        beta;

    ohodnoceniCesty.push({
      probability: propability,
      cityIndex: cityToGo.number
    });

    celkovaProbability += propability;
  });
  return ohodnoceniCesty;
}

function getPheremoneValue(currentCity, tmpCity) {
  let pheremone = pheremones.find(
    x => x.city1Index == currentCity.number && x.city2Index == tmpCity.number
  );
  if (tmpCity.number < currentCity.number) {
    pheremone = pheremones.find(
      x => x.city1Index == tmpCity.number && x.city2Index == currentCity.number
    );
  }
  return pheremone.value;
}

function reducePheremones() {
  pheremones.forEach(pheremone => {
    pheremone.value -= ro;
    if (pheremone.value < 0.1) {
      pheremone.value = 0.1;
    }
  });
}

function generatePheremones() {
  for (let i = 0; i <= 130; i++) {
    for (let j = i + 1; j <= 130; j++)
      pheremones.push({
        city1Index: i,
        city2Index: j,
        value: 1
      });
  }
}

function updatePheremones(city1, city2) {
  if (city1.number < city2.number) {
    let pheremone = pheremones.find(
      x => x.city1Index == city1.number && x.city2Index == city2.number
    );

    pheremone.value += Q / getDistance(city1.x, city1.y, city2.x, city2.y);
  } else {
    let pheremone = pheremones.find(
      x => x.city1Index == city2.number && x.city2Index == city1.number
    );
    pheremone.value += Q / getDistance(city1.x, city1.y, city2.x, city2.y);
  }
}

function generateAnts(cities, ants) {
  let i = 0;

  cities.forEach(city => {
    ants.push({
      x: city.x,
      y: city.y,
      path: [i]
    });
    i++;
  });
}

function getDistance(x1, y1, x2, y2) {
  let x = Math.abs(x1 - x2);
  let y = Math.abs(y1 - y2);

  let distance = Math.sqrt(x * x + y * y);

  return distance;
}

async function generateCities(cities) {
  for (let i = 0; i < citiesX.length; i++) {
    cities.push({
      x: citiesX[i],
      y: citiesY[i],
      invertedValue: 0,
      number: i
    });
  }
}

function drawGraph(ants, cities) {
  var citiesGraph = {
    x: [],
    y: [],
    mode: "markers",
    type: "scatter"
  };

  cities.forEach(city => {
    citiesGraph.x.push(city.x);
    citiesGraph.y.push(city.y);
  });

  var citiesEdges = {
    x: [],
    y: [],
    mode: "markers + lines",
    type: "scatter"
  };

  bestPath.forEach(city => {
    citiesEdges.x.push(cities[city].x);
    citiesEdges.y.push(cities[city].y);
  });

  let data = [];

  data.push(citiesGraph, citiesEdges);

  Plotly.newPlot("myDiv", data);
}

let citiesX = [
  13,
  26,
  27,
  39,
  0,
  13,
  19,
  25,
  31,
  37,
  43,
  8,
  0,
  10,
  10,
  10,
  10,
  5,
  13,
  19,
  25,
  31,
  37,
  43,
  8,
  11,
  13,
  15,
  17,
  19,
  21,
  23,
  25,
  27,
  29,
  31,
  33,
  35,
  37,
  39,
  41,
  42,
  44,
  45,
  11,
  15,
  22,
  23,
  24,
  26,
  28,
  29,
  9,
  16,
  20,
  28,
  30,
  34,
  40,
  43,
  47,
  26,
  31,
  15,
  26,
  29,
  31,
  15,
  26,
  29,
  31,
  38,
  41,
  5,
  17,
  31,
  16,
  20,
  30,
  34,
  22,
  23,
  32,
  34,
  35,
  36,
  22,
  27,
  6,
  45,
  47,
  25,
  12,
  25,
  44,
  45,
  47,
  6,
  22,
  11,
  13,
  16,
  45,
  47,
  12,
  16,
  20,
  24,
  29,
  35,
  39,
  6,
  21,
  10,
  32,
  35,
  39,
  10,
  33,
  37,
  10,
  41,
  5,
  17,
  20,
  24,
  29,
  34,
  38,
  6,
  27
];

let citiesY = [
  0,
  0,
  0,
  0,
  2,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  8,
  9,
  10,
  11,
  12,
  12,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  18,
  18,
  18,
  18,
  18,
  18,
  18,
  18,
  18,
  18,
  18,
  18,
  18,
  18,
  18,
  18,
  18,
  18,
  18,
  25,
  25,
  25,
  25,
  25,
  25,
  25,
  25,
  25,
  28,
  28,
  28,
  28,
  28,
  28,
  28,
  28,
  32,
  32,
  33,
  33,
  33,
  33,
  34,
  34,
  34,
  34,
  34,
  34,
  34,
  35,
  35,
  38,
  38,
  38,
  38,
  40,
  41,
  41,
  41,
  41,
  41,
  48,
  48,
  48,
  51,
  51,
  56,
  57,
  57,
  57,
  61,
  61,
  63,
  64,
  71,
  71,
  71,
  71,
  71,
  74,
  74,
  74,
  74,
  74,
  74,
  74,
  74,
  77,
  78,
  78,
  78,
  78,
  79,
  79,
  79,
  80,
  80,
  80,
  81,
  84,
  84,
  84,
  84,
  84,
  84,
  107
];
