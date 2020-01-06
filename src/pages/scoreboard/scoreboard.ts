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
    this.itemDoc = this.afs.collection<any>('Professor').doc(this.hi)
    this.item = this.itemDoc.valueChanges();
    this.subscription=this.item.subscribe(res=>{
      if (this.i==0){
        let round=parseInt(res["round"]);
        if (round<9){
          this.i+=1;
          round=round+1;
          this.afs.collection('Professor').doc(this.hi).update({
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
}
