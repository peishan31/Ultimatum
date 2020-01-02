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

  updateCurrentParticipant(gameId) { // Real time update of current participant in the game. ## not working
    console.log("Weeeee Game code: " + gameId);
    // Real time update of current participant in the game.
    this.itemDoc = this.afs.collection<any>('Participant')
    this.item = this.itemDoc.valueChanges();
    this.item.length=0;
    this.item.subscribe(res=>{
      this.list.length=0;
      //console.log(res)

      // Peishan
      for (let i=0; i<res.length;i++){

        const personRefs: firebase.database.Reference = firebase.database().ref(`/` + "User" + `/` + res[i].UUID + `/`);

        personRefs.on('value', personSnapshot => {

          this.myPerson = personSnapshot.val();
          if ((this.myPerson != null) || (this.myPerson != undefined)){

            if (this.myPerson["online"] == true) { // stores only the online users

              if (res[i].gameId==gameId){

                this.list.push(res[i].username);
              }
            }
            this.studentnum = this.list.length;
          }
        });

      }
      //console.log("Coming from user-presence-status: "+ this.list)
    })
    //console.log("Coming from user-presence-status 2: "+ this.list)
    return this.list;
    /*{
      mylist: this.list,
      mystudentnum: this.studentnum
    };*/
  }
}
