import { input } from "./input.js";
import { stc } from "./render.js"

let input_cont;

const g = 9.8195;

class vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function sumvectors(V1, V2) {
  return vector(V1.x + V2.x, V1.y + V2.y);
}

function subvectors(V1, V2) {
  return vector(V1.x - V2.x, V1.y - V2.y);
}

function multvector(V1, a) {
  return vector(V1.x * a, V1.y * a);
}

function lenvector(V1) {
  return Math.sqrt(V1.x * V1.x + V1.y * V1.y);
}

function isColliding(obj, Land, avgpoint) {
  let x = Math.round(obj.x), y = Math.round(obj.y), w = Math.round(obj.width), h = Math.round(obj.height);

  if (x == undefined || y == undefined || width <= 0 || height <= 0) {
    console.error("underfined variables in function 'isColliding'");
  }

  let pixels = Land.getImageData(x, y, w, h).data;
  let V = new vector(0, 0);
  let flag = false;

  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] > 0) {
      flag = true;
      V = multvector(sumvectors(V, new vector(pixels[i].x, pixels[i].y)), 0.5)
    }
  }

  avgpoint = V;

  return flag;
}

export function physics_init() {
  input_cont = new input(stc);
}

export function simulation(obj_1, obj_2, land) {
  let avgV = new vector(0, 0)
  let R1 = new vector(obj_1.x + (obj_1.width - obj_1.x) * 0.5, obj_1.y + (obj_1.height - obj_1.y) * 0.5);
  let velocity = 0;

  obj_1.x -= input_cont.keys['A'];
  obj_1.x += input_cont.keys['D'];

  if (input_cont.keysClick['Space'] == 1) {
    velocity += 2.5 * g * globalDeltaTime;
  }

  if (isColliding(obj_1, land, avgV)) {
    let v = subvectors(R1, avgV)

    obj_1.x += v.x, obj_1.y += v.y
  }

  velocity += g * globalDeltaTime;
  obj_1.y += velocity * globalDeltaTime;
}