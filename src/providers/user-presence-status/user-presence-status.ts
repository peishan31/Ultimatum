import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import * as firebase from 'firebase';

/*
  Generated class for the UserPresenceStatusProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserPresenceStatusProvider {
  listUUID = [];
  item:any;
  itemDoc:any;
  list=[];
  myPerson = {};
  studentnum=0;
  code="";

  constructor(
    public http: HttpClient,
    public afs: AngularFirestore,

  ) {
    //console.log('Hello UserPresenceStatusProvider Provider');
  }

  updateUserPresenceStatus(){
    // check if user is offline in real time database - Peishan
    /*
    Note: I am using both real time database and firestore to update
    user's presence.
    OnDisconnect() is only available on real time database.
    Hence, after using OnDisconnect to detect user's presence, I need to update
    the status in real time database as well.
    */
   var ref = firebase.database().ref(`/` + "User" + `/`); // check if there's any changes here
   ref.on('value', snapshot => { // update users that are offline in firestore
     //console.log("snapshot: "+ snapshot);

     if ((snapshot.val()!=null)||(snapshot.val()!=undefined)) {

       this.listUUID = Object.keys(snapshot.val());
       this.listUUID.forEach(indvUUID => {

         //console.log("help: "+ indvUUID);
         var indvRef = firebase.database().ref(`/` + "User" + `/` + indvUUID + `/`);

         indvRef.on('value', snapshot => {

           if ((snapshot.val()!=null) || (snapshot.val()!=undefined))
             if (snapshot.val()["online"] == false) {
                 this.afs.collection('Participant').doc(indvUUID).update({
                   online: false // update user's who have disconnected in firestore
               })
             }
         })
       });
     }
   })
  }

  updateCurrentParticipant() { // Real time update of current participant in the game. ## not working

    
  }
}
