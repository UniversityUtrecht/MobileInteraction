import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LinearPage } from "../linear/linear";
import { RadialPage } from "../radial/radial";

import ABCJS from "abcjs";

import { MusicProvider } from "../../providers/music/music"
import { DatabaseProvider } from "../../providers/database/database";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  linearPage = LinearPage;
  radialPage = RadialPage;

  constructor(public navCtrl: NavController, public musicCtrl: MusicProvider, public db: DatabaseProvider) {
  }

  fullReset() {
    this.db.setRandomUserID();
    this.musicCtrl.purge();
  }

  myButtonClick() {
    console.log("button clicked");
	this.musicCtrl.test();
  }

  myButtonClick1() {
    console.log("button1 clicked");
	this.musicCtrl.startNotePlay("c4");
  }
  myButtonClick2() {
    console.log("button2 clicked");
	this.musicCtrl.stopNotePlay();
  }
  myButtonClick3() {
    console.log("button3 clicked");
	this.musicCtrl.playWholeSheet();
  }

  myButtonClick4() {
    console.log("button4 clicked");
	ABCJS.renderAbc("drawArea", this.musicCtrl.generateSimpleABCNotation());
  }

  myButtonClick5() {
    console.log("button5 clicked");
	var audio = new Audio('/assets/sound/Listening_task_1.mp3');
	audio.play();
  }

  myButtonClick6() {
    console.log("button6 clicked");
	var audio = new Audio('/assets/sound/Listening_task_2.mp3');
	audio.play();
  }
}
