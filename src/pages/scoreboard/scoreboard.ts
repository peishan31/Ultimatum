import { Component } from '@angular/core';
import { NavController, NavParams, NavOptions } from 'ionic-angular';
import { ProfessorHomePage } from '../professor-home/professor-home';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'page-scoreboard',
  templateUrl: 'scoreboard.html'
})
export class ScoreboardPage {
hi:any;
item:any;
itemDoc:any;
subscription:Subscription
  constructor(public navCtrl: NavController,public navParams:NavParams,public afs:AngularFirestore) {
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
        }
        i+=1;
      })
    }

  }
}
