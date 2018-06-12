import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LinearPage } from "../pages/linear/linear";
import { RadialPage } from "../pages/radial/radial";
import { LinearPageModule } from "../pages/linear/linear.module";
import { RadialPageModule } from "../pages/radial/radial.module";
import { MusicProvider } from '../providers/music/music';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { DatabaseProvider } from '../providers/database/database';
import { PlayPage } from "../pages/play/play";
import { PlayPageModule } from "../pages/play/play.module";
import { Vibration } from "@ionic-native/vibration";

const firebaseConfig = {
  apiKey: "AIzaSyCHTvtcAKXhyyFufCPUFxj1GoAJlm-5Rsg",
  authDomain: "hazelnote-10ab2.firebaseapp.com",
  databaseURL: "https://hazelnote-10ab2.firebaseio.com",
  projectId: "hazelnote-10ab2",
  storageBucket: "hazelnote-10ab2.appspot.com",
  messagingSenderId: "802874862515"
};

export class CustomHammerConfig extends HammerGestureConfig {
  overrides = {
    'tap': { time: 200 },  // change press delay (max)
    'press': { time: 201 }  // change press delay (min)
  }
}

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    LinearPageModule,
    RadialPageModule,
    PlayPageModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LinearPage,
    RadialPage,
    PlayPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MusicProvider,
    DatabaseProvider,
    Vibration,
    { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }
  ]
})
export class AppModule {}
