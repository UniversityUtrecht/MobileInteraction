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

  constructor(public navCtrl: NavController, public navParams: NavParams, public musicCtrl: MusicProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RadialPage');
  }

}
