import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { ProposerPage } from '../proposer/proposer';
import { RespondantPage } from '../respondant/respondant';
import { NextroundsPage } from '../nextrounds/nextrounds';

/**
 * Generated class for the ResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {
  Proposer:Boolean;
  Responder:Boolean;
  Result:String;
  ResponderName:String;
  ProposerName:String;
  subscription:Subscription;
  retrieveprofessor:any;
  professorcode:Subscription;
  data:any;
  datetime:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,public afs: AngularFirestore) {
    this.data=navParams.data;
    console.log(this.data["GameId"],"PARAMSDATA")
    console.log("RESULT.TS This is my role: "+this.data["Role"]); 
    this.subscription=  this.afs.collection('Game').doc(this.data["FirebaseId"]).valueChanges().subscribe(res=>{
      this.Result=res["responderResponse"];
      this.ProposerName=res["proposerName"];
      this.ResponderName=res["responderName"];
      this.data=navParams.data;
      if (this.data["Role"]=="Proposer"){
        if (this.Result==""){
          this.Proposer=false;
        }
        else{
          this.Proposer=true;

        }
      }
      else{
        this.Responder=true;
      }
      this.professorcode = this.afs.collection('Professor').doc(this.data["GameId"]).valueChanges().subscribe(ress=>{
        this.data=navParams.data;
        //if (res[p].responderUUID == all.UUID && res[p].gameId==all.gamecode) { --> ***GAMECODE TEMP NOT WORKING
        let date=new Date();
        this.datetime=date.toISOString();
        let round=parseInt(res["round"]);
        let changeparse=parseInt(ress["round"]);
        if (round!=changeparse && this.data["Role"]=="Proposer" && res["round"]<5){
            let passnextpg={UUID:res["proposerUUID"],username:res["proposerName"],dateTime:this.datetime,GameId: this.data["GameId"]};
            this.navCtrl.setRoot(ProposerPage,passnextpg);
          }
       else if (round!=changeparse && this.data["Role"]=="Proposer" && res["round"]>=5){
            let passnextpg={UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"]};
             this.navCtrl.setRoot(NextroundsPage,passnextpg)
          }


       else if (round!=changeparse && this.data["Role"]=="Respondant" && res["round"]<5){
          let passnextpg={UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"]};
            this.navCtrl.setRoot(NextroundsPage,passnextpg);
          }
          else if (round!=changeparse && this.data["Role"]=="Respondant" && res["round"]>=5){
            let passnextpg={UUID:res["proposerUUID"],username:res["proposerName"],dateTime:this.datetime,GameId:this.data["GameId"]};
             this.navCtrl.setRoot(ProposerPage,passnextpg)
          }


      })

   });
  }

  ionViewDidLoad() {

  }

 ionViewDidLeave(){
    this.subscription.unsubscribe();
    // this.professorcode.unsubscribe();
  }
}
