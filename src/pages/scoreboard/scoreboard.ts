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
hi:string;
item:any;
itemDoc:any;
subscription:Subscription
  constructor(public navCtrl: NavController,public navParams:NavParams,public afs:AngularFirestore) {
    this.hi=navParams.data;
    console.log(this.hi);
  }

  Home(){
    this.navCtrl.setRoot(ProfessorHomePage);
  }

  nextround(){
    let i=0;
    this.itemDoc = this.afs.collection<any>('Professor').doc(this.hi)
    this.item = this.itemDoc.valueChanges();
    this.subscription=this.item.subscribe(res=>{
      if (i==0){
let round=parseInt(res["round"]);
round=round+=1;
    this.afs.collection('Professor').doc(this.hi).update({
      round:round.toString(),
  
     })
     
    .then((data) => {
      console.log("Data: ");
      i+=1
     
    }).catch((err) => {
      console.log("Err: "+err);
    })
    
     }i+=1   })
 
     }
 
}
