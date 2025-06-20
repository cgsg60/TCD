/***************************************************************
 * Copyright (C) 2025
 *    Computer Graphics Support Group of 30 Phys-Math Lyceum
 ***************************************************************/

/* FILE NAME   : physics.js
 * PURPOSE     : Tough Cave Divers project.
 *               Physics module.
 * PROGRAMMER  : CGSG'2024.
 *               Arsentev Artemy (AA4),
 *               Nechaev Vladimir (VN4).
 * LAST UPDATE : 19.06.2025
 * NOTE        : Module prefix 'tcd'.
 *
 * No part of this file may be changed without agreement of
 * Computer Graphics Support Group of 30 Phys-Math Lyceum
 */

import { input } from "./input.js";
import { stc } from "./render.js"
import { timer } from "./render.js"

let input_cont;         /* Input context */
const g = -9.8195 * 30; /* Acceleration of gravity */
let velocity = 0;       /* Velocity */

/***************
** MATH MODULE**
****************/
class vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

/* Sum vectors function.
 * ARGUMENTS:
 *   - first vector:
 *       V1;
 *   - second vector:
 *       V2;
 * RETURNS:
 *   (vector) new vector.
 */
function sumvectors(V1, V2) {
  return new vector(V1.x + V2.x, V1.y + V2.y);
} /* End of 'sumvectors' function */

/* Subtract vectors function.
 * ARGUMENTS:
 *   - first vector:
 *       V1;
 *   - second vector:
 *       V2;
 * RETURNS:
 *   (vector) new vector.
 */
function subvectors(V1, V2) {
  return new vector(V1.x - V2.x, V1.y - V2.y);
} /* End of 'subvectors' function */

/* Multiply vector and number function.
 * ARGUMENTS:
 *   - vector:
 *       V1;
 *   - number:
 *       a;
 * RETURNS:
 *   (vector) new vector.
 */
function multvector(V1, a) {
  return new vector(V1.x * a, V1.y * a);
} /* End of 'multvector' function */

/* Length of vector function.
 * ARGUMENTS:
 *   - vector:
 *       V1;
 * RETURNS:
 *   (NUM) length.
 */
function lenvector(V1) {
  return Math.sqrt(V1.x * V1.x + V1.y * V1.y);
} /* End of 'lenvector' function */

/* Count distance between 2 vectors function.
 * ARGUMENTS:
 *   - first vector:
 *       V1;
 *   - second vector:
 *       V2;
 * RETURNS:
 *   (NUM) distance.
 */
function dist(V1, V2) {
  return Math.sqrt((V1.x - V2.x) * (V1.x - V2.x) + (V1.y - V2.y) * (V1.y - V2.y));
}

/* Check function.
 * ARGUMENTS:
 *   - object thath:
 *       obj;
 *   - Land:
 *       Land;
 *   - Center of the object:
 *       avgpoint;
 * RETURNS:
 *   (BOOL) flag.
 */
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
  avgpoint = V;

  return flag;
} /* End of 'isColliding' function */

/* Init physics function.
 * ARGUMENTS:
 *   None.
 * RETURNS:
 *   (VOID) None.
 */
export function physics_init() {
  input_cont = new input(stc);
} /* End of 'physics_init' function */

/* Enable simulation function.
 * ARGUMENTS:
 *   - Object to simulate:
 *       obj_1;
 *   - Land:
 *       land;
 * RETURNS:
 *   (VOID) None.
 */
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
} /* End of 'simulation' function */

/* END OF 'physics.js' FILE */
