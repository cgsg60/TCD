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
import { push_player } from ".//client.js"
import { pull_player } from ".//client.js"

let Player = JSON.parse(sessionStorage.getItem('tcd_player')); /* Client player */
let Enemy = JSON.parse(sessionStorage.getItem('tcd_enemy'));   /* Client enemy */

let dyn;                                                       /* dynamic canvas context */
let ground, ava;                                               /* temmoprary objects */

export let stc;                                                /* static canvac context*/
export let timer = new Timer()                                 /* Timer */

let maincanvas = document.getElementById("dynamic-canvas");

let spriteSheet = new Image();                                 /* Anim sprite */
spriteSheet.src = 'anim.png';
ava = new Image();                                             /* Gravatar ctx */
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
    dyn.save();
    dyn.globalCompositeOperation = 'destination-out';
    dyn.beginPath();
    dyn.arc(x, y, this.explosionRadius * 1.5, 0, Math.PI * 2);
    dyn.fill();
    dyn.restore();

    //dyn.clearRect(x - this.explosionRadius, y - this.explosionRadius, this.explosionRadius * 2, this.explosionRadius * 2);
  }
}

class Harpoon {
  constructor() {
    this.x = Player.x,
      this.y = Player.y,
      this.width = 20,
      this.height = 20,
      this.angle = 0,
      this.length = 0,
      this.maxLength = 300,
      this.speed = 10,
      this.isFired = false,
      this.isAttached = false,
      this.attachedX = 0,
      this.attachedY = 0,
      this.color = '#2c3e50',
      this.ropeColor = '#7f8c8d'
  };
  fireHarpoon(startX, startY, targetX, targetY) {
    let Dx = targetX - startX;
    let Dy = targetY - startY;
    let d = Math.sqrt(Dx * Dx + Dy * Dy);
    let sine = Dy / d;
    let cosine = Dx / d;
    const angle = Math.atan2(cosine, sine) - Math.PI / 2.0;

    // Начальная позиция гарпуна
    this.angle = -angle;
    this.x = Player.x;
    this.y = Player.y;
    this.length = 0;
    this.isFired = true;
    this.isAttached = false;
  }
  update() {
    // Ограничение игрока в пределах canvas
    //Player.x = Math.max(Player.radius, Math.min(maincanvas.width - Player.radius, Player.x));
    //Player.y = Math.max(Player.radius, Math.min(maincanvas.height - Player.radius, Player.y));
    // Обновление гарпуна
    if (this.isFired) {
      let param = { x: 0, y: 0, z: 0, w: false, r: false }
      // Движение гарпуна
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.length += this.speed;
      // collision
      if (isColliding(this, dyn, param)) {
        this.isAttached = true;
        this.attachedX = this.x;
        this.attachedY = this.y;
      }
      if (!this.isAttached) {
        // Проверка максимальной длины
        if (this.length >= this.maxLength) {
          this.isFired = false;
        }
      } else {
        // Притягивание игрока к точке зацепа
        const dx = this.attachedX - Player.x;
        const dy = this.attachedY - Player.y;

        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 10) {
          Player.x += dx * 0.05;
          Player.y += dy * 0.05;
        } else {
          // Гарпун отцепляется, когда игрок близко
          this.isFired = false;
          this.isAttached = false;
        }
      }
    }
  }
};

let harpoon = new Harpoon(1, 1);
Player.garpunchik = harpoon;

let cannon = new Cannon();
Player.weapon = cannon;
cannon.fire(0, 0, 0, 0);

// Бэууу дамашний
maincanvas.addEventListener('click', (e) => {
  if (Player.weapon.projectiles.enabled === false && input_cont.weaponflag == true) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    cannon.fire(Player.x + Player.width / 2, Player.y + Player.height / 2, mouseX, mouseY);
    cannon.projectiles.time = timer.globalTime;
    cannon.projectiles.enabled = true;
    cannon.projectiles.sx = Player.x + Player.width / 2;
    cannon.projectiles.sy = Player.y + Player.height / 2;
    console.log("angle:", cannon.projectiles.angle, "mousex:", mouseX, "mousey:", mouseY);
  }
  else if (input_cont.harpoonflag == true && Player.garpunchik.isFired == false) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    harpoon.fireHarpoon(Player.x + Player.width / 2, Player.y + Player.height / 2, mouseX, mouseY);
  }
});
/*
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
});*/

let currentFrame = 0;
let oldt = 0;
/* Draw move animation function.
* ARGUMENTS:
*   None.
* RETURNS:
*   (VOID) None.
*/
function drawmoveAnim() {
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
} /* End of 'drawmoveAnim' function */
let currentFrame1 = 0;
let oldt1 = 0;
/* Draw jump animation function.
* ARGUMENTS:
*   None.
* RETURNS:
*   (VOID) None.
*/
function drawjumpAnim() {
  let t = timer.globalTime;
  stc.clearRect(0, 0, stc.width, stc.height);
  stc.drawImage(spriteSheet,
    currentFrame1 * 71, 59,
    67, 54,
    Player.x - 7, Player.y,
    67, 54
  );
  if (t - oldt1 > 0.3) {
    currentFrame1 = (currentFrame1 + 1) % 4;
    oldt1 = t;
  }
} /* End of 'drawjumpAnim' function */
/* Draw idle animation function.
* ARGUMENTS:
*   None.
* RETURNS:
*   (VOID) None.
*/
function drawidleAnim() {
  stc.clearRect(0, 0, stc.width, stc.height);
  stc.drawImage(spriteSheet,
    0, 0,
    67, 54,
    Player.x - 7, Player.y,
    67, 54
  );
} /* End of 'drawidleAnim' function */

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
  spriteSheet.onload = function () {
    setInterval(drawidleAnim(), 300000);
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

  Enemy = pull_player;

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

  /* Set static player image */
  stc.beginPath();
  stc.arc(Enemy.x + Enemy.width * 0.5, Enemy.y + Enemy.height * 0.5, Enemy.width * 0.5, 0, Math.PI * 2);
  stc.closePath();
  stc.save();
  stc.clip();
  stc.drawImage(Enemy.src, Enemy.x, Enemy.y, Enemy.width, Enemy.height);
  stc.restore();

  if (input_cont.moveflag)
    drawmoveAnim();
  else if (input_cont.jumpflag)
    drawjumpAnim();
  else
    drawidleAnim();

  /* draw cannon */
  if (Player.weapon.projectiles.enabled === true) {
    stc.drawImage(ava, Player.weapon.projectiles.x, Player.weapon.projectiles.y, 10, 10);
  }
  /*updateExplosions();
  drawExplosions();*/

  Player.garpunchik.update();

  /* draw garpunchik */
  if (Player.garpunchik.isFired) {
    // Веревка
    stc.beginPath();
    stc.moveTo(Player.x + Player.width / 2, Player.y + Player.height / 2);
    if (Player.garpunchik.isAttached) {
      stc.lineTo(Player.garpunchik.attachedX, Player.garpunchik.attachedY);
    } else {
      stc.lineTo(Player.garpunchik.x, Player.garpunchik.y);
    }
    stc.strokeStyle = Player.garpunchik.ropeColor;
    stc.lineWidth = 2;
    stc.stroke();
    // Наконечник гарпуна
    if (!Player.garpunchik.isAttached) {
      stc.beginPath();
      stc.arc(Player.garpunchik.x, Player.garpunchik.y, 5, 0, Math.PI * 2);
      stc.fillStyle = Player.garpunchik.color;
      stc.fill();
      // Острие гарпуна
      stc.beginPath();
      stc.moveTo(Player.garpunchik.x, Player.garpunchik.y);
      stc.lineTo(
        Player.garpunchik.x + Math.cos(Player.garpunchik.angle) * 15,
        Player.garpunchik.y + Math.sin(Player.garpunchik.angle) * 15
      );
      stc.strokeStyle = Player.garpunchik.color;
      stc.lineWidth = 3;
      stc.stroke();
    }
  }

  push_player = Player;

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
