// ----------------------------------------------------
// Bootstrap
// ----------------------------------------------------

const canvas = document.querySelector('#myCanvas')
console.log(canvas.getBoundingClientRect())
let px, py, qx, qy, N

const {ctx, imData, x0, y0, W, H}
      = getContextAndPixels(canvas)

// ----------------------------------------------------
// Set a pixel
// ----------------------------------------------------

// Pixel index
px = 87
py = 27
console.log({px, py})

setPixel(px, py, imData, W, H)
flush({ctx, imData, x0, y0})

// ----------------------------------------------------
// Draw a line
// ----------------------------------------------------

px = 243
py = 124
qx = 200
qy = 27
N = 1250

const linePoints = collectPointsOnLineDda(px, py, qx, qy, N)
setPixels(linePoints, imData, W, H)
flush({ctx, imData, x0, y0})


// ----------------------------------------------------
// Function Definitions
// ----------------------------------------------------

function collectPointsOnLineDda(px, py, qx, qy)  {
  let dx, dy, inc, x, y

  const S = []

  dx = qx-px
  dy = qy-py
  if (Math.abs(dy) < Math.abs(dx)) {
    // Slope is gentle
    // |m| < 1

    inc = Math.sign(dx)
    x = px
    y = py

    while (inc * x <= inc * qx) {
      S.push([Math.floor(x), Math.floor(y)])
      x += inc
      y += inc * (dy/dx)
    }

  } else {
    
    // Slope is steep
    // |m| >= 1


    inc = Math.sign(dy)
    x = px
    y = py

    while (inc * y <= inc * qy) {
      S.push([Math.floor(x), Math.floor(y)])
      y += inc
      x += inc * (dx/dy)
    }

  }

  return S

}

function collectPointsOnLine2(px, py, qx, qy)  {
  let N
  N = Math.max(Math.abs(py-qy), Math.abs(px-qx))
  N += 1
  return collectPointsOnLine(px, py, qx, qy, N)
}

function collectPointsOnLine(px, py, qx, qy, N) {
  return range(1+N)
    .map(
      (i) =>
      (getLinePointAtT(px, py, qx, qy, (i/N)))
    )
}

function range(N) {
  return [...Array(N).keys()]
}

function getLinePointAtT(px, py, qx, qy, t) {
  let rx, ry
  rx = Math.floor((1-t) * px + t * qx)
  ry = Math.floor((1-t) * py + t * qy)
  return [rx, ry]
}

function setPixels(A, imData, W, H) {
  A.map(([x, y]) => setPixel(x, y, imData, W, H))
}

function getContextAndPixels(canvas) {
  // ----------------------------------------------------
  // Bootstrap
  // ----------------------------------------------------
  const ctx = canvas.getContext('2d')
  const {width: W, height: H} = canvas.getBoundingClientRect()
  const [x0,y0] = [0, 0]
  console.log({x0, y0, W, H})

  const imData = ctx.getImageData(x0,y0,W,H)

  return {ctx, imData, x0, y0, W, H}

}

function setPixel(
  px, py,
  imData, W, H
) {
  let r,g,b,a
  
  // Set color
  r = g = b = a = 255
  console.log({r,g,b,a})

  return setPixelColor(
    px, py,
    r, g, b, a,
    imData, W, H
  )
}

function setPixelColor(
  px, py,
  r, g, b, a,
  imData, W, H
) {

  // ----------------------------------------------------
  // Manipulate the imData
  // ----------------------------------------------------

  let offset, pixels

  // Retrieve Image Data as pixels
  pixels = imData.data

  // Compute offset
  offset = (py * W + px) * 4

  // Set pixel value
  pixels.set([r,g,b,a], offset)

  // ----------------------------------------------------
  // Data Manipulation ends
  // ----------------------------------------------------
}

function flush({ctx, imData, x0, y0}) {

  // ----------------------------------------------------
  // Flush
  // ----------------------------------------------------
  ctx.putImageData(imData, x0, y0)

}

