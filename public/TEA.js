// f(z) =z^2 + c
// z_0 = 0 => 0^2 + c => z_0 = c
//z_2 =c^2 + c and so on...
// c is complex number so c = a + bi

export function cv9DoTheWork() {
  console.log("Hello from cv9.");

  /////////////canvas actions, not realitive to logic of this task.
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  var id = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  var pixels = id.data;
  /////////////////////////////////////////////////////////
  var bright = 255;

  var maxIterations = 50;

  let m = 2;

  // go pixel by pixel in canvas
  for (let x = 0; x < canvasWidth; x++) {
    for (let y = 0; y < canvasHeight; y++) {
      bright = 0;

      var a = myMap(x, 0, canvasWidth, -2, 2);
      var b = myMap(y, 0, canvasHeight, -2, 2);

      var ca = a;
      var cb = b;

      var n = 0;

      while (n < maxIterations) {
        var aa = a * a - b * b; // real part
        var bb = 2 * a * b; // imaginary part

        // Z_n
        a = aa + ca;
        b = bb + cb;

        // there exists a real number m such that for all n |z_n| <= m (|.| is the absolute value)
        if (Math.abs(a + b) > m) {
          break;
        }
        n++;
      }

      //debugger;

      bright = myMap(n, 0, maxIterations, 0, 255);

      if (n == maxIterations) {
        bright = 0;
      }

      var off = (y * id.width + x) * 4;
      pixels[off] = bright;
      pixels[off + 1] = bright;
      pixels[off + 2] = bright;
      pixels[off + 3] = 255;
    }
  }

  ctx.putImageData(id, 0, 0);
}

function myMap(n, start1, stop1, start2, stop2, withinBounds) {
  // this is actually function map from library p5.js. I didnt want to import whole library just for this function so I just copied this func from their opensource.

  const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return this.constrain(newval, start2, stop2);
  } else {
    return this.constrain(newval, stop2, start2);
  }
}
