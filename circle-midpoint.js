main()

// ----------------------------------------------------
// Main
// ----------------------------------------------------
function main() {
  const canvas = document.querySelector('#myCanvas')
  console.log(canvas.getBoundingClientRect())
  let px, py, cx, cy, r

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

  cx = 102
  cy = 102
  r = 50
  const circlePoints = collectPointsOnCircle(cx, cy, r)
  setPixels(circlePoints, imData, W, H)
  flush({ctx, imData, x0, y0})
}

// ----------------------------------------------------
// Bresenham's Algorithm
// ----------------------------------------------------

function collectPointsOnOneEighthCircularArc(r) {
  let x = r, y = 0, d = -r + 1.25, points = [[x, y]]
  const ymax = Math.ceil(r * 0.707106781185)

  while (y <= ymax) {
    y += 1
    x -= Number(0 < d)
    points.push([x, y])
    d += ((0 < d)
	  ? (2*(y-x) + 5)
	  : (2*y + 3))
  }

  return points
}

function collectPointsOnCircle(x0, y0, r) {
  let points
  const copyOctants = ([x,y]) => ([
    [x, y],
    [x, -y],
    [-x, y],
    [-x, -y],
    [y, x],
    [y, -x],
    [-y, x],
    [-y, -x],
  ])
  const spreadOut = (result, eightPoints) => (
    [...result, ...eightPoints]
  )
  const translateOrigin = ([x, y]) => ([x+x0, y+y0])

  points = collectPointsOnOneEighthCircularArc(r)

  points = points.map(copyOctants)
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
