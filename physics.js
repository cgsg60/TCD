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

const g = -9.8195 * 25;
export let input_cont;         /* Input context */

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
export function isColliding(obj, Land, param) {
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

let velocity_y = 0;

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
  let param = { x: 0, y: 0, z: 0, w: false, r: false}
  let R1 = new vector(obj_1.x + obj_1.width * 0.5, obj_1.y + obj_1.height * 0.5);
  let a = 0;

  obj_1.x -= 2 * input_cont.keys['KeyA']
  obj_1.x += 2 * input_cont.keys['KeyD']

  if (isColliding(obj_1, land, param)) {
    if (param.w == true)
      velocity_y = 0;
    let N = new vector(param.x, param.y)
    obj_1.x += N.x, obj_1.y += N.y;
    if (input_cont.keysClick['Space'] == 1 && param.w == true) {
      velocity_y -= 35 * g * timer.globalDeltaTime;

    }
  }

  
  velocity_y += g * timer.globalDeltaTime;
  obj_1.y -= velocity_y * timer.globalDeltaTime;


  let dtime = timer.globalTime - obj_1.weapon.projectiles.time

  console.log("dtime:", dtime);
 
  if (obj_1.weapon.projectiles.enabled === true) {

    let param1 = { x: 0, y: 0, z: 0, w: false, r: false };

    const p = obj_1.weapon.projectiles;
      
      /* Ballistic movement */
    p.x = obj_1.weapon.projectiles.sx + p.vx * Math.cos(p.angle) * dtime;
    p.y = obj_1.weapon.projectiles.sy + p.vy * Math.sin(p.angle) * dtime + (-g * dtime * dtime) / 2;

    const obj = {x: p.x, y: p.y, width: p.radius * 2, height: p.radius * 2};

    if (isColliding(obj, land, param1)) {
      obj_1.weapon.explode(p.x, p.y);
      obj_1.weapon.projectiles.enabled = false;
    }               
  }
  if (obj_1.weapon.projectiles.enabled === true && dtime > 4) 
    obj_1.weapon.projectiles.enabled = false;
 // Проверка столкновения с врагом
  /*const distToEnemy = Math.sqrt((p.x - enemy.x) ** 2 + (p.y - enemy.y) ** 2);
  if (distToEnemy < p.radius + enemy.radius) {
      this.explode(p.x, p.y);
      enemy.health -= this.damage;
      this.projectiles.splice(i, 1);*/
}

/* END OF 'physics.js' FILE */
