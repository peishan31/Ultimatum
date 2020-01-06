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
    
     } }  })
 
     }
 
    //console.log("Coming from user-presence-status 2: "+ this.list)
    return this.list;
    /*{
      mylist: this.list,
      mystudentnum: this.studentnum
    };*/
  }
}
