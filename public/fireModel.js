let forest = {
  X: 50,
  Y: 50,
  propTree: 0.5,
  propTree2: 0.01,
  propBurn: 0.0001,
  t: [], // 0 = nothing, 1 = tree, 2 = burning tree
  c: ["rgb(255,255,255)", "rgb(0,255,0)", "rgb(255,0,0)"],
};

// generate map
for (let i = 0; i < forest.X; i++) {
  forest.t[i] = [];
  for (let j = 0; j < forest.Y; j++) {
    forest.t[i][j] = Math.random() < forest.propTree ? 1 : 0;
  }
}

function afterLoad(forest) {
  let canvas = document.getElementById("canvas");
  let c = canvas.getContext("2d");

  for (let i = 0; i < forest.X; i++) {
    for (let j = 0; j < forest.Y; j++) {
      c.fillStyle = forest.c[forest.t[i][j]];
      c.fillRect(10 * j, 10 * i, 10 * j + 9, 10 * i + 9);
    }
  }

  //console.log(forest);

  //debugger;
}

function doStep(forest) {
  let to = [];
  for (let i = 0; i < forest.Y; i++) {
    to[i] = forest.t[i].slice(0);
  }

  //indices outside the array are undefined; which converts to 0=empty on forced typecast
  for (let i = 0; i < forest.X; i++) {
    for (let j = 0; j < forest.Y; j++) {
      if (0 == to[i][j]) {
        // if there is nothing at this coordinates, create a new tree with some probability.

        forest.t[i][j] = Math.random() < forest.propTree2 ? 1 : 0;
      } else if (1 == to[i][j]) {
        if (
          (i > 0 && 2 == to[i - 1][j]) ||
          (i < forest.Y - 1 && 2 == to[i + 1][j]) ||
          (j > 0 && 2 == to[i][j - 1]) ||
          (j < forest.X - 1 && 2 == to[i][j + 1])
        ) {
          //make tree burning if his neighbor is burning.
          forest.t[i][j] = 2;
        } else {
          // or start fire with some probability.
          forest.t[i][j] = Math.random() < forest.propBurn ? 2 : 1;
        }
      } else if (2 == to[i][j]) {
        //If it burns, it gets empty.
        forest.t[i][j] = 0;
      }
    }
  }
}

export function forrestFire() {
  // its basically while(true) with 100ms delay for each loop.
  window.setInterval(function () {
    doStep(forest);
    afterLoad(forest);
  }, 100);
}
