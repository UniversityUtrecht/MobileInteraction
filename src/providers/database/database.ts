import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/Rx';
import randomWords from 'random-words';
import { ToastController } from "ionic-angular";

export enum PianoType {radial="radial", linear="linear"}

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
  userID: BehaviorSubject<string>;
  vibrationOn: boolean = true;

  setUserID(id: string) {
    this.userID.next(id);
  }

  setRandomUserID() {
    this.userID.next(randomWords({ exactly: 3, join: '-' }));
  }

  constructor(private firebase: AngularFirestore, private toast: ToastController) {
    this.userID = new BehaviorSubject("NOT_SET");
  }

  upload(type: PianoType, object: Object) {
    this.firebase.collection(type).doc(this.userID.getValue() + "-" + genTimestamp()).set(object).then(() => {
        let toast = this.toast.create({
          message: 'Successfully submitted',
          duration: 3000,
          position: 'top',
          cssClass: "goodToast"
        });
        toast.present();
      }
    ).catch(() => {
      let toast = this.toast.create({
        message: 'ERROR SUBMITTING',
        duration: 10000,
        position: 'top',
        cssClass: "badToast"
      });
      toast.present();
    });
  }
}

function genTimestamp() {
  const today = new Date();
  let dd:any = today.getDate();
  let mm:any = today.getMonth()+1; //January is 0!
  let h:any = today.getHours();
  let m:any = today.getMinutes();
  let s:any = today.getSeconds();

  const yyyy = today.getFullYear();
  if(dd<10){
    dd='0'+dd;
  }
  if(mm<10){
    mm='0'+mm;
  }
  if(h<10){
    h='0'+h;
  }
  if(m<10){
    m='0'+m;
  }
  if(s<10){
    s='0'+s;
  }
  return "" + yyyy + mm + dd + h + m + s;
}
