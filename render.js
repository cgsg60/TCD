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
 * LAST UPDATE : 20.06.2025
 * NOTE        : Module prefix 'tcd'.
 *
 * No part of this file may be changed without agreement of
 * Computer Graphics Support Group of 30 Phys-Math Lyceum
 */

import { Timer } from "./timer.js";
import { simulation } from "./physics.js";
import { physics_init } from "./physics.js";

let Player = JSON.parse(sessionStorage.getItem('tcd_player')); /* Client player */
let dyn;                                                       /* dynamic canvas context */
let ground, ava;                                               /* temmoprary objects */
export let stc;                                                /* static canvac context*/

let spriteSheet = new Image(); /* Anim sprite */
spriteSheet.src = 'anim.png';
ava = new Image();             /* Gravatar ctx */
ava.src = Player.gravatarCTX;

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

/* Draw animation function.
 * ARGUMENTS:
 *   None.
 * RETURNS:
 *   (VOID) None.
 */
function drawAnim() {
    let currentFrame = 0; 
    stc.clearRect(0, 0, stc.width, stc.height);
    stc.drawImage(spriteSheet,
        currentFrame * 67, 0,
        67, 54, 
        Player.x - 7, Player.y,
        67, 54 
    );
    currentFrame = (currentFrame + 1) % 4;
} /* End of 'drawAnim' function */

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
    dyn.drawImage(ground, 0, 0, 1900, 900);
  };
    spriteSheet.onload = function() {
      setInterval(drawAnim(), 300000);
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
  simulation(Player, dyn);

  /* Set static background image */
  let img = document.getElementById("background");
  stc.drawImage(img, 0, 0, 1900, 900);

  /* Set static player image */
  stc.beginPath();
  stc.arc(Player.x + Player.width * 0.5, Player.y + Player.height * 0.5, Player.width * 0.5, 0, Math.PI * 2);
  stc.closePath();
  stc.save();
  stc.clip();
  stc.drawImage(ava, Player.x, Player.y, Player.width, Player.height);
  stc.restore();

  setInterval(drawAnim(), 30000)

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
