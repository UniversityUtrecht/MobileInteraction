import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MusicProvider } from "../../providers/music/music";

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
  octave = 4;

  currentDuration:number = 0;
  maxDuration:number = 100;
  currentNoteDuration:string = "0";

  keyPressed:boolean = false;
  timeId:number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public musicCtrl: MusicProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RadialPage');
  }

   updateDurationProgressBar(){
      this.keyPressed = true;
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
    this.musicCtrl.stopNotePlay()
  }

}
