import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MusicProvider } from "../../providers/music/music";
import { DatabaseProvider, PianoType } from "../../providers/database/database";

import ABCJS from "abcjs";


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

  moveOneRight() {
    if (this.octaveHeights["c"] === this.octaveHeights["b"]) {
      this.octaveHeights["c"]++;
    } else {
      let lastHeight = -1;
      for (let key in this.octaveHeights) {
        if (lastHeight > this.octaveHeights[key]) {
          // stop if key does not exist (c8 is highest possible)
          if(this.octaveHeights[key] === 7 && key === "d") {
            return;
          }
          this.octaveHeights[key] = this.octaveHeights[key]+1;
          return;
        } else {
          lastHeight = this.octaveHeights[key];
        }
      }
    }
  }
  moveOneLeft() {
    if (this.octaveHeights["b"] === this.octaveHeights["c"]) {
      this.octaveHeights["b"]--;
    } else {
      let lastHeight = -1;
      let lastKey = "";
      for (let key in this.octaveHeights) {
        if (lastHeight > this.octaveHeights[key]) {
          // stop if key does not exist (b0 is lowest possible)
          if(this.octaveHeights[key] === 0 && key === "a") {
            return;
          }
          this.octaveHeights[lastKey] = this.octaveHeights[lastKey]-1;
          return;
        } else {
          lastHeight = this.octaveHeights[key];
          lastKey = key;
        }
      }
    }
  }

  currentDuration:number = 0;
  maxDuration:number = 100;
  currentNoteDuration:string = "0";

  keyPressed:boolean = false;
  timeId:number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public musicCtrl: MusicProvider, private db: DatabaseProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RadialPage');
    ABCJS.renderAbc("drawScore", this.musicCtrl.generateSimpleABCNotation(), {scale : 0.9, viewportHorizontal : true, scrollHorizontal : true});
  }

  undoNote() {
    this.musicCtrl.undoLastNote();
    ABCJS.renderAbc("drawScore", this.musicCtrl.generateSimpleABCNotation(), {scale : 0.9, viewportHorizontal : true, scrollHorizontal : true});
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
      //event.stopPropagation(); // avoid double-playing for touch/mouse events
      //event.preventDefault();
      this.musicCtrl.startNotePlay(note);
  }

  stopNotePlay(event: Event) {
      console.log("stopped note");
      //event.stopPropagation(); // avoid double-playing for touch/mouse events
      //event.preventDefault();
      this.musicCtrl.stopNotePlay();
      ABCJS.renderAbc("drawScore", this.musicCtrl.generateSimpleABCNotation(), {scale : 0.9, viewportHorizontal : true, scrollHorizontal : true});
  }

  finish() {
    // Send results to log server
    this.db.upload(PianoType.radial, this.musicCtrl.getCurrentPerformance());

    // Purge sheet music
    this.musicCtrl.purge();

    // Return to main menu
    this.navCtrl.pop();
  }

}
