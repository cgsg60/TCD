let gl;
let startTime;

function initGL(canvas) {
  gl = canvas.getContext("webgl2");
  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;
}

const shaderFs = `#version 300 es
precision highp float;
layout (location = 0) out vec4 o_color;

uniform float u_time;

void main()
{
  o_color = vec4(1, 1, 0, 1);
}`;

const shaderVs = `#version 300 es
precision highp float;

layout (location = 0) in vec2 InPosition;

void main() {
  gl_Position = vec4(InPosition, 0, 1);
}`;

function getShader(shaderStr, type) {
const shader = gl.createShader(type);

gl.shaderSource(shader, shaderStr);
gl.compileShader(shader);

if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
  alert(gl.getShaderInfoLog(shader));
}

return shader;
}

let u_time_location;

function initShaders() {
function loadShaderText(uri) {
  return fetch(uri)
  .then((response) => {
      if (!response.ok) {
      throw "Resource not found";
      }
      return response.text();
  })
  .then((text) => {
      return text;
  });
}

Promise.all([
  loadShaderText("vertex.glsl"),
  loadShaderText("fragment.glsl"),
])
  .then((shaders) => {
  console.log(shaders);
  })
  .catch((error) => {
  console.log(error);
  });

const fs = getShader(shaderFs, gl.FRAGMENT_SHADER);
const vs = getShader(shaderVs, gl.VERTEX_SHADER);

const program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  alert("Program linkage error");
}

gl.useProgram(program);

u_time_location = gl.getUniformLocation(program, "u_time");
}

let vertexBuffer;

function initBuffer() {
  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  vertices = [-1, -1, 3, -1, -1, 3];
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      gl.STATIC_DRAW
  );
}

function drawScene() {
  gl.clearColor(0, 0, 0, 1);
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  timeFromStart = new Date().getTime() - startTime;

  gl.drawArrays(gl.TRIANGLES, 0, 3);
  window.requestAnimationFrame(drawScene);
}

function onStart() {
  let canvas = document.getElementById("webgl-canvas");

  canvas.onkeydown = (ev) => {
    if (ev.KeyA)
      console.log("A");
  };

  initGL(canvas);
  initShaders();
  initBuffer();

  startTime = new Date().getTime();

  drawScene();
}