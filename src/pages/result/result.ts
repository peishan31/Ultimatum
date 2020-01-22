import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController, Loading } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { ProposerPage } from '../proposer/proposer';
import { RespondantPage } from '../respondant/respondant';
import { NextroundsPage } from '../nextrounds/nextrounds';
import { Storage } from '@ionic/storage';
import {LoadingController} from 'ionic-angular';
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
  subscription1:Subscription;
  retrieveprofessor:any;
  professorcode:Subscription;
  data:any;
  datetime:string;
  goonceagn=0;
  itemDoc: any;
  item: any;
  itemm: any;
  loader:Loading;
  isLoading = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public afs: AngularFirestore, public storage:Storage, public loadingCtrl:LoadingController, public toastCtrl:ToastController) {

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

      // Peishan:
      /* Real time update of the professors' round. if professor clicks "next",
      the round in their db would increment by 1 and update here. When it increases by 1,
      check which page the user would go to*/
      this.goonceagn+=1;
      this.data=navParams.data;
      console.log(this.data["GameId"],"PARAMSDATA")
      console.log("RESULT.TS This is my current role: "+this.data["Role"]);
      console.log("RESULT.TS FirebaseId: " + this.data["FirebaseId"]);
      console.log("RESULT.TS nextroundfirebaseid: " + this.data["nextroundfirebaseid"]);
      console.log("RESULT.TS This is my current round: " + this.data["Round"]);

      // this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('proposerUUID', '==', data["UUID"]).where('round', '==', parseInt(ress["round"])));
      this.storage.get(this.data.UUID+"EnteredResult").then((val) => {

        if (val == false) {

          //if (this.data["Role"] == "Proposer") {

          //this.afs.collection<any>('Game').ref
           // .where('proposerUUID', '==', this.data["UUID"])
            //.where('gameId', '==', this.data["GameId"])
           // .where('round', '==', parseInt(this.data["Round"]))
            //.get()
            //.then(res=> {
            //  if (res.docs.length != 0) { // User is a proposer
            //    res.forEach(ProposerGameDoc => {
            this.subscription1=  this.afs.collection('Game').doc(this.data["FirebaseId"]).valueChanges().subscribe(res=>{

                  this.Result=res["responderResponse"];;
                  this.ProposerName=res["proposerName"];
                  this.ResponderName=res["responderName"];

                  //this.data=navParams.data;

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

                  this.professorcode = this.afs.collection('Professor')
                    .doc(this.data["GameId"]).valueChanges().subscribe(ress=>{

                      let date=new Date();
                      this.datetime=date.toISOString();
                      let round=parseInt(res["round"]); // currentRound
                      let changeparse=parseInt(ress["round"]); // real-time update round by Professor

                      console.log("<<result.ts>>: (round)" + round); // student's round
                      console.log("<<result.ts>>: (changeparse)" + changeparse); // professor's round
                      console.log("<<result.ts>>: ((this.data))" + JSON.stringify(this.data));
                      console.log((changeparse-round));

                      if (round!=changeparse && this.data["Role"]=="Proposer" && changeparse%2 != 0 ){ // when (changeparse % 2 != 0) means swapping roles: proposer becomes responder now

                        console.log("{{Result.ts}} User went from Proposer to Responder: ");

                        this.loader =  this.loadingCtrl.create({
                          duration: 3000
                        });

                        this.loader.present();

                        let passnextpg = {
                          UUID: res["proposerUUID"],
                          username: res["proposerName"],
                          GameId: this.data["GameId"],
                          gameMode:this.data["gameMode"],
                          Role: "Respondant", // new role
                          FirebaseId:this.data["FirebaseId"],
                          nextroundfirebaseid:this.data["nextroundfirebaseid"],
                          // result
                          Round: changeparse, // new round
                          dateTime:this.datetime,
                          once:0,
                          gonextround:0
                        };

                        // Resetting local storage
                        this.storage.set(this.data.UUID+"EnteredGameCode", false);
                        this.storage.set(this.data.UUID+"EnteredProposal", false);
                        this.storage.set(this.data.UUID+"EnteredRespondant", false);
                        this.storage.set(this.data.UUID+"EnteredResult", false);
                        this.storage.set(this.data.UUID+"EnteredNextRound", false);

                        this.navCtrl.setRoot(NextroundsPage,passnextpg);
                      }
                      else if (round!=changeparse && this.data["Role"]=="Respondant" && changeparse%2 != 0){ // when (changeparse % 2 != 0) means swapping roles: responder becomes proposer now

                        console.log("<<Result.ts>> Changing position round: User went from Responder to Proposer: ");

                        this.loader =  this.loadingCtrl.create({
                          duration: 3000
                        });

                        this.loader.present();

                        let passnextpg={
                          UUID:res["responderUUID"],
                          username:res["responderName"],
                          GameId:this.data["GameId"],
                          gameMode:this.data["gameMode"],
                          Role: "Proposer",
                          // amount
                          FirebaseId:this.data["FirebaseId"],
                          nextroundfirebaseid:this.data["nextroundfirebaseid"],
                          Round: changeparse, // new round
                          // once
                          gonextround:0,
                          dateTime:this.datetime, // extra
                        };

                        this.storage.set(this.data.UUID+"EnteredGameCode", false);
                        this.storage.set(this.data.UUID+"EnteredProposal", false);
                        this.storage.set(this.data.UUID+"EnteredRespondant", true);
                        this.storage.set(this.data.UUID+"EnteredResult", false);
                        this.storage.set(this.data.UUID+"EnteredNextRound", false);
                        this.navCtrl.setRoot(ProposerPage,passnextpg);
                      }
                      else if (round!=changeparse && changeparse%2 == 0){ // find their current roles in "Game" table bc it is randomized

                        // check if the next round, user is a proposer or responder AND also their nextroundfirebaseid!;
                        // if user is a proposer, go to ProposerPage
                        // else if user is a responder, go to ResponderPage
                        // Wait for a few seconds first
                        //this.loader.dismissAll();


                        //this.loader = null;
                        this.loader =  this.loadingCtrl.create({
                          duration: 10000
                        });

                        this.loader.present();

                        /*setTimeout(() => {

                          this.loader.dismiss().catch(() => {this.loader.dismissAll()});

                        }, 10000);*/

                        this.loader.onDidDismiss(() => {
                          this.afs.collection<any>('Game').ref
                          .where('gameId', '==', this.data["GameId"])
                          .where('round', '==', changeparse)
                          .where('proposerUUID', '==', this.data["UUID"])
                          .get()
                          .then(res=>{

                            if (res.docs.length != 0){ // user is a proposer!

                              res.forEach(ProposerGameDoc=>{
                                console.log(ProposerGameDoc.data());
                                var nextroundfirebaseid = ProposerGameDoc.data().proposerUUID + changeparse + ProposerGameDoc.data().responderUUID + changeparse;

                                this.storage.set(this.data.UUID+"EnteredGameCode", false);
                                this.storage.set(this.data.UUID+"EnteredProposal", false);
                                this.storage.set(this.data.UUID+"EnteredRespondant", false);
                                this.storage.set(this.data.UUID+"EnteredResult", false);
                                this.storage.set(this.data.UUID+"EnteredNextRound", false);

                                this.navCtrl.setRoot(ProposerPage, {
                                  UUID: ProposerGameDoc.data().proposerUUID,
                                  username: ProposerGameDoc.data().proposerName,
                                  GameId: this.data["GameId"],
                                  gameMode:this.data["gameMode"],
                                  Role: "Proposer", // new role
                                  FirebaseId:this.data["FirebaseId"],
                                  nextroundfirebaseid:nextroundfirebaseid,
                                  // result
                                  Round: changeparse, // new round
                                  dateTime:this.datetime,
                                  //once:0,
                                  gonextround:0
                                })

                              })
                            }
                            else { // check if user is a respondant!

                              this.afs.collection<any>('Game').ref
                              .where('gameId', '==', this.data["GameId"])
                              .where('round', '==', changeparse)
                              .where('responderUUID', '==', this.data["UUID"])
                              .get()
                              .then(res=>{

                                if (res.docs.length != 0){ // user is a responder!

                                  res.forEach(ResponderGameDoc=>{

                                    var nextroundfirebaseid = ResponderGameDoc.data().proposerUUID + changeparse + ResponderGameDoc.data().responderUUID + changeparse;

                                    let passnextpg = {
                                      UUID: ResponderGameDoc.data().responderUUID,
                                      username: ResponderGameDoc.data().responderName,
                                      GameId: this.data["GameId"],
                                      gameMode:this.data["gameMode"],
                                      Role: "Respondant", // new role
                                      FirebaseId:this.data["FirebaseId"],
                                      nextroundfirebaseid: nextroundfirebaseid,
                                      // result
                                      Round: changeparse, // new round
                                      dateTime:this.datetime,
                                      once:0,
                                      gonextround:0
                                    };

                                    // Resetting local storage
                                    this.storage.set(this.data.UUID+"EnteredGameCode", false);
                                    this.storage.set(this.data.UUID+"EnteredProposal", false);
                                    this.storage.set(this.data.UUID+"EnteredRespondant", false);
                                    this.storage.set(this.data.UUID+"EnteredResult", false);
                                    this.storage.set(this.data.UUID+"EnteredNextRound", false);

                                    this.navCtrl.setRoot(NextroundsPage,passnextpg);

                                  })
                                }
                                else {
                                  //alert("Error! User is not assigned to any roles!");
                                }

                              })
                            }
                          });
                        });



                      }

                  })

                })
              }
              //}
              /*else { // check if user is a respondant
                this.afs.collection<any>('Game').ref
                .where('responderUUID', '==', this.data["UUID"])
                .where('gameId', '==', this.data["GameId"])
                .where('round', '==', parseInt(this.data["Round"]))
                .get()
                .then(res=> {

                  if (res.docs.length != 0) {
                    res.forEach(RespondantGameDoc => {

                      this.Responder=true;

                    })
                  }
                  else {
                    console.log("Error! Is the user even in the game?");
                  }
                })
              }*/
            })
          //}


          //else if (this.data["Role"] == "Respondant") {


          //}
      this.storage.get(this.data.UUID+"EnteredResult").then((val) => {
        if (val==true){
          if (this.subscription) this.subscription.unsubscribe();
          if (this.professorcode) this.professorcode.unsubscribe();
        }
      })

      }
  }

  stateChange(newState) {
    setTimeout(function () {
        if (newState == -1) {
            alert('VIDEO HAS STOPPED');
        }
    }, 5000);
  }

  ionViewDidLoad() {
    this.storage.set("responder","true")
    this.storage.set("proposer","true")
  }

 ionViewDidLeave(){
       // this.subscription.unsubscribe();
    // this.professorcode.unsubscribe();
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  /*async dismissLoading() {
    await this.loader.dismiss();
  }*/

}
