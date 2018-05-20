import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LinearPage } from "../linear/linear";
import { RadialPage } from "../radial/radial";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  linearPage = LinearPage;
  radialPage = RadialPage;

  constructor(public navCtrl: NavController) {

  }

}
