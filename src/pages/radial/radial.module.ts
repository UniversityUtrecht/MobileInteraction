import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RadialPage } from './radial';
import {RoundProgressModule} from 'angular-svg-round-progressbar';

@NgModule({
  declarations: [
    RadialPage,
  ],
  imports: [
    IonicPageModule.forChild(RadialPage),
    RoundProgressModule
  ],
})
export class RadialPageModule {}
