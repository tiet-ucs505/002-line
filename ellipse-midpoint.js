main()

// ----------------------------------------------------
// Main
// ----------------------------------------------------
function main() {
  const canvas = document.querySelector('#myCanvas')
  console.log(canvas.getBoundingClientRect())
  let px, py, cx, cy, a, b

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
  // Draw a circle
  // ----------------------------------------------------

  cx = 202
  cy = 102
  a = 100
  b = 50
  const ellipsePoints = collectPointsOnEllipse(cx, cy, a, b)
  setPixels(ellipsePoints, imData, W, H)
  flush({ctx, imData, x0, y0})
}

// ----------------------------------------------------
// Bresenham's Algorithm
// ----------------------------------------------------

function collectPointsOnQuadArcFromX(cx, cy, a, b) {
  let x = a, y = 0, points = [[x, y]]
  let d = b*b*(-a + 0.25) + a*a

  while (2*a*a*y <= 2*b*b*x) {
    y += 1
    x -= Number(0 < d)
    points.push([x, y])
    d += a*a*(2*y + 1) + (
      (0 < d) ? -2*b*b*x : 0
    )
  }

  return points
}

function collectPointsOnEllipse(cx, cy, a, b) {
  let points
  const copyQuadrants = ([x,y]) => ([
    [x, y],
    [x, -y],
    [-x, y],
    [-x, -y],
  ])
  const spreadOut = (result, eightPoints) => (
    [...result, ...eightPoints]
  )
  const translateOrigin = ([x, y]) => ([x+cx, y+cy])
  const flipXy = ([x, y]) => ([y, x])

  points = [
    ...collectPointsOnQuadArcFromX(cx, cy, a, b),
    ...collectPointsOnQuadArcFromX(cy, cx, b, a)
      .map(flipXy)
  ]

  points = points.map(copyQuadrants)
    .reduce(spreadOut)
    .map(translateOrigin)

  return points
}

// ----------------------------------------------------
// Canvas manipulation
// ----------------------------------------------------

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

  // --------------------------------------------------
  // Manipulate the imData
  // --------------------------------------------------

  let offset, pixels

  // Retrieve Image Data as pixels
  pixels = imData.data

  // Compute offset
  offset = (py * W + px) * 4

  // Set pixel value
  pixels.set([r,g,b,a], offset)

  // --------------------------------------------------
  // Data Manipulation ends
  // --------------------------------------------------
}

function flush({ctx, imData, x0, y0}) {

  // --------------------------------------------------
  // Flush
  // --------------------------------------------------
  ctx.putImageData(imData, x0, y0)

}
