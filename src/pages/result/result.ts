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

  itemDoc: any;
  item: any;
  itemm: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public afs: AngularFirestore) {
    this.data=navParams.data;
    console.log(this.data["GameId"],"PARAMSDATA")
    console.log("RESULT.TS This is my role: "+this.data["Role"]);

    console.log("<<Result.ts page>>: " + this.data["gameMode"]);
    if (this.data["gameMode"] == "All same opponents") {

      // Yong Lin
      // this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('proposerUUID', '==', data["UUID"]).where('round', '==', parseInt(ress["round"])));
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
        this.data=navParams.data;
        if (round!=changeparse && this.data["Role"]=="Proposer" && changeparse<5){
          if (this.data["once"]!=1){
let passnextpg={UUID:res["proposerUUID"],username:res["proposerName"],dateTime:this.datetime,GameId: this.data["GameId"],once:0,FirebaseId:this.data["FirebaseId"], gameMode:this.data["gameMode"]};
            this.navCtrl.setRoot(ProposerPage,passnextpg);
          }
          else{
            let passnextpg={UUID:res["proposerUUID"],username:res["proposerName"],dateTime:this.datetime,GameId: this.data["GameId"],once:1,FirebaseId:this.data["FirebaseId"], gameMode:this.data["gameMode"]};
            this.navCtrl.setRoot(ProposerPage,passnextpg);
          }

          }
       else if (round!=changeparse && this.data["Role"]=="Proposer" && changeparse==5){
            let passnextpg={Role:"Respondant",UUID:res["proposerUUID"],username:res["proposerName"],dateTime:this.datetime,GameId:this.data["GameId"],FirebaseId:this.data["FirebaseId"],nextroundfirebaseid:this.data["nextroundfirebaseid"],gonextround:0,  gameMode:this.data["gameMode"]};
             this.navCtrl.setRoot(NextroundsPage,passnextpg)
          }

          else if (round!=changeparse && this.data["Role"]=="Proposer" && changeparse>5){
            let passnextpg={UUID:res["proposerUUID"],username:res["proposerName"],dateTime:this.datetime,GameId:this.data["GameId"],FirebaseId:this.data["FirebaseId"], gameMode:this.data["gameMode"]};
             this.navCtrl.setRoot(ProposerPage,passnextpg)
          }


       else if (round!=changeparse && this.data["Role"]=="Respondant" && changeparse<5){
          let passnextpg={Role:"Respondant",UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"],FirebaseId:this.data["FirebaseId"],nextroundfirebaseid:this.data["nextroundfirebaseid"],gonextround:0, gameMode:this.data["gameMode"]};
            this.navCtrl.setRoot(NextroundsPage,passnextpg);
          }
          else if (round!=changeparse && this.data["Role"]=="Respondant" && changeparse==5){
            if (this.data["once"]!=1){
               let passnextpg={UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"],once:0,FirebaseId:this.data["FirebaseId"],nextroundfirebaseid:this.data["nextroundfirebaseid"],gonextround:0, gameMode:this.data["gameMode"]};
             this.navCtrl.setRoot(ProposerPage,passnextpg)
            }
            else{
              let passnextpg={UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"],once:1,FirebaseId:this.data["FirebaseId"],nextroundfirebaseid:this.data["nextroundfirebaseid"],gonextround:0, gameMode:this.data["gameMode"]};
              this.navCtrl.setRoot(ProposerPage,passnextpg)
            }

          }

          else if (round!=changeparse && this.data["Role"]=="Respondant" && changeparse>5){
            if (this.data["once"]!=1){
               let passnextpg={Role:"Respondant",UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"],once:0,FirebaseId:this.data["FirebaseId"],nextroundfirebaseid:this.data["nextroundfirebaseid"],gonextround:0, gameMode:this.data["gameMode"]};
             this.navCtrl.setRoot(NextroundsPage,passnextpg)
            }
            else{
              let passnextpg={Role:"Respondant",UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"],once:1,FirebaseId:this.data["FirebaseId"],nextroundfirebaseid:this.data["nextroundfirebaseid"],gonextround:0, gameMode:this.data["gameMode"]};
              this.navCtrl.setRoot(NextroundsPage,passnextpg)
            }

          }


      })

   });

    }
    else if (this.data["gameMode"] == "Random all players") {

      // Peishan
      this.data=navParams.data;
      console.log(this.data["GameId"],"PARAMSDATA")
      console.log("RESULT.TS This is my role: "+this.data["Role"]);
      console.log("***********************RESULT.TS FirebaseId: " + this.data["FirebaseId"]);

      // this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('proposerUUID', '==', data["UUID"]).where('round', '==', parseInt(ress["round"])));

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
            this.data=navParams.data;

            console.log("<<result.ts>>: (round)" + round);
            console.log("<<result.ts>>: (changeparse)" + changeparse);
            console.log("<<result.ts>>: ((this.data))" + JSON.stringify(this.data));

            if (round!=changeparse && this.data["Role"]=="Proposer" && changeparse%2 != 0){ // when (changeparse % 2 != 0) means swapping roles: proposer becomes responder now

              console.log("{{Result.ts}} User went from Proposer to Responder: ");
              let passnextpg={Role: "Respondant",UUID:res["proposerUUID"],username:res["proposerName"],dateTime:this.datetime,GameId: this.data["GameId"],once:0,FirebaseId:this.data["FirebaseId"], gameMode:this.data["gameMode"],nextroundfirebaseid:this.data["nextroundfirebaseid"], gonextround:0};
              this.navCtrl.setRoot(NextroundsPage,passnextpg);
            }
            else if (round!=changeparse && this.data["Role"]=="Respondant" && changeparse%2 != 0){ // when (changeparse % 2 != 0) means swapping roles: responder becomes proposer now

              console.log("<<Result.ts>> User went from Responder to Proposer: ");
              let passnextpg={Role: "Proposer",UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"],FirebaseId:this.data["FirebaseId"],nextroundfirebaseid:this.data["nextroundfirebaseid"],gonextround:0, gameMode:this.data["gameMode"]};
              this.navCtrl.setRoot(ProposerPage,passnextpg);
            }
            else if (round!=changeparse && changeparse%2 == 0){ // find their current roles in "Game" table bc it is randomized
              // check if the next round, user is a proposer or responder;
              // if user is a proposer, go to ProposerPage
              // else if user is a responder, go to ResponderPage
              /*var uuid = this.data["UUID"];
              var gameId = this.data["GameId"];
              let changeparse=parseInt(ress["round"]);*/

              console.log("PASSED THROUGH HERE. ");
              console.log("UUID: " + this.data["UUID"]);
              console.log("round: " + parseInt(ress["round"]));

              this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('round', '==', parseInt(ress["round"])));

              this.item = this.itemDoc.valueChanges();
              this.subscription= this.item.subscribe(res=>{

                for (let p=0; p<res.length; p++) {

                  if (res[p]==undefined || res[p]==null){

                  }
                  else{

                    if (res[p].responderUUID == this.data["UUID"]) {

                      console.log("((result.ts)): I am a responder");
                      //let passnextpg={Role: "Respondant",UUID:res["proposerUUID"],username:res["proposerName"],dateTime:this.datetime,GameId: this.data["GameId"],once:0,FirebaseId:this.data["FirebaseId"], gameMode:this.data["gameMode"],nextroundfirebaseid:this.data["nextroundfirebaseid"], gonextround:0};
                      //this.navCtrl.setRoot(NextroundsPage,passnextpg);
                    }
                    else if (res[p].proposerUUID == this.data["UUID"]) { // user is a proposer

                      console.log("((result.ts)): I am a proposer");
                      //let passnextpg={Role: "Proposer",UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"],FirebaseId:this.data["FirebaseId"],nextroundfirebaseid:this.data["nextroundfirebaseid"],gonextround:0, gameMode:this.data["gameMode"]};
                      //this.navCtrl.setRoot(ProposerPage, passnextpg);
                    }
                  }
                }
                console.log("********************RESPRES: " + res);

                //if cannot find the length, we test if its proposer
                if (res.length==0){}
              })


              /*




              /*this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('gameId', '==', gameId).where('round', '==', changeparse).where('responderUUID', '==', uuid));

              this.item = this.itemDoc.valueChanges();

              this.subscription= this.item.subscribe(res=>{
                //if cannot find the length, we test if its proposer
                if (res.length==0) {
                  this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('gameId', '==', this.data["GameId"]).where('proposerUUID', '==', this.data["UUID"]).where('round', '==', parseInt(ress["round"])));
                  this.itemm = this.itemDoc.valueChanges();
                  this.itemm.subscribe(resss=>{

                    console.log("*******************************(result.ts): " + resss);

                  });
                }
                else {

                }
              })*/

            }
            /*else if (round!=changeparse && this.data["Role"]=="Respondant" && changeparse%2 == 0){ // when (changeparse % 2 == 0) means responder is still a responder
              let passnextpg={Role: "Respondant",UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"],FirebaseId:this.data["FirebaseId"],nextroundfirebaseid:this.data["nextroundfirebaseid"],gonextround:0, gameMode:this.data["gameMode"]};
              this.navCtrl.setRoot(NextroundsPage,passnextpg);
            }*/
              /*else if (round!=changeparse && this.data["Role"]=="Respondant" && changeparse==5){
                if (this.data["once"]!=1){
                  let passnextpg={UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"],once:0,FirebaseId:this.data["FirebaseId"],nextroundfirebaseid:this.data["nextroundfirebaseid"],gonextround:0, gameMode:this.data["gameMode"]};
                  this.navCtrl.setRoot(ProposerPage,passnextpg)
                }
                else{
                  let passnextpg={UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"],once:1,FirebaseId:this.data["FirebaseId"],nextroundfirebaseid:this.data["nextroundfirebaseid"],gonextround:0, gameMode:this.data["gameMode"]};
                  this.navCtrl.setRoot(ProposerPage,passnextpg)
                }
              }

              else if (round!=changeparse && this.data["Role"]=="Respondant" && changeparse>5){
                if (this.data["once"]!=1){
                  let passnextpg={Role:"Respondant",UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"],once:0,FirebaseId:this.data["FirebaseId"],nextroundfirebaseid:this.data["nextroundfirebaseid"],gonextround:0, gameMode:this.data["gameMode"]};
                  this.navCtrl.setRoot(NextroundsPage,passnextpg)
                }
                else{
                  let passnextpg={Role:"Respondant",UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"],once:1,FirebaseId:this.data["FirebaseId"],nextroundfirebaseid:this.data["nextroundfirebaseid"],gonextround:0, gameMode:this.data["gameMode"]};
                  this.navCtrl.setRoot(NextroundsPage,passnextpg)
                }
              }*/
            })
          });
      }
        /*this.professorcode = this.afs.collection('Professor').doc(this.data["GameId"]).valueChanges().subscribe(ress=>{

          var uuid = this.data["UUID"];
          var gameId = this.data["GameId"];
          let changeparse=parseInt(ress["round"]);
          this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('gameId', '==', this.data["GameId"]).where('round', '==', parseInt(ress["round"])).where('responderUUID', '==', this.data["UUID"]));

          this.item = this.itemDoc.valueChanges();

          this.subscription= this.item.subscribe(res=>{
            //if cannot find the length, we test if its proposer
            if (res.length==0) {
              this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('gameId', '==', this.data["GameId"]).where('proposerUUID', '==', this.data["UUID"]).where('round', '==', parseInt(ress["round"])));
              this.itemm = this.itemDoc.valueChanges();
              this.itemm.subscribe(resss=>{

                console.log("(result.ts): " + resss);

              });
            }
            else {

            }
          })
        })*/

  }

  ionViewDidLoad() {

  }

 ionViewDidLeave(){
       // this.subscription.unsubscribe();
    // this.professorcode.unsubscribe();
  }
}
