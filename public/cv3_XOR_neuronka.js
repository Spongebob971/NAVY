let weights = [];
let inputData = [];

let pointsAmount = 2000;

let bias1 = 0.35; // pro hidden part
let bias2 = 0.6; // pro output part

export function cv3XorDoTheWork() {
  //nastaveni váh
  weights[0] = 0.15;
  weights[1] = 0.2;
  weights[2] = 0.25;
  weights[3] = 0.3;
  weights[4] = 0.4;
  weights[5] = 0.45;
  weights[6] = 0.4;
  weights[7] = 0.45;
  weights[8] = 0.45;
  weights[9] = 0.45;
  weights[10] = 0.45;
  weights[11] = 0.45;
  weights[12] = 0.45;
  weights[13] = 0.45;
  weights[14] = 0.45;

  //spuštění trénování
  train();
}

function train() {
  generateData();

  //do 15 iteraci vetsinou vychazi Error_total o cca 99% mensi (vypis  E_total pri kazde iteraci v consoli v prohlizeci).
  for (let k = 0; k < 15; k++) {
    let redPoints = [];
    let bluePoints = [];

    let total_E = 0;

    for (let i = 0; i < pointsAmount; i++) {
      let net_h1 = getNet_h(
        inputData[i].xBoolean,
        inputData[i].yBoolean,
        weights[0],
        weights[1]
      );

      let net_h2 = getNet_h(
        inputData[i].xBoolean,
        inputData[i].yBoolean,
        weights[2],
        weights[3]
      );

      let net_h3 = getNet_h(
        inputData[i].xBoolean,
        inputData[i].yBoolean,
        weights[4],
        weights[5]
      );

      let net_h4 = getNet_h(
        inputData[i].xBoolean,
        inputData[i].yBoolean,
        weights[6],
        weights[7]
      );

      let net_h5 = getNet_h(
        inputData[i].xBoolean,
        inputData[i].yBoolean,
        weights[8],
        weights[9]
      );

      let out_h1 = getOut_h(net_h1);
      let out_h2 = getOut_h(net_h2);
      let out_h3 = getOut_h(net_h3);
      let out_h4 = getOut_h(net_h4);
      let out_h5 = getOut_h(net_h5);

      let net_o = getNet_o(
        out_h1,
        out_h2,
        out_h3,
        out_h4,
        out_h5,
        weights[10],
        weights[11],
        weights[12],
        weights[13],
        weights[14]
      );

      let out_o = getOut_o(net_o);

      //vysledek ze site, prirazeni podle vystupu do cervene nebo modre skupiny.
      out_o >= 0.5
        ? redPoints.push(inputData[i])
        : bluePoints.push(inputData[i]);

      let outputDiff = inputData[i].expectedValue - out_o;

      total_E += 0.5 * Math.pow(outputDiff, 2);

      //Zpětný výpočet pro nové váhy.
      let E_o_out_o = out_o - inputData[i].expectedValue;

      let out_o_net_o = out_o * (1 - out_o);

      let net_o_w11 = out_h1;
      let net_o_w12 = out_h2;
      let net_o_w13 = out_h3;
      let net_o_w14 = out_h4;
      let net_o_w15 = out_h5;

      let E_total_w11 = E_o_out_o * out_o_net_o * net_o_w11;
      let E_total_w12 = E_o_out_o * out_o_net_o * net_o_w12;
      let E_total_w13 = E_o_out_o * out_o_net_o * net_o_w13;
      let E_total_w14 = E_o_out_o * out_o_net_o * net_o_w14;
      let E_total_w15 = E_o_out_o * out_o_net_o * net_o_w15;

      let E_o_net_o = E_o_out_o * out_o_net_o;

      let net_o_out_h1 = weights[10];
      let net_o_out_h2 = weights[11];
      let net_o_out_h3 = weights[12];
      let net_o_out_h4 = weights[13];
      let net_o_out_h5 = weights[14];

      let E_o_out_h1 = E_o_net_o * net_o_out_h1;
      let E_o_out_h2 = E_o_net_o * net_o_out_h2;
      let E_o_out_h3 = E_o_net_o * net_o_out_h3;
      let E_o_out_h4 = E_o_net_o * net_o_out_h4;
      let E_o_out_h5 = E_o_net_o * net_o_out_h5;

      let E_total_out_h1 = E_o_out_h1;
      let E_total_out_h2 = E_o_out_h2;
      let E_total_out_h3 = E_o_out_h3;
      let E_total_out_h4 = E_o_out_h4;
      let E_total_out_h5 = E_o_out_h5;

      let out_h1_net_h1 = out_h1 * (1 - out_h1);
      let out_h2_net_h2 = out_h2 * (1 - out_h2);
      let out_h3_net_h3 = out_h3 * (1 - out_h3);
      let out_h4_net_h4 = out_h4 * (1 - out_h4);
      let out_h5_net_h5 = out_h5 * (1 - out_h5);

      let net_h1_w1 = inputData[i].xBoolean;
      let net_h1_w2 = inputData[i].yBoolean;
      let net_h2_w3 = inputData[i].xBoolean;
      let net_h2_w4 = inputData[i].yBoolean;
      let net_h3_w5 = inputData[i].xBoolean;
      let net_h3_w6 = inputData[i].yBoolean;
      let net_h4_w7 = inputData[i].xBoolean;
      let net_h4_w8 = inputData[i].yBoolean;
      let net_h5_w9 = inputData[i].xBoolean;
      let net_h5_w10 = inputData[i].yBoolean;

      let E_total_w1 = E_total_out_h1 * out_h1_net_h1 * net_h1_w1;
      let E_total_w2 = E_total_out_h1 * out_h1_net_h1 * net_h1_w2;
      let E_total_w3 = E_total_out_h2 * out_h2_net_h2 * net_h2_w3;
      let E_total_w4 = E_total_out_h2 * out_h2_net_h2 * net_h2_w4;
      let E_total_w5 = E_total_out_h3 * out_h3_net_h3 * net_h3_w5;
      let E_total_w6 = E_total_out_h3 * out_h3_net_h3 * net_h3_w6;
      let E_total_w7 = E_total_out_h4 * out_h4_net_h4 * net_h4_w7;
      let E_total_w8 = E_total_out_h4 * out_h4_net_h4 * net_h4_w8;
      let E_total_w9 = E_total_out_h5 * out_h5_net_h5 * net_h5_w9;
      let E_total_w10 = E_total_out_h5 * out_h5_net_h5 * net_h5_w10;

      //prirazeni novych vah v siti
      weights[0] = weights[0] - 0.5 * E_total_w1;
      weights[1] = weights[1] - 0.5 * E_total_w2;
      weights[2] = weights[2] - 0.5 * E_total_w3;
      weights[3] = weights[3] - 0.5 * E_total_w4;
      weights[4] = weights[4] - 0.5 * E_total_w5;
      weights[5] = weights[5] - 0.5 * E_total_w6;
      weights[6] = weights[6] - 0.5 * E_total_w7;
      weights[7] = weights[7] - 0.5 * E_total_w8;
      weights[8] = weights[8] - 0.5 * E_total_w9;
      weights[9] = weights[9] - 0.5 * E_total_w10;
      weights[10] = weights[10] - 0.5 * E_total_w11;
      weights[11] = weights[11] - 0.5 * E_total_w12;
      weights[12] = weights[12] - 0.5 * E_total_w13;
      weights[13] = weights[13] - 0.5 * E_total_w14;
      weights[14] = weights[14] - 0.5 * E_total_w15;
    }

    console.log("total_E: " + total_E + " k:" + k);

    drawGraph(redPoints, bluePoints);
  }
}

function getNet_h(input1, input2, weight1, weight2) {
  return weight1 * input1 + weight2 * input2 + bias1 * 1;
}

function getOut_h(net) {
  let result = 1 / (1 + Math.pow(Math.exp(1), -net));

  return result;
}

function getNet_o(
  out_h1,
  out_h2,
  out_h3,
  out_h4,
  out_h5,
  weight1,
  weight2,
  weight3,
  weight4,
  weight5
) {
  let result =
    weight1 * out_h1 +
    weight2 * out_h2 +
    weight3 * out_h3 +
    weight4 * out_h4 +
    weight5 * out_h5 +
    bias2 * 1;

  return result;
}

function getOut_o(net) {
  let result = 1 / (1 + Math.pow(Math.E, -net));

  return result;
}

function generateData() {
  inputData = [];

  for (let i = 0; i < pointsAmount; i++) {
    let tmp = {
      x: Math.random(),
      y: Math.random(),
      xBoolean: 0,
      yBoolean: 0,
      expectedValue: 0
    };

    tmp.x < 0.5 ? (tmp.xBoolean = 0) : (tmp.xBoolean = 1);
    tmp.y < 0.5 ? (tmp.yBoolean = 0) : (tmp.yBoolean = 1);

    if ((tmp.x < 0.5 && tmp.y < 0.5) || (tmp.x >= 0.5 && tmp.y >= 0.5)) {
      tmp.expectedValue = 0;
    } else {
      tmp.expectedValue = 1;
    }

    inputData.push(tmp);
  }
}

function drawGraph(redPoints, bluePoints) {
  var redPointsGraph = {
    x: [],
    y: [],
    mode: "markers",
    marker: {
      color: "rgb(255, 5, 5)",
      size: 5
    }
  };

  var bluePointsGraph = {
    x: [],
    y: [],
    mode: "markers",
    marker: {
      color: "rgb(5, 5, 255)",
      size: 5
    }
  };

  redPoints.forEach(point => {
    redPointsGraph.x.push(point.x);
    redPointsGraph.y.push(point.y);
  });

  bluePoints.forEach(point => {
    bluePointsGraph.x.push(point.x);
    bluePointsGraph.y.push(point.y);
  });

  let data = [];

  data.push(redPointsGraph, bluePointsGraph);

  Plotly.newPlot("myDiv", data);
}
