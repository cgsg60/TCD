let stc, din;
let startTime;
let x = 0, y = 0;
let ground, ava;

let IsRight = IsLeft = IsUp = IsDown = false;

let player = {
  x: 200,
  y: 500,
  width: 50,
  height: 50,
  img: ava
}

function isColliding(obj) {
  let pixels = din.getImageData(obj.x, obj.y, obj.width, obj.height).data;

  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] > 0) {
      return true;
    }
  }
  return false; 
  // try {
  //   const imageData = din.getImageData(0, 0, 500, 500);
  //   console.log(imageData.data);
  // } catch (e) {
  //   console.error('Ошибка доступа к данным:', e.message);
  //   // Альтернативная логика обработки
  // }
}

function initGFX(canvas, dincanvas) {
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

function drawScene(canvas, dincanvas) {
  timeFromStart = new Date().getTime() - startTime;

  stc.clearRect(0, 0, canvas.width, canvas.height);
  din.clearRect(0, 0, canvas.width, canvas.height);

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
  
  if (isColliding(player))
    console.log("collide");

  if (IsRight)
    player.x += 2;
  if (IsLeft)
    player.x -= 2;
  if (IsDown)
    player.y += 2;
  if (IsUp)
    player.y -= 2;

  window.requestAnimationFrame(drawScene);
}

function onStart() {
  let canvas = document.getElementById("static-canvas");
  canvas.width = 1900;
  canvas.height = 900;
  let dincanvas = document.getElementById("dinamic-canvas");
  dincanvas.width = canvas.width;
  dincanvas.height = canvas.height;
 
  window.onkeydown = (event) => {
    if (event.code == "KeyA")
      IsLeft = true;
    else if (event.code == "KeyS")
      IsDown = true;
    else if (event.code == "KeyD")
      IsRight = true;
    else if (event.code == "Space")
      IsUp = true;    
  };

  window.onkeyup = (event) => {
    if (event.code == "KeyA")
      IsLeft = false;
    else if (event.code == "KeyS")
      IsDown = false;  
    else if (event.code == "KeyD")
      IsRight = false;
    else if (event.code == "Space")
      IsUp = false;    
  };
  window.onmousedown = (event) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 50;

    din.clearRect(event.x - 26, event.y - 26, 52, 52);
  }


  initGFX(canvas, dincanvas);

  startTime = new Date().getTime();

  drawScene(canvas, dincanvas);
}