import {CanvasImage} from '#/CanvasImage.js'
import {Pixel} from '#/Pixel.js'
// import {testA} from '#/A.js'
// import {testFunctional} from '#/functional.js'

function docReady (fn) {
  if (document.readyState === 'complete' ||
      document.readyState === 'interactive') {
    setTimeout(fn, 1)
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

function main () {
  
  console.log('Raghav (Not a student)')

  const canvasEl = document.querySelector('#myCanvas')
  const H = parseFloat(canvasEl.style.height)
  const W = parseFloat(canvasEl.style.width)
  canvasEl.height = H
  canvasEl.width = W

  // const obj = {
  //   H: H,
  //   W: W
  // }
  // console.log(obj)
  console.log({H,W})

  const canvas = new CanvasImage('#myCanvas')
  console.log(canvas)

  const p0 = [120,200]
  const p1 = [50, 90]
  const p3 = [50, 200]
  const p4 = [120, 90]
  drawLineDda(canvas, p0, p1)
  drawLineDda(canvas, p3, p1)
  drawLineDda(canvas, p4, p3)
  drawLineDda(canvas, p0, p4)

  const pts = [[25,45], [95, 32], [108, 135], [49, 152]]
  pts.map(
    (p, i, A) => ([A[i], A[(1+i) % A.length]])
  ).forEach(
    ([p, q]) => drawLineDda(canvas, p, q)
  )

  // testA()
  // testFunctional()
}

function drawLineDda(canvas, p, q) {

  const linePixels = toPixels(dda(p,q))

  linePixels.forEach(
    (pixel) => {
      canvas.setPixel(pixel)
    }
  )

  canvas.flush()
}

function dda([px, py], [qx, qy]) {
  let x = px,
      y = py,
      dx = (qx-px),
      dy = (qy-py),
      S = []

  if (Math.abs(dx) < Math.abs(dy)) {
    // 1 < |slope|
    
    if (dy < 0)
      return dda([qx, qy], [px, py])

    while (y <= qy) {
      S.push([
	Math.floor(x),
	Math.floor(y)
      ])
      y += 1
      x += (dx/dy)
    }

  } else {
    // 0 < |slope| <=1

    if (dx < 0)
      return dda([qx, qy], [px, py])

    while (x <= qx) {
      S.push([
	Math.floor(x),
	Math.floor(y)
      ])
      x += 1
      y += (dy/dx)
    }

  }    

  // while (x <= (qx-px)) {
  //   // !!!CAUTION: The following code is wrong
  //   // S.push([x, y])
  //   // x = Math.floor(1 + x)
  //   // y = Math.floor(m + y)
  //   S.push([
  //     Math.floor(x),
  //     Math.floor(y)
  //   ])
  //   x += 1
  //   y += m
  // }

  return S
}

function toPixels(S) {
  return S.map(
    ([x,y]) =>
    new Pixel(x,y,255,255,255,255)
  )
}

docReady(main)
