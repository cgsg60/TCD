import { input } from "./input.js";
import { stc } from "./render.js"
import { timer } from "./render.js"
let input_cont;

const g = -9.8195 * 25;

class vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function sumvectors(V1, V2) {
  return new vector(V1.x + V2.x, V1.y + V2.y);
}

function subvectors(V1, V2) {
  return new vector(V1.x - V2.x, V1.y - V2.y);
}

function multvector(V1, a) {
  return new vector(V1.x * a, V1.y * a);
}

function lenvector(V1) {
  return Math.sqrt(V1.x * V1.x + V1.y * V1.y);
}

function dist(V1, V2) {
  return Math.sqrt((V1.x - V2.x) * (V1.x - V2.x) + (V1.y - V2.y) * (V1.y - V2.y));
}

function isColliding(obj, Land, param) {
  let x = Math.round(obj.x), y = Math.round(obj.y), w = Math.round(obj.width), h = Math.round(obj.height), r = new vector(x + w * 0.5, y + h * 0.5);
  let k = 0, dist_min = 1000000;
  if (x === NaN || y === NaN || x === undefined || y === undefined || w <= 0 || h <= 0) {
    return false;
  }

  let pixels = Land.getImageData(x, y, w, h).data;
  let V = new vector(0, 0);
  let flag = false;

  // for (let i = 3; i < pixels.length; i += 4) {
  //   if (pixels[i] > 0) {
  //     const I = Math.floor(i / 4);
  //     const rx = I % w;
  //     const ry = Math.floor(I / w);
  //     if (dist(new vector(x + rx, y + ry), new vector(x + w * 0.5, y + h * 0.5)) <= w * 0.5) {
  //       flag = true, k++;
  //       V = multvector(sumvectors(V, new vector(x + rx, y + ry)), 0.5)
  //       if (obj.y + 3 * h / 4 < y + ry)
  //         param.w = true;
  //     }
  //   }
  // }

  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] > 0) {
      const I = Math.floor(i / 4);
      const rx = I % w;
      const ry = Math.floor(I / w);
      const Rp = dist(new vector(x + rx, y + ry), r)

      if (Rp <= w * 0.5) {
        flag = true;
        if (Rp < dist_min)
          dist_min = Rp, V.x = x + rx, V.y = y + ry;
        if (obj.y + 3 * h / 4 < y + ry)
          param.w = true;
      }
    }
  }

  let BC = multvector(subvectors(V, r), ((w / 2) / lenvector(subvectors(V, r)) - 1.06))

  param.x = -BC.x
  param.y = -BC.y
  param.z = k;

  return flag;
}

export function physics_init() {
  input_cont = new input(stc);
}

let velocity_y = 0;

export function simulation(obj_1, land) {
  let param = { x: 0, y: 0, z: 0, w: false }
  let R1 = new vector(obj_1.x + obj_1.width * 0.5, obj_1.y + obj_1.height * 0.5);
  let a = 0;

  obj_1.x -= input_cont.keys['KeyA']
  obj_1.x += input_cont.keys['KeyD']

  if (isColliding(obj_1, land, param)) {
    if (param.w == true)
      velocity_y = 0;
    let N = new vector(param.x, param.y)
    obj_1.x += N.x, obj_1.y += N.y;
    if (input_cont.keysClick['Space'] == 1 && param.w == true) {
      velocity_y -= 30 * g * timer.globalDeltaTime;

    }
  }

  velocity_y += g * timer.globalDeltaTime;
  obj_1.y -= velocity_y * timer.globalDeltaTime;

  console.log("velocity:", velocity_y)
}