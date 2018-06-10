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
    ABCJS.midi.setSoundFont("/assets/soundfont/");
  }

  ionViewDidLoad() {
  }

  renderMusic() {
    let bpm = 120;
    this.abcMusic = this.abcMusic.replace('8[', '8 \n[');
    console.log(this.abcMusic);

    let tunes = ABCJS.renderAbc("drawScore", this.abcMusic, scoreOptions);

    ABCJS.renderMidi(
      "scoreAudio",
      this.abcMusic,
      {
        qpm: bpm,
        program: 0,
        // animate: { listener: function(abcjsElement, currentEvent, context) {}, target: tunes[0], qpm: bpm },
        inlineControls: {
          hide: true,
        },
      }
    );

    ABCJS.midi.startPlaying(document.querySelector(".abcjs-inline-midi"));

    ABCJS.startAnimation(document.getElementById("drawScore"), tunes[0], {
      showCursor: true,
      bpm: bpm,
    });

  }

}
