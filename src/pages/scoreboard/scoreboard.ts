import { Component } from '@angular/core';
import { NavController, NavParams, NavOptions } from 'ionic-angular';
import { ProfessorHomePage } from '../professor-home/professor-home';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { UserPresenceStatusProvider } from '../../providers/user-presence-status/user-presence-status';
import * as firebase from 'firebase';

@Component({
  selector: 'page-scoreboard',
  templateUrl: 'scoreboard.html'
})
export class ScoreboardPage {
hi:any;
item:any;
itemDoc:any;
subscription:Subscription
list=[]
myPerson=[]
studentnum=0;

  constructor(public navCtrl: NavController,
    public navParams:NavParams,
    public afs:AngularFirestore,
    public UserPresenceStatusProvider: UserPresenceStatusProvider
    ) {
    this.hi=navParams.data;
  }

  Home(){
    this.navCtrl.setRoot(ProfessorHomePage);
  }

  nextround(){
    /*
    "gameMode":"All same players"
    */
    let i=0;
    let hi=this.navParams.data;

    if (hi["gameMode"] == "All same players")
    {
      // Yong Lin's code
      this.itemDoc = this.afs.collection<any>('Professor').doc(hi["gameId"])
      this.item = this.itemDoc.valueChanges();
      this.subscription=this.item.subscribe(res=>{
      if (i==0 && i<10){
        let round=parseInt(res["round"]);
        round=round+=1;
        this.afs.collection('Professor').doc(hi["gameId"]).update({
          round:round.toString(),

        })
        .then((data) => {
          console.log("Data: ");
          i=0;
          this.navCtrl.setRoot(ProfessorHomePage,true)

        }).catch((err) => {
          console.log("Err: "+err);
        })
      }
      i+=1;
      })
    }
    else if (hi["gameMode"] == "All different players")
    {
      // Peishan's code
      // Check how many round it currently is (<10)!
      // Check if users are online/offline
      // Arrange and see how many rounds can players play with the user
      // idkkkkk...
      this.itemDoc = this.afs.collection<any>('Professor').doc(hi["gameId"])
      this.item = this.itemDoc.valueChanges();

      this.subscription=this.item.subscribe(res=>{

        if (i==0 && i<10){
          let round=parseInt(res["round"]);
          round=round+=1;
          this.afs.collection('Professor').doc(hi["gameId"]).update({
            round:round.toString(),
          })
          .then((data) => {
            console.log("Data: ");
            i=0;
            this.navCtrl.setRoot(ProfessorHomePage,true)

          }).catch((err) => {
            console.log("Err: "+err);
          })
          // 1. Check if any user(s) disconnect (1/2/2020)
          this.UserPresenceStatusProvider.updateUserPresenceStatus();
          // 2. Update user's presence (1/2/2020)
          let mylist = this.updateCurrentParticipant(hi["gameId"]);
          console.log("Scoreboard.ts My list: "+ mylist); // just checking if it rlly only update the current user
          // 3. Store users that are currently online (1/2/2020)
          // 4. Sort em such that the position is not repetitive (2/2/2020)
          // 5. Create new document in Game collection (2/2/2020)
          // 6. Move to the next page (????)


        }
        i+=1;
      })
    }

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
                console.log("res[i].username: "+ res[i].username);
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
