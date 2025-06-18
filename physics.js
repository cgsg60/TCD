import { input } from "./input.js";
import { stc } from "./render.js"
import { timer } from "./render.js"
let input_cont;

const g = -9.8195 * 30;

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

function isColliding(obj, Land, avgpoint) {
  let x = Math.round(obj.x), y = Math.round(obj.y), w = Math.round(obj.width), h = Math.round(obj.height);

  if (x == undefined || y == undefined || w <= 0 || h <= 0) {
    console.error("underfined variables in function 'isColliding'");
  }

  let pixels = Land.getImageData(x, y, w, h).data;
  let V = new vector(0, 0);
  let flag = false;

  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] > 0) {
      const I = Math.floor(i / 4);
      const rx = I % w;
      const ry = Math.floor(I / w);
      if (dist(new vector(x + rx, y + ry), new vector(x + w * 0.5, y + h * 0.5)) <= w * 0.5) {
        flag = true;
        V = multvector(sumvectors(V, new vector(x + rx, y + ry)), 0.5)
      }
    }
  }

  avgpoint.x = V.x;
  avgpoint.y = V.y;

  return flag;
}

export function physics_init() {
  input_cont = new input(stc);
}

let velocity = 0;

export function simulation(obj_1, land) {
  let avgV = new vector(0, 0)
  let R1 = new vector(obj_1.x + obj_1.width * 0.5, obj_1.y + obj_1.height * 0.5);
  let a = 0;

  obj_1.x -= 2 * input_cont.keys['KeyA'];
  obj_1.x += 2 * input_cont.keys['KeyD'];
  obj_1.y -= 2 * input_cont.keys['KeyW'];
  obj_1.y += 2 * input_cont.keys['KeyS'];

  for (let i = 0; i < 52; i++) {
    if (isColliding(obj_1, land, avgV)) {
      let N = subvectors(R1, avgV)
      velocity = 0;
      N = multvector(N, 0.5 / lenvector(N))
      obj_1.x += N.x, obj_1.y += N.y;
      if (input_cont.keysClick['Space'] == 1) {
        velocity -= 50 * g * timer.globalDeltaTime;
      }
    }
  }
  velocity += g * timer.globalDeltaTime;
  obj_1.y -= velocity * timer.globalDeltaTime;

  console.log("velocity:", velocity, "   acceleration:", a)
}