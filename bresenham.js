main()

// ----------------------------------------------------
// Main
// ----------------------------------------------------
function main() {
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
  qy = 27
  qx = 200
  qy = 124

  const linePoints = collectPointsOnLineBresenham(
    px, py, qx, qy
  )
  setPixels(linePoints, imData, W, H)
  flush({ctx, imData, x0, y0})
}

// ----------------------------------------------------
// Bresenham's Algorithm
// ----------------------------------------------------
function collectBresenhamBase(px, py, qx, qy) {
  // Ensure that:
  // px < qx and
  // 0 <= qy-py
  // qy-py <= qx-px

  console.log({px, py, qx, qy})

  const points = [[px, py]]
  , dx = qx-px			// is integer
  , dy = qy-py			// is integer
  , b = Math.floor(py - (dy/dx)*px) // truncated 
  , c = 2*dy + dx*(2*b-1)	    // is integer
  , inc = (x, y) => (
    2 * (dx*y - dy*x) < c	// integer arithmetic
      ? 1 : 0
  )

  let [x, y] = [px, py]

  while (x < qx) {
    x += 1
    y += inc(x,y)
    points.push([x, y])
  }

  return points
}

function collectPointsOnLineBresenham(px, py, qx, qy) {
  let isFlippedY = false
  , isFlippedXy = false
  , t = null
  , points = []

  console.log({input: {px, py, qx, qy}})

  if (qx < px)			// Swap
  {
    t = {qx, qy}
    qx = px
    qy = py
    px = t.qx
    py = t.qy
    console.log({swapped: {px, py, qx, qy}})
  }			  // Definitely moving along +X


  if (qy-py < 0)	      // Negative Slope: Flip Y
  { isFlippedY = true
    py = -py
    qy = -qy
    console.log({flippedY: {px, py, qx, qy}})
  }			       // Definitely 0 <= slope

  if (qx-px < qy-py) 		// Steep Slope: Flip XY
  { isFlippedXy = true
    t = { px, qx }
    px = py
    qx = qy
    py = t.px
    qy = t.qx
    console.log({flippedXy: {px, py, qx, qy}})
  }

  points = collectBresenhamBase(px, py, qx, qy)

  if (isFlippedXy) {
    // Unflip XY
    points = points.map(([x, y]) => ([y, x]))
  }

  if (isFlippedY) {
    // Unflip Y
    points = points.map(([x, y]) => ([x, -y]))
  }

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
