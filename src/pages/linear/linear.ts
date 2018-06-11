import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MusicProvider } from "../../providers/music/music";

import ABCJS from "abcjs";
import { DatabaseProvider, PianoType } from "../../providers/database/database";
import { Vibration } from "@ionic-native/vibration";

let scoreOptions = {
  scale : 0.9,
  viewportHorizontal : true,
  staffwidth: 300,
  add_classes: true
};

/**
 * Generated class for the LinearPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-linear',
  templateUrl: 'linear.html',
})
export class LinearPage {

  currentDuration:number = 0;
  maxDuration:number = 100;
  currentNoteDuration:string = "0";

  keyPressed:boolean = false;
  timeId:number = 0;

  tunes: any;

    @ViewChild('scoreScroller') scoreScroller: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public musicCtrl: MusicProvider, private db: DatabaseProvider, private vibration: Vibration) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LinearPage');
    this.tunes = ABCJS.renderAbc("drawScore", this.musicCtrl.generateSimpleABCNotation(), scoreOptions);
  }

  updateDurationProgressBar(){
    this.timeId = setInterval(() => {
       this.updateBar();
    }, 100);
  }

  updateBar(){
    this.currentDuration=this.musicCtrl.getCurrentPlayingNotePercentage()
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
    clearInterval(this.timeId);
    this.currentDuration= 0;
    this.currentNoteDuration = "0";
  }

  undoNote() {
    this.musicCtrl.undoLastNote();
    this.tunes = ABCJS.renderAbc("drawScore", this.musicCtrl.generateSimpleABCNotation(), scoreOptions);
}

  startNotePlay(event: Event, note: string) {
    this.keyPressed = true;
    this.updateDurationProgressBar();
    console.log(note + " started");
    event.stopPropagation(); // avoid double-playing for touch/mouse events
    event.preventDefault();
    this.musicCtrl.startNotePlay(note);
    if (this.db.vibrationOn) {
      this.vibration.vibrate(1000);
    }
  }

  stopNotePlay(event: Event) {
    if (!this.keyPressed) {
      return;
    }
    this.keyPressed = false;
    this.stopProgressBar();

    console.log("stopped note");
    event.stopPropagation(); // avoid double-playing for touch/mouse events
    event.preventDefault();
    this.musicCtrl.stopNotePlay();
    this.tunes = ABCJS.renderAbc("drawScore", this.musicCtrl.generateSimpleABCNotation(), scoreOptions);
    this.scroll(10000,0);
    if (this.db.vibrationOn) {
       this.vibration.vibrate(0);
    }
  }
  scroll(x: number,y:number) {
      // wait a few ms
      setTimeout(() => {
        this.scoreScroller._scrollContent.nativeElement.scroll(x, 0);
      }, 30)
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
    this.db.upload(PianoType.linear, currentPerf);

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
