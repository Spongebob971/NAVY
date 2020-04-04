//import { testFunc } from "./test.js";
//import { myGraph } from "./soma.js";
import { birdAglorithm } from "./bird.js";
import { antAlgo } from "./ant.js";
//import { fireFly } from "./fireFly.js";
import { paretovka } from "./paretovka.js";
import { perceptron } from "./perceptron.js";
import { cv3XorDoTheWork } from "./cv3_XOR_neuronka.js";
import { cv4HopfieldNetwork } from "./cv4HopfieldNetwork.js";
import { cv5FindTheCheese } from "./cv5_findTheCheese.js";
import { cv7doTheWork } from "./cv7_snowFlakes.js";

///////////////////BIA/////////////////////////////////////////////////////////////
//Soma;
//myGraph();
//birdAglorithm();
//antAlgo();
//fireFly();
//paretovka();

///NAVY///////////////
//var iterations = document.getElementById("IterationsId");
//var iterationValue = iterations.options[iterations.selectedIndex].value;

document.getElementById("SnowflakesPatternsId").onchange = function() {
  cv7ListenerFunction();
};

document.getElementById("IterationsId").onchange = function() {
  cv7ListenerFunction();
};

document.getElementById("XorBtn").onclick = function() {
  cv3XorDoTheWork();
};

//perceptron();
//cv3XorDoTheWork();
//cv4HopfieldNetwork();
//cv5FindTheCheese();

function cv7ListenerFunction() {
  var patterns = document.getElementById("SnowflakesPatternsId");
  var selectedPattern = patterns.selectedIndex;

  var interations = document.getElementById("IterationsId");
  var amountOfIterations = interations.selectedIndex;

  cv7doTheWork(amountOfIterations + 1, selectedPattern + 1);
}
