/***************************************************************
 * Copyright (C) 2025
 *    Computer Graphics Support Group of 30 Phys-Math Lyceum
 ***************************************************************/

/* FILE NAME   : input.js
 * PURPOSE     : Tough Cave Divers project.
 *               Input module.
 * PROGRAMMER  : CGSG'2024.
 *               Arsentev Artemy (AA4),
 *               Nechaev Vladimir (VN4).
 * LAST UPDATE : 18.06.2025
 * NOTE        : Module prefix 'tcd'.
 *
 * No part of this file may be changed without agreement of
 * Computer Graphics Support Group of 30 Phys-Math Lyceum
 */

const D2R = degrees => degrees * Math.PI / 180; /* Translate degrees to radians */
const R2D = radians => radians * 180 / Math.PI; /* Translate radians to degrees */

/* Count distance between 2 points function.
 * ARGUMENTS:
 *   - first point:
 *       p1;
 *   - second point:
 *       p2;
 * RETURNS:
 *   (NUM) distance.
 */
function distance(p1, p2) {
  return Math.sqrt(Math.pow(p1.clientX - p2.clientX, 2) + Math.pow(p1.clientY - p2.clientY, 2));
} /* End of 'distance' function */

/* Input class */
export class input {
  /* Input contsructor function.
  * ARGUMENTS:
  *   - context:
  *       stk;
  * RETURNS:
  *   (VOID) None.
  */
  constructor(stk) {
    //gl.canvas.addEventListener('click', (e) => this.onClick(e));
    stk.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    stk.canvas.addEventListener('mousewheel', (e) => this.onMouseWheel(e));
    stk.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    stk.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    stk.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    if ('ontouchstart' in document.documentElement) {
      stk.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
      stk.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
      stk.canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
    }

    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));

    this.mX = 0;
    this.mY = 0;
    this.mZ = 0;
    this.mDx = 0;
    this.mDy = 0;
    this.mDz = 0;
    this.mButtons = [0, 0, 0, 0, 0];
    this.mButtonsOld = [0, 0, 0, 0, 0];
    this.mButtonsClick = [0, 0, 0, 0, 0];

    // Zoom specific
    this.scaling = false;
    this.dist = 0;
    this.scale_factor = 1.0;
    this.curr_scale = 1.0;
    this.max_zoom = 8.0;
    this.min_zoom = 0.5;


    this.keys = [];
    this.keysOld = [];
    this.keysClick = [];
    [
      "Enter", "Backspace",
      "Delete", "Space", "Tab", "Escape", "ArrowLeft", "ArrowUp", "ArrowRight",
      "ArrowDown", "Shift", "Control", "Alt", "ShiftLeft", "ShiftRight", "ControlLeft",
      "ControlRight", "PageUp", "PageDown", "End", "Home",
      "Digit0", "Digit1",
      "KeyA", "KeyD", "KeyW", "KeyS",
      "Numpad0", "NumpadMultiply",
      "F1",
    ].forEach(key => {
      this.keys[key] = 0;
      this.keysOld[key] = 0;
      this.keysClick[key] = 0;
    });

    this.shiftKey = false;
    this.altKey = false;
    this.ctrlKey = false;
    this.moveflag = false;
    this.jumpflag = false;
    this.weaponflag = true;
    this.harpoonflag = false;

    this.isFirst = true;
  } /* End of 'constructor' function */

  /* Click function.
  * ARGUMENTS:
  *   - event:
  *       e;
  * RETURNS:
  *   (VOID) None.
  */
  onClick(e) {
  } /* End of 'onClick' function */

  /* Touch start function.
  * ARGUMENTS:
  *   - event:
  *       e;
  * RETURNS:
  *   (VOID) None.
  */
  onTouchStart(e) {
    if (e.touches.length == 1)
      this.mButtons[0] = 1;
    else if (e.touches.length == 2) {
      this.mButtons[0] = 0;
      this.mButtons[2] = 1;
    }
    else {
      this.mButtons[0] = 0;
      this.mButtons[2] = 0;
      this.mButtons[1] = 1;
    }
    let
      //x = e.touches[0].clientX - e.target.offsetLeft,
      //y = e.touches[0].clientY - e.target.offsetTop;
      x = e.targetTouches[0].pageX - e.target.offsetLeft,
      y = e.targetTouches[0].pageY - e.target.offsetTop;
    this.mDx = 0;
    this.mDy = 0;
    this.mDz = 0;
    this.mX = x;
    this.mY = y;

    let tt = e.targetTouches;
    if (tt.length >= 2) {
      this.dist = distance(tt[0], tt[1]);
      this.scaling = true;
    } else {
      this.scaling = false;
    }
    //vg.log(`Zoom start: issc:${this.scaling}`);
  } /* End of 'onTouchStart' function */

  /* Touch move function.
  * ARGUMENTS:
  *   - event:
  *       e;
  * RETURNS:
  *   (VOID) None.
  */
  onTouchMove(e) {
    e.preventDefault();

    let
      //x = e.touches[0].clientX - e.target.offsetLeft,
      //y = e.touches[0].clientY - e.target.offsetTop;
      x = e.targetTouches[0].pageX - e.target.offsetLeft,
      y = e.targetTouches[0].pageY - e.target.offsetTop;

    vg.log(`Move: x:${x} y:${y}`);

    //vg.log(`Zoom move: issc:${this.scaling}`);
    let tt = e.targetTouches;
    //vg.log(`0:${tt[0].clientX}, 1:${tt[1].clientX}`);
    if (this.scaling) {
      this.mDz = 0;
      this.curr_scale = (distance(tt[0], tt[1]) / this.dist) * this.scale_factor;

      //vg.log(`Zoom move: sc:${this.curr_scale} (mZ: ${this.mZ}), ${distance(tt[0], tt[1])}/${this.dist}`);
      //if (this.curr_scale > 1.3)
      //  this.mDz = 1;
      //else if (this.curr_scale < 0.8)
      //  this.mDz = -1;
      let d = distance(tt[0], tt[1]);
      if (Math.abs(d - this.dist) > 0) {//47) {
        if (d < this.dist)
          this.mDz = 1 * (d / this.dist), this.dist = d;
        else if (d > this.dist)
          this.mDz = -1 * (this.dist / d), this.dist = d;
        this.mZ += this.mDz;

        this.mDx = x - this.mX;
        this.mDy = y - this.mY;
        this.mX = x;
        this.mY = y;
        return;
      }
    }

    if (this.mButtons[1] == 1) {
      this.mDx = 0;
      this.mDy = 0;
      this.mDz = y - this.mZ;
      this.mX = x;
      this.mY = y;
      this.mZ += this.mDz;
    } else {
      this.mDx = x - this.mX;
      this.mDy = y - this.mY;
      this.mDz = 0;
      this.mX = x;
      this.mY = y;
    }
  } /* End of 'onTouchMove' function */

  /* Touch end function.
  * ARGUMENTS:
  *   - event:
  *       e;
  * RETURNS:
  *   (VOID) None.
  */
  onTouchEnd(e) {
    this.mButtons[0] = 0;
    this.mButtons[1] = 0;
    this.mButtons[2] = 0;
    let
      //x = e.touches[0].clientX - e.target.offsetLeft,
      //y = e.touches[0].clientY - e.target.offsetTop;
      x = e.targetTouches[0].pageX - e.target.offsetLeft,
      y = e.targetTouches[0].pageY - e.target.offsetTop;
    this.mDx = 0;
    this.mDy = 0;
    this.mDz = 0;
    this.mX = x;
    this.mY = y;

    let tt = e.targetTouches;
    if (tt.length < 2) {
      this.scaling = false;
      if (this.curr_scale < this.min_zoom) {
        this.scale_factor = this.min_zoom;
      } else {
        if (this.curr_scale > this.max_zoom) {
          this.scale_factor = this.max_zoom;
        } else {
          this.scale_factor = this.curr_scale;
        }
      }
    } else {
      this.scaling = true;
    }
    //vg.log(`Zoom end: issc:${this.scaling} (mZ: ${this.mZ})`);
  } /* End of 'onTouchMove' function */

  /* Mouse move function.
  * ARGUMENTS:
  *   - event:
  *       e;
  * RETURNS:
  *   (VOID) None.
  */
  onMouseMove(e) {
    let
      dx = e.movementX,
      dy = e.movementY;
    this.mDx = dx;
    this.mDy = dy;
    this.mDz = 0;
    this.mX += dx;
    this.mY += dy;
  } /* End of 'onMouseMove' function */

  /* Mouse wheel function.
  * ARGUMENTS:
  *   - event:
  *       e;
  * RETURNS:
  *   (VOID) None.
  */
  onMouseWheel(e) {
    if (e.wheelDelta != 0)
      e.preventDefault();
    this.mZ += (this.mDz = e.wheelDelta / 120);
  } /* End of 'onMouseWheel' function */

  /* Mouse down function.
  * ARGUMENTS:
  *   - event:
  *       e;
  * RETURNS:
  *   (VOID) None.
  */
  onMouseDown(e) {
    e.preventDefault();
    this.mDx = 0;
    this.mDy = 0;
    this.mDz = 0;

    this.mButtonsOld[e.button] = this.mButtons[e.button];
    this.mButtons[e.button] = 1;
    this.mButtonsClick[e.button] = !this.mButtonsOld[e.button] && this.mButtons[e.button];

    this.shiftKey = e.shiftKey;
    this.altKey = e.altKey;
    this.ctrlKey = e.ctrlKey;
  } /* End of 'onMouseMove' function */

  /* Mouse down function.
  * ARGUMENTS:
  *   - event:
  *       e;
  * RETURNS:
  *   (VOID) None.
  */
  onMouseUp(e) {
    e.preventDefault();
    this.mDx = 0;
    this.mDy = 0;
    this.mDz = 0;

    this.mButtonsOld[e.button] = this.mButtons[e.button];
    this.mButtons[e.button] = 0;
    this.mButtonsClick[e.button] = 0;

    this.shiftKey = e.shiftKey;
    this.altKey = e.altKey;
    this.ctrlKey = e.ctrlKey;
  } /* End of 'onMouseMove' function */

  /* Key down function.
  * ARGUMENTS:
  *   - event:
  *       e;
  * RETURNS:
  *   (VOID) None.
  */
  onKeyDown(e) {
    if (e.target.tagName.toLowerCase() == 'textarea')
      return;
    let focused_element = null;
    if (document.hasFocus() &&
      document.activeElement !== document.body &&
      document.activeElement !== document.documentElement) {
      focused_element = document.activeElement;
      if (focused_element.tagName.toLowerCase() == 'textarea')
        return;
    }
    if (e.code != "F12" && e.code != "F11" && e.code != "KeyR")
      e.preventDefault();
    this.keysOld[e.code] = this.keys[e.code];
    this.keys[e.code] = 1;
    this.keysClick[e.code] = !this.keysOld[e.code] && this.keys[e.code];

   if (e.code == "KeyA" || e.code == "KeyD")
     this.moveflag = true;
   else if (e.code == "Space")
     this.jumpflag = true;
   if (e.code == "KeyQ"){
     this.weaponflag = true;
     this.harpoonflag = false;
   }
   else if (e.code == "KeyE") {
     this.weaponflag = false;
     this.harpoonflag = true;
   }    

    this.shiftKey = e.shiftKey;
    this.altKey = e.altKey;
    this.ctrlKey = e.ctrlKey;
  } /* End of 'onKeyDown' function */

  /* Key up function.
  * ARGUMENTS:
  *   - event:
  *       e;
  * RETURNS:
  *   (VOID) None.
  */
  onKeyUp(e) {
    if (e.target.tagName.toLowerCase() == 'textarea')
      return;
    let focused_element = null;
    if (document.hasFocus() &&
      document.activeElement !== document.body &&
      document.activeElement !== document.documentElement) {
      focused_element = document.activeElement;
      if (focused_element.tagName.toLowerCase() == 'textarea')
        return;
    }
    if (e.code != "F12" && e.code != "F11" && e.code != "KeyR")
      e.preventDefault();
    this.keysOld[e.code] = this.keys[e.code];
    this.keys[e.code] = 0;
    this.keysClick[e.code] = 0;

   if (e.code == "KeyA" || e.code == "KeyD")
     this.moveflag = false;
   else if (e.code == "Space")
     this.jumpflag = false;    

    this.shiftKey = e.shiftKey;
    this.altKey = e.altKey;
    this.ctrlKey = e.ctrlKey;
  } /* End of 'onKeyUp' function */

  /* Reset input function.
  * ARGUMENTS:
  *   None.
  * RETURNS:
  *   (VOID) None.
  */
  reset() {
    //vg.log(`MsDz: ${this.mDz}`);
    this.mDx = 0;
    this.mDy = 0;
    this.mDz = 0;
    this.mButtonsClick.forEach(k => this.mButtonsClick[k] = 0);
    this.keysClick.forEach(k => this.keysClick[k] = 0);

    this.shiftKey = this.keys["ShiftLeft"] || this.keys["ShiftRight"];
    this.altKey = this.keys["AltLeft"] || this.keys["AltRight"];
    this.ctrlKey = this.keys["ControlLeft"] || this.keys["ControlRight"];
  } /* End of reset' function */
} /* End of 'input' class */

/* END OF 'input.js' FILE */
