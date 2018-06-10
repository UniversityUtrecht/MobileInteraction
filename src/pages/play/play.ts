import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import ABCJS from "abcjs/midi";
import { MusicProvider } from "../../providers/music/music";

let scoreOptions = {
  scale : 0.9,
  viewportHorizontal : true,
  staffwidth: 300,
  add_classes: true
};

@IonicPage()
@Component({
  selector: 'page-play',
  templateUrl: 'play.html',
})
export class PlayPage {
  abcMusic: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, private musicCtrl: MusicProvider) {
  }

  ionViewDidLoad() {
  }

  renderMusic() {
    this.abcMusic = this.abcMusic.replace('8[', '8 \n[');
    console.log(this.abcMusic);
    // ABCJS.renderAbc("drawScore", this.abcMusic, scoreOptions);
    ABCJS.renderMidi(
      "drawScore",
      this.abcMusic,
      { });

    ABCJS.midi.startPlaying(document.querySelector(".abcjs-inline-midi"));
  }

}
