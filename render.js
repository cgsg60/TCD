let tcd;
let startTime;
let x = 0;

let IsRight = IsLeft = false;

function initGFX(canvas) {
  tcd = canvas.getContext("2d");

  const textureImage = new Image();
  textureImage.src = 'background.jpg';

  textureImage.onload = () => {
    let img = document.getElementById("background");
    tcd.drawImage(img, 0, 0, 1900, 900);
  };
}

function drawScene(canvas) {
  timeFromStart = new Date().getTime() - startTime;

  tcd.clearRect(0, 0, canvas.width, canvas.height);

  //background
  let img = document.getElementById("background");
  tcd.drawImage(img, 0, 0, 1900, 900);

  tcd.fillStyle = 'Blue';
//  tcd.fillRect(x, 100, 50, 50);  

  img = document.getElementById("avatar");

  tcd.beginPath();
  tcd.arc(x, 100, 25, 0, Math.PI * 2);
  tcd.closePath();
  tcd.clip();
  tcd.drawImage(img, x - 25, 100 - 25, 50, 50);

  /*tcd.beginPath();
  tcd.arc(150, 150, 100, 0, Math.PI * 2);
  tcd.fillStyle = 'black';
  tcd.fill();
  tcd.globalCompositeOperation = 'source-in';

  tcd.globalCompositeOperation = 'source-over';*/
  

  if (IsRight)
    x += 2;
  if (IsLeft)
    x -= 2;

  window.requestAnimationFrame(drawScene);
}

function onStart() {
  let canvas = document.getElementById("tcd-canvas");
  canvas.width = 1900;
  canvas.height = 900;

  window.onkeydown = (event) => {
    if (event.code == "KeyA")
      IsLeft = true;
    else if (event.code == "KeyS")
      console.log("S");
    else if (event.code == "KeyD")
      IsRight = true;
    else if (event.code == "Space")
      console.log("space");    
  };

  window.onkeyup = (event) => {
    if (event.code == "KeyA")
      IsLeft = false;
    else if (event.code == "KeyS")
      console.log("S");
    else if (event.code == "KeyD")
      IsRight = false;
    else if (event.code == "Space")
      console.log("space");    
  };


  initGFX(canvas);

  startTime = new Date().getTime();

  drawScene(canvas);
}