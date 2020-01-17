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
        let half=(parseInt(res["totalRound"])/2)
        this.data=navParams.data;
        if (round!=changeparse && this.data["Role"]=="Proposer" && changeparse<half){
          if (this.data["once"]!=1){
let passnextpg={UUID:res["proposerUUID"],username:res["proposerName"],dateTime:this.datetime,GameId: this.data["GameId"],once:0,FirebaseId:this.data["FirebaseId"], gameMode:this.data["gameMode"]};
            this.navCtrl.setRoot(ProposerPage,passnextpg);
          }
          else{
            let passnextpg={UUID:res["proposerUUID"],username:res["proposerName"],dateTime:this.datetime,GameId: this.data["GameId"],once:1,FirebaseId:this.data["FirebaseId"], gameMode:this.data["gameMode"]};
            this.navCtrl.setRoot(ProposerPage,passnextpg);
          }

          }
       else if (round!=changeparse && this.data["Role"]=="Proposer" && changeparse==half){

        let addround=changeparse;
        console.log("addround",addround);
        this.data["nextroundfirebaseid"] = res['responderUUID'] + addround + res['proposerUUID'] + addround; //added this bc its respoder next round


            let passnextpg={Role:"Respondant",UUID:res["proposerUUID"],username:res["proposerName"],dateTime:this.datetime,GameId:this.data["GameId"],FirebaseId:this.data["FirebaseId"],nextroundfirebaseid:this.data["nextroundfirebaseid"],gonextround:0,  gameMode:this.data["gameMode"]};
             this.navCtrl.setRoot(NextroundsPage,passnextpg)
          }

          else if (round!=changeparse && this.data["Role"]=="Proposer" && changeparse>half){
            let passnextpg={UUID:res["proposerUUID"],username:res["proposerName"],dateTime:this.datetime,GameId:this.data["GameId"],FirebaseId:this.data["FirebaseId"], gameMode:this.data["gameMode"]};
             this.navCtrl.setRoot(ProposerPage,passnextpg)
          }


       else if (round!=changeparse && this.data["Role"]=="Respondant" && changeparse<half){
         
          let passnextpg={Role:"Respondant",UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"],FirebaseId:this.data["FirebaseId"],nextroundfirebaseid:this.data["nextroundfirebaseid"],gonextround:0, gameMode:this.data["gameMode"]};
            this.navCtrl.setRoot(NextroundsPage,passnextpg);
          }
          else if (round!=changeparse && this.data["Role"]=="Respondant" && changeparse==half){
            if (this.data["once"]!=1){
               let passnextpg={UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"],once:0,FirebaseId:this.data["FirebaseId"],nextroundfirebaseid:this.data["nextroundfirebaseid"],gonextround:0, gameMode:this.data["gameMode"]};
             this.navCtrl.setRoot(ProposerPage,passnextpg)
            }
            else{
              let passnextpg={UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"],once:1,FirebaseId:this.data["FirebaseId"],nextroundfirebaseid:this.data["nextroundfirebaseid"],gonextround:0, gameMode:this.data["gameMode"]};
              this.navCtrl.setRoot(ProposerPage,passnextpg)
            }

          }

          else if (round!=changeparse && this.data["Role"]=="Respondant" && changeparse>half){
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

                console.log("********************RESPRES: " + res);
                for (let p=0; p<res.length; p++) {

                  if (res[p]==undefined || res[p]==null){

                  }
                  else{

                    var nextroundfirebaseid = res[p].proposerUUID + changeparse + res[p].responderUUID + changeparse;

                    console.log("nextroundfirebaseid: " + nextroundfirebaseid);
                    if (res[p].responderUUID == this.data["UUID"]) { // user is a responder

                      console.log("((result.ts)): I am a responder");
                      console.log("************((result.ts)) this.data: " + JSON.stringify(this.data));
                      /*
                      {"Role":"Proposer",
                      "FirebaseId":"b340f7a0-ba34-4512-9a29-d9d163f2d137107f2392b-7f91-4c07-8bc4-6b9091da9bda1",
                      "Amount":51,
                      "GameId":"0f01c6",
                      "Round":1,
                      "once":1,
                      "UUID":"b340f7a0-ba34-4512-9a29-d9d163f2d137",
                      "username":"fd",
                      "dateTime":"2020-01-15T21:58:56.107Z",
                      "gameMode":"Random all players"}
                      */
                      /*let passnextpg={
                        Role: "Respondant",
                        UUID:res["responderUUID"],
                        username:res["responderName"],
                        dateTime:this.datetime,
                        GameId:this.data["GameId"],
                        FirebaseId:this.data["FirebaseId"],
                        nextroundfirebaseid:this.data["nextroundfirebaseid"],
                        gonextround:0,
                        gameMode:this.data["gameMode"]};*/

                      this.navCtrl.setRoot(NextroundsPage, {
                        Role: "Respondant",
                        FirebaseId:this.data["FirebaseId"],
                        nextroundfirebaseid: nextroundfirebaseid,
                        gonextround:0,
                        gameMode:this.data["gameMode"],
                        GameId:this.data["GameId"],
                        username:res[p].responderName,
                        UUID:res[p].responderUUID,
                      });
                    }
                    else if (res[p].proposerUUID == this.data["UUID"]) { // user is a proposer

                      console.log("((result.ts)): I am a proposer");
                      //let passnextpg={Role: "Proposer",UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"],FirebaseId:this.data["FirebaseId"],nextroundfirebaseid:this.data["nextroundfirebaseid"],gonextround:0, gameMode:this.data["gameMode"]};
                      //this.navCtrl.setRoot(ProposerPage, passnextpg);
                      /*
                      ************((result.ts)) this.data: {
                        "Role":"Respondant",
                        "FirebaseId":"36fbacef-5049-4d5e-81c2-3a45c49c178b117359ebd-45a3-4439-9ec0-9c237709a0ce1",
                        "Result":"Accept",
                        "GameId":"b21bf9",
                        "Round":1,
                        "gameMode":"Random all players",
                        "UUID":"17359ebd-45a3-4439-9ec0-9c237709a0ce"
                      }
                      */
                      console.log("************((result.ts)) this.data: " + JSON.stringify(this.data));
                      console.log("nextroundfirebaseid: " + nextroundfirebaseid);

                      this.navCtrl.setRoot(ProposerPage, {
                        Role: "Proposer",
                        FirebaseId:this.data["FirebaseId"],
                        nextroundfirebaseid: nextroundfirebaseid,
                        gonextround:0,
                        gameMode:this.data["gameMode"],
                        GameId:this.data["GameId"],
                        username:res[p].proposerName,
                        UUID:res[p].proposerUUID,
                      });
                    }
                  }
                }

              })
            }
            })
          });
      }
  }

  ionViewDidLoad() {

  }

 ionViewDidLeave(){
       // this.subscription.unsubscribe();
    // this.professorcode.unsubscribe();
  }
}
