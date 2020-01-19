import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { ProposerPage } from '../proposer/proposer';
import { RespondantPage } from '../respondant/respondant';
import { NextroundsPage } from '../nextrounds/nextrounds';
import { Storage } from '@ionic/storage';

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
  goonceagn=0;
  itemDoc: any;
  item: any;
  itemm: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public afs: AngularFirestore, public storage:Storage) {

    var val = this.navCtrl.last().name;
    console.log("VAL");
    console.log(val);

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
    else if (this.data["gameMode"] == "Random all players" && this.goonceagn==0) {

      // Peishan
      this.goonceagn+=1;
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

            console.log("<<result.ts>>: (round)" + round); // student's round
            console.log("<<result.ts>>: (changeparse)" + changeparse); // professor's round
            console.log("<<result.ts>>: ((this.data))" + JSON.stringify(this.data));

            if (round!=changeparse && this.data["Role"]=="Proposer" && changeparse%2 != 0){ // when (changeparse % 2 != 0) means swapping roles: proposer becomes responder now

              console.log("{{Result.ts}} User went from Proposer to Responder: ");
              let passnextpg={Role: "Respondant",UUID:res["proposerUUID"],username:res["proposerName"],dateTime:this.datetime,GameId: this.data["GameId"],once:0,FirebaseId:this.data["FirebaseId"], gameMode:this.data["gameMode"],nextroundfirebaseid:this.data["nextroundfirebaseid"], gonextround:0};
              this.navCtrl.setRoot(NextroundsPage,passnextpg);
            }
            else if (round!=changeparse && this.data["Role"]=="Respondant" && changeparse%2 != 0){ // when (changeparse % 2 != 0) means swapping roles: responder becomes proposer now

              console.log("<<Result.ts>> Changing position round: User went from Responder to Proposer: ");
              let passnextpg={
                UUID:res["responderUUID"],
                username:res["responderName"],
                GameId:this.data["GameId"],
                gameMode:this.data["gameMode"],
                Role: "Proposer",
                // amount
                FirebaseId:this.data["FirebaseId"],
                nextroundfirebaseid:this.data["nextroundfirebaseid"],
                // Round
                // once
                gonextround:0,
                dateTime:this.datetime, // extra
              };
              this.navCtrl.setRoot(ProposerPage,passnextpg);
            }
            else if (round!=changeparse && changeparse%2 == 0){ // find their current roles in "Game" table bc it is randomized
              // check if the next round, user is a proposer or responder AND also their nextroundfirebaseid!;
              // if user is a proposer, go to ProposerPage
              // else if user is a responder, go to ResponderPage

              console.log("PASSED THROUGH HERE. ");
              console.log("UUID: " + this.data["UUID"]); // undefined
              //console.log("round: " + parseInt(ress["round"])); // Prof's current round
              console.log("GameId " + this.data["GameId"]); // gameId!

              this.itemDoc = this.afs.collection('Game', ref => ref
                //.where('gameId', '==', this.data["GameId"])
                .where('round', '==', changeparse)
                .where('responderUUID', '==', this.data["UUID"])
                );

              this.item = this.itemDoc.valueChanges();
              this.subscription= this.item.subscribe(res=>{

                //console.log("********************Proposer in change position " + res);

                // if res.length == 0, there is no data. Hence, user might be a proposer
                if (res.length == 0 && round!=changeparse) // checking if user is a proposer
                {
                  this.itemDoc = this.afs.collection('Game', ref => ref
                  //.where('gameId', '==', this.data["GameId"])
                  .where('round', '==', changeparse)
                  .where('proposerUUID', '==', this.data["UUID"])
                  );
                  this.itemm = this.itemDoc.valueChanges();
                  this.subscription = this.itemm.subscribe(resss=>{

                    if (resss.length != 0) {
                      console.log(resss,"Randomized proposer!")
                      var nextroundfirebaseid = res["proposerUUID"] + changeparse + res["responderUUID"] + changeparse;

                      this.navCtrl.setRoot(ProposerPage, {
                        UUID: resss["proposerUUID"],
                        username:resss["proposerName"],
                        GameId:this.data["GameId"],
                        gameMode:this.data["gameMode"],
                        Role: "Proposer",
                        // amount
                        FirebaseId:this.data["FirebaseId"],
                        nextroundfirebaseid: nextroundfirebaseid,
                        // round
                        //Round: parseInt(ress["round"]),
                        // once
                        gonextround:0,
                      });
                    }
                    else {
                      console.log("??? User is neither a proposer or respondant?");
                    }

                  })
                }
                else if (res.length > 0 && round!=changeparse && res[0]["responderResponse"]=="")
                {
                  // user is a responder
                  console.log("******************* changeparse: (prof's current round) " + changeparse);
                  console.log("******************* round: (current) " + round);
                  console.log("((result.ts)): I am a responder");
                  console.log("************((result.ts)) this.data: " + JSON.stringify(this.data));
                  console.log("proposerUUID: " + res[0]["proposerUUID"]);
                  console.log("proposerUUID: " + res[0]["responderUUID"]);
                  console.log("changeparse " + changeparse);
                  console.log("RES: " + JSON.stringify(res));
                  var nextroundfirebaseid = res[0]["proposerUUID"] + changeparse + res[0]["responderUUID"] + changeparse;
                  //********************** */
                  /*this.navCtrl.setRoot(NextroundsPage, {
                    UUID:res[0]["responderUUID"],
                    username:res[0]["responderName"],
                    GameId:this.data["GameId"],
                    gameMode:this.data["gameMode"],
                    Role: "Respondant",
                    // amount
                    FirebaseId:this.data["FirebaseId"],
                    nextroundfirebaseid: nextroundfirebaseid,
                    // round
                    Round: parseInt(ress["round"]),
                    // once
                    gonextround:0,
                  });*/
                }
              })
            }
            })
          });
      }
  }

  ionViewDidLoad() {
    this.storage.set("responder","true")
    this.storage.set("proposer","true")
  }

 ionViewDidLeave(){
       // this.subscription.unsubscribe();
    // this.professorcode.unsubscribe();
  }
}
