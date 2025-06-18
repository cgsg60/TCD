import { Timer } from "./timer.js";
import { simulation } from "./physics.js";
import { physics_init } from "./physics.js";
let din;
let ground, ava;
export let stc;

let player = {
  x: 500,
  y: 500,
  width: 50,
  height: 50,
  img: ava
}

export let timer = new Timer()

export function initGFX(canvas, dincanvas) {
  stc = canvas.getContext("2d");
  din = dincanvas.getContext("2d");

  const textureImage = new Image();
  textureImage.src = 'background.jpg';

  textureImage.onload = () => {
    let img = document.getElementById("background");
    stc.drawImage(img, 0, 0, 1900, 900);

    ground = document.getElementById("land1");
    //ground.crossOrigin = "Anonymous"
    din.drawImage(ground, 0, 0, 1900, 900);
  };
}

export function drawScene(canvas, dincanvas) {

  timer.response();

  stc.clearRect(0, 0, canvas.width, canvas.height);
  din.clearRect(0, 0, canvas.width, canvas.height);

  simulation(player, null, din);

  //background
  let img = document.getElementById("background");

  stc.drawImage(img, 0, 0, 1900, 900);

  //stc.drawImage(dincanvas, 0, 0);

  player.img = document.getElementById("avatar");
  stc.drawImage(player.img, player.x, player.y, 50, 50);

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
}

export function onStart() {
  let canvas = document.getElementById("static-canvas");
  canvas.width = 1900;
  canvas.height = 900;
  let dincanvas = document.getElementById("dinamic-canvas");
  dincanvas.width = canvas.width;
  dincanvas.height = canvas.height;

  initGFX(canvas, dincanvas);
  physics_init();

  drawScene(canvas, dincanvas);
}
