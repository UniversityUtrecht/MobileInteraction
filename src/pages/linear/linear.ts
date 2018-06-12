import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MusicProvider } from "../../providers/music/music";

import ABCJS from "abcjs";
import { DatabaseProvider, PianoType } from "../../providers/database/database";
import { Vibration } from "@ionic-native/vibration";
import { Navbar } from 'ionic-angular';

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
  @ViewChild('pianoScroller') pianoScroller: any;
  @ViewChild(Navbar) navBar: Navbar;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public musicCtrl: MusicProvider, private db: DatabaseProvider, private vibration: Vibration) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LinearPage');
    this.tunes = ABCJS.renderAbc("drawScore", this.musicCtrl.generateSimpleABCNotation(), scoreOptions);

    this.navBar.backButtonClick = (e:UIEvent) => {
      // Purge sheet music
      this.musicCtrl.purge();
      // Return to main menu
      this.navCtrl.pop();
    };

    // Listen to key presses
    this.timeId = setInterval(() => {
      if (this.keyPressed) {
        this.updateBar();
      } else {
        this.currentDuration= 0;
        this.currentNoteDuration = "0";
      }
    }, 100);

    // Go to middle of piano at start
    let pianoContainer = document.getElementById("piano-container");
    pianoContainer.scrollIntoView({ behavior: "smooth" });
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

  undoNote() {
    this.musicCtrl.undoLastNote();
    this.tunes = ABCJS.renderAbc("drawScore", this.musicCtrl.generateSimpleABCNotation(), scoreOptions);
  }

  oneOctaveDown() {
    // Get length of single octave
    let pianoContainer = document.getElementById("piano-container");
    let octaveWidth = pianoContainer.getBoundingClientRect().width / 7;

    // Move one octave down
    this.pianoScroller._scrollContent.nativeElement.scroll(this.pianoScroller._scrollContent.nativeElement.scrollLeft - octaveWidth, 0);
  }
  oneOctaveUp() {
    // Get length of single octave
    let pianoContainer = document.getElementById("piano-container");
    let octaveWidth = pianoContainer.getBoundingClientRect().width / 7;

    // Move one octave up
    this.pianoScroller._scrollContent.nativeElement.scroll(this.pianoScroller._scrollContent.nativeElement.scrollLeft + octaveWidth, 0);

  }

  startNotePlay(event: Event, note: string) {
    this.keyPressed = true;
    console.log(note + " started");
    this.musicCtrl.startNotePlay(note);

    if (this.db.vibrationOn) {
      this.vibration.vibrate(1000);
    }

    // event.stopPropagation(); // avoid double-playing for touch/mouse events
    // event.preventDefault();
  }

  stopNotePlay(event: Event) {
    if (!this.keyPressed) {
      return;
    }
    this.keyPressed = false;
    console.log("stopped note");

    this.musicCtrl.stopNotePlay();

    this.tunes = ABCJS.renderAbc("drawScore", this.musicCtrl.generateSimpleABCNotation(), scoreOptions);
    this.scroll(10000,0);

    if (this.db.vibrationOn) {
       this.vibration.vibrate(0);
    }

    // event.stopPropagation(); // avoid double-playing for touch/mouse events
    // event.preventDefault();
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
