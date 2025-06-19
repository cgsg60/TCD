/***************************************************************
 * Copyright (C) 2025
 *    Computer Graphics Support Group of 30 Phys-Math Lyceum
 ***************************************************************/

/* FILE NAME   : render.js
 * PURPOSE     : Tough Cave Divers project.
 *               Render System module.
 * PROGRAMMER  : CGSG'2024.
 *               Arsentev Artemy (AA4),
 *               Nechaev Vladimir (VN4).
 * LAST UPDATE : 18.06.2025
 * NOTE        : Module prefix 'tcd'.
 *
 * No part of this file may be changed without agreement of
 * Computer Graphics Support Group of 30 Phys-Math Lyceum
 */

import { Timer } from "./timer.js";
import { simulation } from "./physics.js";
import { physics_init } from "./physics.js";

let dyn;         /* dynamic canvas context */
let ground, ava; /* temmoprary objects */
export let stc;  /* static canvac context*/

let player = {
  x: 500,     /* position by X axis */
  y: 500,     /* position by Y axis */
  width: 50,  /* hitbox width */
  height: 50, /* hitbox height */
  img: ava    /* player image */
}

class Resources {
  constructor(name, x, y, w, h, ctx) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.ctx = ctx;
  }

  LoadImg(id) {
    this.ctx = document.getElementById(id);
  }
  CreateImg(src) {
    this.ctx = document.createElement(src);
  }
  DrawImg(canvasCTX) {
    canvasCTX.drawImage(this.ctx, this.x, this.y, this.w, this.h);
  }
}

export let timer = new Timer() /* Timer */

/* Init graphics function.
 * ARGUMENTS:
 *   - static canvas:
 *       canvas;
 *   - dynamic argument:
 *       dyncanvas;
 * RETURNS:
 *   (VOID) None.
 */
export function initGFX(canvas, dyncanvas) {
  /* Get contexts */
  stc = canvas.getContext("2d");
  dyn = dyncanvas.getContext("2d");

  /* Set background */
  const textureImage = new Image();
  textureImage.src = 'background.jpg';

  /* HERE PLACE DYNAMIC IMAGES */
  textureImage.onload = () => {
    let img = document.getElementById("background");
    stc.drawImage(img, 0, 0, 1900, 900);

    /* Set landscape */
    ground = document.getElementById("land1");
<<<<<<< HEAD
    //ground.crossOrigin = "Anonymous"
    din.drawImage(ground, 0, 0, 1900, 3900);
=======
    dyn.drawImage(ground, 0, 0, 1900, 900);
>>>>>>> 152a2ae9d3cc79b9aedb0c3a3e8730ba515c23e9
  };
} /* End of 'initGFX' function */

/* Draw scene function.
 * ARGUMENTS:
 *   - static canvas:
 *       canvas;
 *   - dynamic argument:
 *       dyncanvas;
 * RETURNS:
 *   (VOID) None.
 */
export function drawScene(canvas, dyncanvas) {

  timer.response();

  stc.clearRect(0, 0, canvas.width, canvas.height);
  dyn.clearRect(0, 0, canvas.width, canvas.height);

  /* Enable player simulation module */
  simulation(player, dyn);

  /* Set static background image */
  let img = document.getElementById("background");
<<<<<<< HEAD

  stc.drawImage(img, 0, 0, 1900, 3900);
=======
  stc.drawImage(img, 0, 0, 1900, 900);
>>>>>>> 152a2ae9d3cc79b9aedb0c3a3e8730ba515c23e9

  /* Set static player image */
  player.img = document.getElementById("avatar");
  stc.beginPath();
  stc.arc(player.x + player.width * 0.5, player.y + player.height * 0.5, player.width * 0.5, 0, Math.PI * 2);
  stc.closePath();
  stc.save();
  stc.clip();
  stc.drawImage(player.img, player.x, player.y, player.width, player.height);
  stc.restore();
  /*
    stc.beginPath();
    stc.arc(x, 100, 25, 0, Math.PI * 2);
    stc.closePath();
    stc.clip();
    stc.drawImage(img, x - 25, 100 - 25, 50, 50);
  */
  /*stc.beginPath();
  stc.arc(150, 150, 100, 0, Math.PI * 2);
  stc.fillStyle = 'black';
  stc.fill();
  stc.globalCompositeOperation = 'source-in';

  stc.globalCompositeOperation = 'source-over';*/

  window.requestAnimationFrame(drawScene);
} /* End of 'drawScene' function */

/* Draw scene function.
 * ARGUMENTS:
 *   None.
 * RETURNS:
 *   (VOID) None.
 */
export function onStart() {
  /* Get canvas id */
  let canvas = document.getElementById("static-canvas");
  canvas.width = 1900;
  canvas.height = 900;

  let dyncanvas = document.getElementById("dynamic-canvas");
  dyncanvas.width = canvas.width;
  dyncanvas.height = canvas.height;

  initGFX(canvas, dyncanvas);
  physics_init();

  drawScene(canvas, dyncanvas);
} /* End of 'onStart' function */

/* END OF 'render.js' FILE */
