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

  constructor(public navCtrl: NavController, public navParams: NavParams, public musicCtrl: MusicProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RadialPage');
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
