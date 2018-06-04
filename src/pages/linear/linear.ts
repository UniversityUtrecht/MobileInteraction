import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MusicProvider } from "../../providers/music/music";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public musicCtrl: MusicProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LinearPage');
  }

  startNotePlay(event: Event, note: string) {
    // console.log(event);
    event.stopPropagation(); // avoid double-playing for touch/mouse events
    this.musicCtrl.startNotePlay(note);
  }

  stopNotePlay() {
    this.musicCtrl.stopNotePlay()
  }

}
