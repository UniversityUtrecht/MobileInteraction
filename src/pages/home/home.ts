import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LinearPage } from "../linear/linear";
import { RadialPage } from "../radial/radial";

import { MusicProvider } from "../../providers/music/music"
import { DatabaseProvider } from "../../providers/database/database";
import { PlayPage } from "../play/play";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  linearPage = LinearPage;
  radialPage = RadialPage;
  playPage = PlayPage;

  constructor(public navCtrl: NavController, public musicCtrl: MusicProvider, public db: DatabaseProvider) {
  }

  fullReset() {
    this.db.setRandomUserID();
    this.musicCtrl.purge();
  }

  toggleVibration() {
    this.db.vibrationOn = !this.db.vibrationOn;
  }
}
