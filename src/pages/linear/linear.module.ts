import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LinearPage } from './linear';

@NgModule({
  declarations: [
    LinearPage,
  ],
  imports: [
    IonicPageModule.forChild(LinearPage),
  ],
})
export class LinearPageModule {}
