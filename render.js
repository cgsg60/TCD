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
import { isColliding } from "./physics.js";
import { input_cont } from "./physics.js";
let Player = JSON.parse(sessionStorage.getItem('tcd_player')); /* Client player */
let dyn;                                                       /* dynamic canvas context */
let ground, ava;                                               /* temmoprary objects */

export let stc;                                                /* static canvac context*/
export let timer = new Timer() /* Timer */

let maincanvas = document.getElementById("dynamic-canvas");;

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

class Cannon {
    constructor() {
      this.projectiles = {};
      this.firePower = 400;
      this.gravity = 0.3;
      this.explosionRadius = 30;
      this.damage = 13;
    }

    fire(startX, startY, targetX, targetY) {
      let Dx = targetX - startX;
      let Dy = targetY - startY;
      let d = Math.sqrt(Dx * Dx + Dy * Dy);

      let sine = Dy / d;
      let cosine = Dx / d;

/*      A = atan2(sine, cosine);

      for (i = 0; i < 7; i++)
      {
        pnts1[i].x = (LONG)(Cx + pnts[i].x * cos(A) - pnts[i].y * sin(A));
        pnts1[i].y = (LONG)(Cy + pnts[i].x * sin(A) + pnts[i].y * cos(A));
      }
      const dx = targetX - startX;
      const dy = targetY - startY;*/
      const angle = Math.atan2(cosine, sine) - Math.PI / 2.0;
      
      this.projectiles = ({
        x: 0,
        y: 0,
        sx: startX,
        sy: startY,
        vx: this.firePower,
        vy: this.firePower,
        angle: -angle,
        radius: 8,
        time: 0,
        enabled: false,
        });
    }

    explode(x, y) {
      // dyn.beginPath();
      // dyn.arc(x, y, this.explosionRadius, 0, Math.PI * 2);
      // dyn.clip();
      // dyn.closePath();
      // dyn.clearRect(0, 0, maincanvas.width, maincanvas.height);
      dyn.clearRect(x - this.explosionRadius, y - this.explosionRadius, this.explosionRadius * 2, this.explosionRadius * 2);
    }
}

let cannon = new Cannon();
Player.weapon = cannon;
cannon.fire(0, 0, 0, 0);

// Бэууу дамашний
maincanvas.addEventListener('click', (e) => {

  if (cannon.projectiles.enabled === false)
  {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    cannon.fire(Player.x + Player.width / 2, Player.y + Player.height / 2, mouseX, mouseY);
    cannon.projectiles.time = timer.globalTime;
    cannon.projectiles.enabled = true;
    cannon.projectiles.sx = Player.x + Player.width / 2;
    cannon.projectiles.sy = Player.y + Player.height / 2;
    console.log("angle:", cannon.projectiles.angle, "mousex:", mouseX, "mousey:", mouseY);
    console.log("Бэууу дамашний!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  }
});

let currentFrame = 0; 
let oldt = 0;

/* Draw animation function.
 * ARGUMENTS:
 *   None.
 * RETURNS:
 *   (VOID) None.
 */
function drawAnim() {
  let t = timer.globalTime;
  
  stc.clearRect(0, 0, stc.width, stc.height);
    stc.drawImage(spriteSheet,
        currentFrame * 71, 0,
        67, 54, 
        Player.x - 7, Player.y,
        67, 54 
    );
    if (t - oldt > 0.3) {
      currentFrame = (currentFrame + 1) % 4;
      oldt = t;
    }
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

  drawAnim();

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

  /* draw cannon */
  if (Player.weapon.projectiles.enabled === true) {
    stc.drawImage(ava, Player.weapon.projectiles.x, Player.weapon.projectiles.y, 10, 10);
  }
  /*updateExplosions();
  drawExplosions();*/


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
