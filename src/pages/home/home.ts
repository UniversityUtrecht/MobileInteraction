import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LinearPage } from "../linear/linear";
import { RadialPage } from "../radial/radial";

import { MusicProvider } from "../../providers/music/music"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  linearPage = LinearPage;
  radialPage = RadialPage;

  constructor(public navCtrl: NavController, public musicCtrl: MusicProvider) {

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

}
