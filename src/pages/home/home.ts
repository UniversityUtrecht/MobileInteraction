import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LinearPage } from "../linear/linear";
import { RadialPage } from "../radial/radial";

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
}
