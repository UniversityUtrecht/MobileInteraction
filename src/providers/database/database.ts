import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/Rx';
import randomWords from 'random-words';


/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
  userID: BehaviorSubject<string>;

  setUserID(id: string) {
    this.userID.next(id);
  }

  setRandomUserID() {
    this.userID.next(randomWords({ exactly: 3, join: '-' }));
  }

  constructor(private firebase: AngularFirestore) {
    this.userID = new BehaviorSubject("NOT_SET");
  }

  upload(object: Object) {
    this.firebase.collection("radial").doc(this.userID.getValue()).set(object);
  }
}
