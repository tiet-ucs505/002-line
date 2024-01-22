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
  const {height:H, width: W} = canvasEl
  // const obj = {
  //   H: H,
  //   W: W
  // }
  // console.log(obj)
  console.log({H,W})

  const canvas = new CanvasImage('#myCanvas')
  console.log(canvas)

  const p0 = [0,0]
  const p1 = [45,32]
  const N = 100

  const linePixels = (
    getLineVecs(p0, p1, N)
      .map(([x,y]) => (
	new Pixel(x,y,255,255,255,255)
      ))
  )

  // const pixel = new Pixel(102,45,255,255,255,255)
  // console.log(pixel)

  linePixels.forEach(
    (pixel) => {
      canvas.setPixel(pixel)
    }
  )

  // pixel.x = 103
  // pixel.y = 46
  // canvas.setPixel(pixel)

  canvas.flush()

  // testA()
  // testFunctional()
}

function truncLerp1(x0, x1, t) {
  return Math.ceil((1-t)*x0 + t*x1)
}

function truncLerpVec(p0, p1, t) {
  const D = p0.length
  return (
    [...Array(D).keys()]
      .map(j=>truncLerp1(p0[j], p1[j], t))
  )
}

function getLineVecs(p0, p1, N) {
  
  return (
    [...Array(1+N).keys()]
      .map(i=>truncLerpVec(p0, p1, (i/N)))
  )
}

function getLinePoints(x0, y0, x1, y1, N) {
  return (
    [...Array(1+N).keys()]
      .map(i=>([
	truncLerp1(x0, x1, (i/N)),
	truncLerp1(y0, y1, (i/N)),
	// Math.ceil((1-(i/N))*x0 + (i/N)*x1),
	// Math.ceil((1-(i/N))*y0 + (i/N)*y1),
      ]))
  )
}

// console.log(
//   [
//     [0,45,0,32,0.3],
//     truncLerp(0,45,0,32,0.3)
//   ]
// )

// console.log(
//   [
//     [0,0,45,32,10],
//     getLinePoints(0,0,45,32,10)
//   ]
// )
// console.log(
//   [
//     [[0,0],[45,32],10],
//     getLineVecs([0,0], [45,32], 10)
//   ]
// )

docReady(main)
