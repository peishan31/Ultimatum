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
i=0;
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


  ionViewDidEnter(){
    this.i=0;
  }

  nextround(){

    this.hi=this.navParams.data;
    if (this.hi["gameMode"] == "All same players")
    {
      // Yong Lin's code
      this.itemDoc = this.afs.collection<any>('Professor').doc(this.hi["code"])
      this.item = this.itemDoc.valueChanges();
      this.subscription=this.item.subscribe(res=>{
        if (this.i==0){
          let round=parseInt(res["round"]);
          if (round<9){
            this.i+=1;
            round=round+1;
            this.afs.collection('Professor').doc(this.hi["code"]).update({
              round:round.toString(),
            })
            .then((data) => {
              console.log("Data: ");
              this.navCtrl.setRoot(ProfessorHomePage,true)
            }).catch((err) => {
                console.log("Err: "+err);
                this.item.length=0;
                this.item.subscribe(res=>{
                  this.list.length=0;
                  //console.log(res)
                })
            })
          }
        }
      })
    }
    else if (this.hi["gameMode"] == "All different players")
    {
      // Peishan's code
      // Check how many round it currently is (<10)!
      // Check if users are online/offline
      // Arrange and see how many rounds can players play with the user
      // idkkkkk...
      this.itemDoc = this.afs.collection<any>('Professor').doc(this.hi["gameId"])
      this.item = this.itemDoc.valueChanges();

      this.subscription=this.item.subscribe(res=>{

        if (this.i==0 && this.i<10){
          let round=parseInt(res["round"]);
          round=round+=1;
          this.afs.collection('Professor').doc(this.hi["gameId"]).update({
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
          //let mylist = this.updateCurrentParticipant(hi["gameId"]);
          //console.log("Scoreboard.ts My list: "+ mylist); // just checking if it rlly only update the current user
          // 3. Store users that are currently online (1/2/2020)
          // 4. Sort em such that the position is not repetitive (2/2/2020)
          // 5. Create new document in Game collection (2/2/2020)
          // 6. Move to the next page (????)


        }
        this.i+=1;
      })
    }
  }
}
