import { Component, ViewChild } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { MusicProvider } from "../../providers/music/music";
import { DatabaseProvider, PianoType } from "../../providers/database/database";

import ABCJS from "abcjs";
import { BehaviorSubject } from "rxjs/Rx";

let dialValue: BehaviorSubject<number>;
let dialManualChange: boolean = false;
let mouseMoveGlobal;

let scoreOptions = {
  scale : 0.9,
  viewportHorizontal : true,
  staffwidth: 300,
  add_classes: true
};

/**
 * If value > 0, return 1. Else return 0.
 */
function turnBinary(value: number) {
  if (value > 0) {
    return 1;
  } else {
    return 0
  }
}

/**
 * This function was taken from:
 * https://stackoverflow.com/a/16179977
 */
function dec2hex(dec) {
  return Number(parseInt( dec , 10)).toString(16);
}

function keyNumberToString(key: number) {
  let keyString: string;
  if (key === 1) {
    keyString = "A";
  } else if (key === 2) {
    keyString = "B";
  } else if (key === 3) {
    keyString = "C";
  } else if (key === 4) {
    keyString = "D";
  } else if (key === 5) {
    keyString = "E";
  } else if (key === 6) {
    keyString = "F";
  } else {
    keyString = "G";
  }
  return keyString;
}

/**
 * This function was adapted from:
 * https://stackoverflow.com/a/34663032
 */
function createDial(){

  /** fullScreenCanvas.js begin **/
  var canvas = (function(){
    var centerCircleBB = document.getElementById("rest_x5F_s").getBoundingClientRect();
    var canvas: any = document.getElementById("canv");
    if(canvas !== null){
      document.body.removeChild(canvas);
    }
    // creates a blank image with 2d context
    canvas = document.createElement("canvas");
    canvas.id = "canv";
    // canvas.style.background = "#AAA";
    canvas.width = centerCircleBB['width'];
    canvas.height = centerCircleBB['height'];
    canvas.style.position = "absolute";
    // console.log(centerCircleBB); // DEBUG
    canvas.style.top = centerCircleBB['top'] + "px";
    canvas.style.left = centerCircleBB['left'] + "px";
    canvas.style.zIndex = 1000;
    canvas.ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    return canvas;
  })();
  var ctx = canvas.ctx;

  /** fullScreenCanvas.js end **/
  /** MouseFull.js begin **/

  var canvasMouseCallBack = undefined;  // if needed
  var mouse = (function(){
    function cursorControl(cursor){
      if(cursor !== this.lastCursor){
        if(cursor !== "default"){
          this.lastCursor = cursor;
        }
      }
    }
    function update(){
      if(this.element !== undefined){
        this.element.style.cursor = this.lastCursor;
        this.lastCursor = "default";
      }
    }
    var mouse = {
      x : 0, y : 0, w : 0, alt : false, shift : false, ctrl : false,
      interfaceId : 1, buttonLastRaw : 0,  buttonRaw : 0,
      over : false,  // mouse is over the element
      bm : [1, 2, 4, 6, 5, 3], // masks for setting and clearing button raw bits;
      getInterfaceId : function () { return this.interfaceId++; }, // For UI functions
      mousePrivate : 0,
      lastCursor: "default",
      setCursor : cursorControl,
      frameEnd : update,
      startMouse:undefined,
      element : undefined,
      dragging: false,
      type: "mouse"
    };
    function mouseMove(e) {
      var t = e.type, m = mouse;
      let radialPiano = document.getElementById("radialPiano");
      let canv = document.getElementById("canv");

      // console.log(e); // DEBUG

      let rawX, rawY;
      if (e.clientX) {
        m.type = "mouse";
        rawX = e.clientX; rawY = e.clientY
      } else if (e.touches) {
        m.type = "touch";
        if (e.touches.length > 0) {
          rawX = e.touches[0].clientX;
          rawY = e.touches[0].clientY;
        }
      } else {
        console.log("unknown event", e);
        return; //unknown
      }

      let onTarget;
      if (rawX && rawY) {
        let rect = canv.getBoundingClientRect();
        let underneath = document.elementFromPoint(rawX, rawY);
        let targetID;
        if (underneath) {
          targetID = underneath.id;
        }
        onTarget = targetID === "canv";
        if (!onTarget) {
          m.over = false;
          m.x = rawX; m.y = rawY; // use overall x/y
        } else {
          m.over = true;
          m.x = rawX - rect.left; // use element-specific x/y
          m.y = rawY - rect.top;
        }
      }

      if (m.x === undefined) { m.x = e.clientX; m.y = e.clientY; }
      m.alt = e.altKey;m.shift = e.shiftKey;m.ctrl = e.ctrlKey;
      if ((t === "mousedown" || t === "touchstart") && onTarget) { m.buttonRaw |= m.bm[e.which-1]; radialPiano.classList.add("deactivated"); m.dragging = true;
      } else if (t === "mouseup" || t === "touchend" && m.dragging === true) { m.buttonRaw &= m.bm[e.which + 2]; radialPiano.classList.remove("deactivated"); m.dragging = false;
      } else if (t === "mouseout") { m.over = false; // m.buttonRaw = 0;
      } else if (t === "mouseover") { m.over = true;
      } // else if (t === "mousewheel") { m.w = e.wheelDelta;
      // } else if (t === "DOMMouseScroll") { m.w = -e.detail;}
      if (canvasMouseCallBack) { canvasMouseCallBack(m.x, m.y); }
      e.preventDefault();
    }
    mouseMoveGlobal = mouseMove;
    function startMouse(element){
      if(element === undefined){
        element = document;
      }
      mouse.element = element;

      "mousemove,mousedown,mouseup,mouseout,mouseover,touchmove,touchstart,touchend".split(",").forEach( // mousewheel,DOMMouseScroll
        function(n){document.addEventListener(n, mouseMove);});
      element.addEventListener("contextmenu", function (e) {e.preventDefault();}, false);
    }
    mouse.startMouse = startMouse;
    return mouse;
  })();
  if(typeof canvas !== "undefined"){
    mouse.startMouse(canvas);
  }else{
    mouse.startMouse();
  }
  /** MouseFull.js end **/

  var w = canvas.width;
  var h = canvas.height;
  // var ix = Math.ceil(Math.min(w, h) / 20);
  const PI2 = Math.PI * 2;


  // following three function are for drawing, updating, and on to set floating value

  // draw circular control needs to be bound to a circular control object
  function drawCirControl(){
    var c, r, r1, r2, x, y, w, a;
    c = this.ctx;
    r = this.radius1;
    r1 = this.radius2;

    c.lineWidth = w = Math.abs(r - r1);
    r2 = Math.min(r, r1) + w / 2;
    c.strokeStyle = this.borderColour;
    c.beginPath();
    c.arc(this.x, this.y, r2, 0, Math.PI * 2)
    c.stroke();
    c.strokeStyle = this.colour;
    c.lineWidth = w - this.border * 2;
    c.beginPath();
    c.arc(this.x, this.y, r2, 0, Math.PI * 2)
    c.stroke();
    // if more than one turn between min and max then also display progress as one turn
    if(Math.abs(this.startAng - this.endAng) > PI2){
      c.lineCap = "round";
      c.strokeStyle = this.lineColour;
      c.lineWidth = (w - this.border * 6)/2;
      c.beginPath();
      a = (this.floatingRaw - this.startAng) % PI2 + this.startAng;
      c.arc(this.x, this.y, r2 + (w - this.border * 6)/4, this.startAng, a)
      c.stroke();

      a = this.startAng + ((this.floatingValue - this.min) / (this.max - this.min)) * PI2;
      c.lineCap = "round";
      c.strokeStyle = this.lineInnerColour;
      c.lineWidth = (w - this.border * 6)/2;
      c.beginPath();
      c.arc(this.x, this.y, r2 - (w - this.border * 6)/4, this.startAng, a)
      c.stroke();


    }else{
      c.lineCap = "round";
      c.strokeStyle = this.lineColour;
      c.lineWidth = w - this.border * 6;
      c.beginPath();
      c.arc(this.x, this.y, r2, this.startAng, this.floatingRaw)
      c.stroke();
    }


    x = Math.cos(this.raw) * r2 + this.x;
    y = Math.sin(this.raw) * r2 + this.y;

    c.lineWidth = this.border;
    c.strokeStyle = this.borderColour;
    c.fillStyle = this.colour;
    c.beginPath();
    c.arc(x, y, (w * this.handleSize)/2, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    c.font = this.font;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(Math.round(this.value), this.x, this.y);
  }

  // Update by checking mouse position and setting cursor and controling the dragging
  // circular control needs to be bound to a circular control object
  function updateCircularControl(){
    if (dialManualChange) {
      dialManualChange = false;
      this.value = dialValue.getValue();
      this.floatingValue = dialValue.getValue();
      this.floatingRaw = (this.floatingValue / (this.max - this.min)) * (this.endAng - this.startAng) + this.startAng;
    }

    var r, r1, r2, x, y, dist, ang, a, w, mouseOver;
    r = this.radius1;
    r1 = this.radius2;
    w = Math.abs(r - r1);
    r2 = Math.min(r, r1) + w / 2;
    if(!this.floating){
      this.floatingValue = this.value;
    }
    this.raw = (this.value / (this.max - this.min)) * (this.endAng - this.startAng) + this.startAng;
    this.floatingRaw = (this.floatingValue / (this.max - this.min)) * (this.endAng - this.startAng) + this.startAng;
    x = Math.cos(this.raw) * r2 + this.x;
    y = Math.sin(this.raw) * r2 + this.y;
    mouseOver = false;
    dist = Math.sqrt(Math.pow(x - mouse.x, 2) + Math.pow(y - mouse.y, 2));


    let isClicking;
    if (mouse.type === "mouse") {
      isClicking = (this.mouse.buttonRaw & 1) === 1;
    } else {
      isClicking = mouse.dragging;
    }

    // console.log(mouse.dragging); // DEBUG
    if(this.mouse.mousePrivate === 0 || this.mouse.mousePrivate === this.id){
      if(dist < w * this.handleSize || mouse.dragging){
        this.mouse.setCursor("pointer");
        mouseOver = true;
        this.mouse.mousePrivate = this.id;
        if((isClicking || true) && !mouse.dragging){
          mouse.dragging = true;
          this.lastAng = (this.raw + PI2) % PI2;
        }else{
          if (!isClicking) {
            mouse.dragging = false;
          } else{
            // get the angle to the mouse
            let currentAnchorElement;
            let centerX; let centerY;
            if (mouse.over) {
              // if on top of small circle (based on container offset mouse placement)
              currentAnchorElement = document.getElementById("rest_x5F_s").getBoundingClientRect();
              centerX = currentAnchorElement['width'] / 2;
              centerY = currentAnchorElement['height'] / 2;
            } else {
              // if on top of large circle or elsewhere (based on page mouse placement)
              currentAnchorElement = document.getElementById("radialPiano").getBoundingClientRect();
              centerX = currentAnchorElement.left + currentAnchorElement['width'] / 2;
              centerY = currentAnchorElement.top + currentAnchorElement['height'] / 2;
            }

            ang = ((Math.atan2(mouse.y - centerY, mouse.x - centerX)) + PI2) % PI2;
            // get the delta from last angle
            a = (ang - this.lastAng);
            // check that is has not cycled and adjust acordingly
            if(a < -Math.PI * (3/2)){
              a += PI2
            }
            if(a > Math.PI * (3/2)){
              a -= PI2
            }
            // set last angle
            this.lastAng = ang;
            // set the raw vale
            this.raw += a;
            this.value =  ((this.raw - this.startAng) / (this.endAng - this.startAng)) * (this.max - this.min) + this.min
            this.value = Math.min(this.max, Math.max(this.min, this.value));
            dialValue.next(this.value);
            if(!this.floating){
              this.floatingValue = this.value;
            }
            // recalculate the raw value
            this.raw = (this.value / (this.max - this.min)) * (this.endAng - this.startAng) + this.startAng;
            this.floatingRaw = (this.floatingValue / (this.max - this.min)) * (this.endAng - this.startAng) + this.startAng;
          }
        }
      }
    }
    if(! mouseOver && this.mouse.mousePrivate === this.id ){
      this.mouse.mousePrivate = 0;
    }
  }

  // set circular control floating value needs to be bound to a circular control object
  function setCircularFloatingValue(v){
    this.floatingValue = v;
    this.floatingRaw = (this.floatingValue / (this.max - this.min)) * (this.endAng - this.startAng) + this.startAng;
  }


  // create a circular control
  // x, y is the center pos;
  // min max is the min max values
  // r1 r2 are inner and outer radius
  // ctx is the canvas context to draw to
  // mouse is the mouse object. This is a custom mouse object provided
  //       in the demo.

  function createCircularControl(x,y,min,max,r1,r2,ctx,mouse){
    var s, fontSize;
    s = Math.min(r1,r2);
    fontSize = Math.ceil(s/2);
    var control = {
      raw : 0,                    // the raw angle to draw the control handle ar
      floatingRaw : 0,            // if the actuale value floats independent of control position
      lastAng : 0,
      x : x,                      // center of control
      y : y,
      min : min,                  // min and max values
      max : max,
      value : 21,                  // value of control
      floatingValue : 0,
      startAng : -Math.PI/2,      // start angle
      endAng : Math.PI * (3/2),   // end angle
      radius1 : r1,               // inner and outer angles
      radius2 : r2,
      border : 1,                 // border radius
      colour : "white",           // inner colour
      borderColour : "black",     // border colour
      lineColour : "#5AF",
      lineInnerColour : "#5AF",
      font : fontSize + "px Arial Black",  // font for center display
      handleSize : 1.5,           // handle size aas ratio to control width
      floating : false,
      draw : drawCirControl,      // function to draw control
      ctx : ctx,                  // get the context to draw to
      mouse : mouse,              // set the mouse
      id : mouse.getInterfaceId(), // get an ID for this control
      update : updateCircularControl,  // updates the control
      setFloatingValue : setCircularFloatingValue,
    }
    return control;
  }


  // create the controls
  var cont1 = createCircularControl(w/2, h/2, 0, 45, w/2, 0, ctx, mouse);

  // set up top left control extra attributes
  // It has 10 rotations between min and max
  cont1.startAng =  -Math.PI/2;
  cont1.endAng =  -Math.PI/2 + PI2 * 6 + (PI2 / 7)*3;
  cont1.handleSize = 1;
  cont1.lineInnerColour = "#8C5";

  // Updates all
  function update(){
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0, 0, w, h);

    cont1.update();
    cont1.draw();

    if(!STOP){
      requestAnimationFrame(update);
    }else{
      var canv = document.getElementById("canv");
      if(canv !== null){
        document.body.removeChild(canv);
      }
      STOP = false;
    }
    mouse.frameEnd();

  }

  update();

}

var STOP = false;
function resizeEvent(){
  createDial();
}


/**
 * Generated class for the RadialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-radial',
  templateUrl: 'radial.html',
})
export class RadialPage {
  octaveHeights: object = {
    "c": 4,
    "d": 4,
    "e": 4,
    "f": 4,
    "g": 4,
    "a": 3,
    "b": 3
  };

  tunes: any;

  @ViewChild('scoreScroller') scoreScroller: any;

  moveToKey(absKey: number) {
    // check if within range
    if (absKey < 0 || absKey > 51) {
      return;
    }

    let octave = Math.floor(absKey / 7); // 19 / 7 = 2
    let relKey = absKey - 7 * octave; // 19 - 7 * 2 = 6
    // result = 3
    this.octaveHeights = {
      "c": octave + 1 + turnBinary(Math.floor(relKey / 3)),
      "d": octave + 1 + turnBinary(Math.floor(relKey / 4)),
      "e": octave + 1 + turnBinary(Math.floor(relKey / 5)),
      "f": octave + 1 + turnBinary(Math.floor(relKey / 6)),
      "g": octave + 1 + turnBinary(Math.floor(relKey / 7)),
      "a": octave + turnBinary(Math.floor(relKey / 1)),
      "b": octave + turnBinary(Math.floor(relKey / 2))
    };

    this.colorKeys(relKey);
  }

  /**
   * Input is highest key currently available, as e.g. 1 as "a".
   */
  colorKeys(highestKey: number) {
    let currentKey = highestKey;
    for (let i = 0; i < 8; i++) {

      let color_part_dec = 255 - i * 10;
      let color_part_hex = dec2hex(color_part_dec);
      let color = "#" + color_part_hex + color_part_hex + color_part_hex;

      document.getElementById(keyNumberToString(currentKey)).getElementsByTagName("path")[0].style.fill = color;
      // console.log(currentKey, keyNumberToString(currentKey), color); // DEBUG

      if(currentKey === 0) {
        currentKey = 7;
      } else {
        currentKey = --currentKey;
      }
    }
  }

  moveAllUp() {
    // Check if valid
    if(this.octaveHeights["d"] === 7) {
      return;
    }

    for (let key in this.octaveHeights) {
      this.octaveHeights[key] = this.octaveHeights[key]+1;
    }

    // Propagate to dial element
    dialManualChange = true;
    dialValue.next(dialValue.getValue() + 7);
  }
  moveAllDown() {
    // Check if valid
    if(this.octaveHeights["g"] === 1) {
      return;
    }

    for (let key in this.octaveHeights) {
      this.octaveHeights[key] = this.octaveHeights[key]-1;
    }

    // Propagate to dial element
    dialManualChange = true;
    dialValue.next(dialValue.getValue() - 7);
  }

  currentDuration:number = 0;
  maxDuration:number = 100;
  currentNoteDuration:string = "0";

  keyPressed:boolean = false;
  timeId:number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public musicCtrl: MusicProvider, private db: DatabaseProvider, public loadingCtrl: LoadingController) {
    dialValue = new BehaviorSubject<number>(21);
    // console.log(dialValue); // DEBUG
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad RadialPage'); // DEBUG
    this.tunes = ABCJS.renderAbc("drawScore", this.musicCtrl.generateSimpleABCNotation(), scoreOptions);

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    // Wait a bit for locations to finalise
    setTimeout(() => {
      window.addEventListener("resize",resizeEvent);
      createDial();
      loading.dismiss();
    }, 1000);

    dialValue.subscribe((value: number) => {
      // console.log(value); // DEBUG
      this.moveToKey(Math.floor(value));
    })
  }

  ionViewWillLeave() {
    "mousemove,mousedown,mouseup,mouseout,mouseover,touchmove,touchstart,touchend".split(",").forEach( // mousewheel,DOMMouseScroll
      function(n){document.removeEventListener(n, mouseMoveGlobal);});
    let canvas = document.getElementById("canv");
    document.body.removeChild(canvas);
  }

  undoNote() {
    this.musicCtrl.undoLastNote();
    this.tunes = ABCJS.renderAbc("drawScore", this.musicCtrl.generateSimpleABCNotation(), scoreOptions);
  }

  updateDurationProgressBar(){
      this.keyPressed = true;
      this.timeId = setInterval(() => {
         this.updateBar();
      }, 100);
  }

  updateBar(){
    this.currentDuration=this.musicCtrl.getCurrentPlayingNotePercentage();
    /** console.log('current duration: '+ this.currentDuration); */
    if(this.currentDuration>=0&&this.currentDuration<25){
        this.currentNoteDuration = "1/8";
    }
    else if (this.currentDuration>=25&&this.currentDuration<50){
        this.currentNoteDuration = "1/4";
    }
    else if(this.currentDuration>=50&&this.currentDuration<100){
        this.currentNoteDuration = "1/2";
    }
    else if(this.currentDuration>=100){
        this.currentNoteDuration = "1";
    }
  }

  stopProgressBar(){
      this.keyPressed = false;
      clearInterval(this.timeId);
      this.currentDuration= 0;
      this.currentNoteDuration = "0";
  }

  startNotePlay(event: Event, note: string) {
      console.log(note + " started");
      event.stopPropagation(); // avoid double-playing for touch/mouse events
      event.preventDefault();
      this.musicCtrl.startNotePlay(note);
  }

  stopNotePlay(event: Event) {
      console.log("stopped note");
      event.stopPropagation(); // avoid double-playing for touch/mouse events
      event.preventDefault();
      this.musicCtrl.stopNotePlay();
      this.tunes = ABCJS.renderAbc("drawScore", this.musicCtrl.generateSimpleABCNotation(), scoreOptions);
      this.scroll(1000,0);
  }

  easeInOutCubic (t: number) {
    /*
     * Easing Functions - inspired from http://gizma.com/easing/
     * only considering the t value for the range [0, 1] => [0, 1]
     * https://gist.github.com/gre/1650294
     */
    return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1
  }

  /**
   * Taken from https://gist.github.com/sgotre/e070ef5cce1c778a6380d4c139047e13
   * @param {number} x
   * @param {number} y
   */
  scroll(x: number,y:number) {

    // create an animation
    const fps = 120; // Frames per second.. consider using good value depending on your device
    const duration = 300; //animation duration in ms

    const frameLength = Math.floor(duration/fps);
    const frames = Math.floor(duration/frameLength);

    const fromX = this.scoreScroller._scrollContent.nativeElement.scrollLeft;
    const fromY = this.scoreScroller._scrollContent.nativeElement.scrollTop;
    const diffX = x - fromX;
    const diffY = y - fromY;


    const stepScrollX = diffX/frames;
    const stepScrollY = diffY/frames;



    let i = 0;
    let interval = setInterval(() => {
      i++;
      const scrollToX = fromX + (i * stepScrollX * this.easeInOutCubic(i/frames) );
      const scrollToY = fromY + (i * stepScrollY * this.easeInOutCubic(i/frames) );
      this.scoreScroller._scrollContent.nativeElement.scroll( scrollToX , scrollToY);
      if (i >= frames) {
        clearInterval(interval);
      }
    }, frameLength)

  }

  finish() {
    // Send results to log server
    // Check if actually played
    let currentPerf = this.musicCtrl.getCurrentPerformance();
    console.log(currentPerf);
    if (currentPerf.finalSheetMusic.length <= 12) {
      alert("You do not have anything to commit yet.");
      return;
    }
    this.db.upload(PianoType.radial, currentPerf);

    // Purge sheet music
    this.musicCtrl.purge();

    // Return to main menu
    this.navCtrl.pop();
  }

  back() {
    // Purge sheet music
    this.musicCtrl.purge();
    // Return to main menu
    this.navCtrl.pop();
  }

  playFragment(audioBite: number) {
    var audio = new Audio('/assets/sound/Listening_task_' + audioBite + '.mp3');
    audio.play();
  }

  playSheetMusic() {
    ABCJS.startAnimation(document.getElementById("drawScore"), this.tunes[0], {
      showCursor: true,
      bpm: 120,
    });
    this.musicCtrl.playWholeSheet();
  }
}
