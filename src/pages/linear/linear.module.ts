import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LinearPage } from './linear';
import {RoundProgressModule} from 'angular-svg-round-progressbar';

@NgModule({
  declarations: [
    LinearPage,
  ],
  imports: [
    IonicPageModule.forChild(LinearPage),
    RoundProgressModule
  ],
})
export class LinearPageModule {}
