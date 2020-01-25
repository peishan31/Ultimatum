import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { ProposerPage } from '../proposer/proposer';
import { RespondantPage } from '../respondant/respondant';
import { NextroundsPage } from '../nextrounds/nextrounds';
import { Storage } from '@ionic/storage';
import {LoadingController} from 'ionic-angular';
import { UltimatumPage } from '../ultimatum/ultimatum';

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
  arr=[];
  scoreboard=[];
  hi:any;
  currentround:number;
  score:number;
  professorcodes:any;
  totalproposeramount=0;
  loader:Loading;
  showgobklogin:Boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams,public afs: AngularFirestore, public storage:Storage, public loadingCtrl:LoadingController) {

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
          if (this.Result=="Accept" && res["proposerAmount"]!=0){
            this.currentround=100-res["proposerAmount"];
          }
          else if (this.Result=="Decline"){
            this.currentround=0;
          }
          else if (res["proposerAmount"]==0){
            this.currentround=0;
          }

          //added this to get total score
          this.data=navParams.data;
          console.log(this.data);




        }
      }
      else{
        this.Responder=true;
        if (this.Result=="Accept"){
           this.currentround=res["proposerAmount"];
        }
        else if (this.Result=="Decline"){
          this.currentround=0;
        }

         //added this to get total score
//          this.data=navParams.data;
//          console.log(this.data);
//          this.professorcodes = this.afs.collection<any>('Game').ref
//          .where('gameId', '==', this.data["GameId"])
//          .where('responderUUID', '==', this.data["UUID"])
//          .where('responderStatus', '==', "Ready")
//          .get()
//          .then(ress => {
// console.log(ress)
//          if (ress.docs.length != 0) {

//            ress.forEach(ProfessorDoc => {
//              if ( ProfessorDoc.data().responderResponse=='Accept' && ProfessorDoc.data().proposerAmount!=0 ) {
//                this.totalproposeramount+=ProfessorDoc.data().proposerAmount;
//              }
//              else{
//                this.totalproposeramount+=0;
//              }

//            }
//          )}
// })

      }
      if (this.Proposer==true||this.Responder==true){
        this.professorcodes = this.afs.collection<any>('Game').ref
        .where('gameId', '==', this.data["GameId"])
        .where('proposerUUID', '==', this.data["UUID"])
        .where('responderStatus', '==', "Ready")
        .get()
        .then(ress => {
console.log(ress)
        if (ress.docs.length != 0) {

          ress.forEach(ProfessorDoc => {
            if ( ProfessorDoc.data().responderResponse=='Accept' && ProfessorDoc.data().proposerAmount!=0 ) {
              this.totalproposeramount+=100-ProfessorDoc.data().proposerAmount;
            }
            else{
              this.totalproposeramount+=0;
            }

          }
        )}
})

this.professorcodes = this.afs.collection<any>('Game').ref
.where('gameId', '==', this.data["GameId"])
.where('responderUUID', '==', this.data["UUID"])
.where('responderStatus', '==', "Ready")
.get()
.then(ress => {
console.log(ress)
if (ress.docs.length != 0) {

 ress.forEach(ProfessorDoc => {
   if ( ProfessorDoc.data().responderResponse=='Accept' && ProfessorDoc.data().proposerAmount!=0 ) {
     this.totalproposeramount+=ProfessorDoc.data().proposerAmount;
   }
   else{
     this.totalproposeramount+=0;
   }

 }
)}
})
      }

      this.professorcode = this.afs.collection('Professor').doc(this.data["GameId"]).valueChanges().subscribe(ress=>{
        if (parseInt(res["totalRound"])-1==parseInt(res["round"])){
          this.showgobklogin=true;
        }
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

      // Update on the scoring!
      /*this.afs.collection('Game')
        .doc(this.data["FirebaseId"])
        .get()
        .forEach(res => { // *** this one is not really working!

          this.Result=res.data().responderResponse;
          this.ProposerName=res.data().proposerName;
          this.ResponderName=res.data().responderName;
          this.data=navParams.data;

          if (this.data["Role"]=="Proposer"){
            if (this.Result==""){
              this.Proposer=false;
            }
            else{
              this.Proposer=true;
              if (this.Result=="Accept" && res.data().proposerAmount!=0){
                this.currentround=100-res.data().proposerAmount;
              }
              else if (this.Result=="Decline"){
                this.currentround=0;
              }
              else if (res.data().proposerAmount==0){
                this.currentround=0;
              }

              //added this to get total score
              this.data=navParams.data;
              console.log(this.data);
            }
          }
          else{
            this.Responder=true;
            if (this.Result=="Accept"){
              this.currentround=res.data().proposerAmount;
            }
            else if (this.Result=="Decline"){
              this.currentround=0;
            }

          }
      })*/
      this.subscription=  this.afs.collection('Game').doc(this.data["FirebaseId"]).valueChanges().subscribe(res=>{
        if (parseInt(res["totalRound"])-1==parseInt(res["round"])){
          this.showgobklogin=true;
        }
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
            if (this.Result=="Accept" && res["proposerAmount"]!=0){
              this.currentround=100-res["proposerAmount"];
            }
            else if (this.Result=="Decline"){
              this.currentround=0;
            }
            else if (res["proposerAmount"]==0){
              this.currentround=0;
            }

            //added this to get total score
            this.data=navParams.data;
            console.log(this.data);




          }
        }
        else{
          this.Responder=true;
          if (this.Result=="Accept"){
             this.currentround=res["proposerAmount"];
          }
          else if (this.Result=="Decline"){
            this.currentround=0;
          }

        }

        if (this.Proposer==true||this.Responder==true){
          this.professorcodes = this.afs.collection<any>('Game').ref
          .where('gameId', '==', this.data["GameId"])
          .where('proposerUUID', '==', this.data["UUID"])
          .where('responderStatus', '==', "Ready")
          .get()
          .then(ress => {
          console.log(ress)
          if (ress.docs.length != 0) {

            ress.forEach(ProfessorDoc => {
              if ( ProfessorDoc.data().responderResponse=='Accept' && ProfessorDoc.data().proposerAmount!=0 ) {
                this.totalproposeramount+=100-ProfessorDoc.data().proposerAmount;
              }
              else{
                this.totalproposeramount+=0;
              }

            }
          )}
  })

  this.professorcodes = this.afs.collection<any>('Game').ref
  .where('gameId', '==', this.data["GameId"])
  .where('responderUUID', '==', this.data["UUID"])
  .where('responderStatus', '==', "Ready")
  .get()
  .then(ress => {
  console.log(ress)
  if (ress.docs.length != 0) {

   ress.forEach(ProfessorDoc => {
     if ( ProfessorDoc.data().responderResponse=='Accept' && ProfessorDoc.data().proposerAmount!=0 ) {
       this.totalproposeramount+=ProfessorDoc.data().proposerAmount;
     }
     else{
       this.totalproposeramount+=0;
     }

   }
  )}
  })
        }
      })
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

                        this.loader.onDidDismiss(() => {
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
                        })

                      }
                      else if (round!=changeparse && this.data["Role"]=="Respondant" && changeparse%2 != 0){ // when (changeparse % 2 != 0) means swapping roles: responder becomes proposer now

                        console.log("<<Result.ts>> Changing position round: User went from Responder to Proposer: ");

                        this.loader =  this.loadingCtrl.create({
                          duration: 3000
                        });

                        this.loader.present();

                        this.loader.onDidDismiss(() => {
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
                        })
                      }
                      else if (round!=changeparse && changeparse%2 == 0){ // find their current roles in "Game" table bc it is randomized

                        // check if the next round, user is a proposer or responder AND also their nextroundfirebaseid!;
                        // if user is a proposer, go to ProposerPage
                        // else if user is a responder, go to ResponderPage
                        // Wait for a few seconds first
                        //this.loader.dismissAll();


                        //this.loader = null;
                        this.loader =  this.loadingCtrl.create({
                          duration: 8000
                        });

                        this.loader.present();


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

  ionViewDidLoad() {
    // this.storage.set("responder","true")
    // this.storage.set("proposer","true")
  }

 ionViewDidLeave(){
       // this.subscription.unsubscribe();
    // this.professorcode.unsubscribe();
  }


  scoreboardscore(){
    this.hi=this.navParams.data;
    this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('gameId', '==', this.hi["GameId"]).where('proposerStatus', '==', "Ready").where('responderStatus', '==', "Ready"));
    this.scoreboard.length=0;
    this.item = this.itemDoc.valueChanges();
    this.subscription= this.item.subscribe(res=>{

      for (let p=0;p<res.length;p++){
         if (res[p].responderResponse=="Accept"){
            let responderlist={"username":res[p].responderName,"score":res[p].proposerAmount,"role":"Responder"}
            this.scoreboard.push(responderlist);
            if (res[p].proposerAmount==0){
           let proposerlist={"username":res[p].proposerName,"score":0,"role":"Proposer"}
           this.scoreboard.push(proposerlist)
            }
            else{
           let proposerlist={"username":res[p].proposerName,"score":100-res[p].proposerAmount,"role":"Proposer"}
           this.scoreboard.push(proposerlist)
            }


      }
      else if (res[p].responderResponse=="Decline"){
          let responderlist={"username":res[p].responderName,"score":0,"role":"Responder"}
          let proposerlist={"username":res[p].proposerName,"score":0,"role":"Proposer"}
          this.scoreboard.push(proposerlist)
          this.scoreboard.push(responderlist)
        }
        console.log(this.scoreboard,"scoreboard")

  }
  var holder = {};
  this.scoreboard.forEach(function(d) {
    if (holder.hasOwnProperty(d.username)) {
      holder[d.username] = holder[d.username] + d.score;
    } else {
      holder[d.username] = d.score;
    }

  });
  var obj2 = [];
  for (var prop in holder) {
    obj2.push({ username: prop, score: holder[prop]});
  }
  console.log(obj2);
  obj2.sort(function(a, b){return a.score - b.score});
  obj2.reverse();
  this.arr=obj2;

  // for (let i=0; i<this.arr.length;i++){
  //   this.itemDoc = this.afs.collection<any>('Professor', ref => ref.where('gameId', '==', this.hi["GameId"]));
  //   this.item = this.itemDoc.valueChanges();
  //   this.subscription= this.item.subscribe(ress=>{
  //     this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('gameId', '==', this.hi["GameId"]).where('proposerName', '==', this.arr[i].username).where('round', '==', parseInt(ress["round"])));
  //   this.item = this.itemDoc.valueChanges();
  //   this.subscription= this.item.subscribe(retrievecurrentroundvalue=>{
  //     console.log(retrievecurrentroundvalue)
  //     if (retrievecurrentroundvalue.length!=0){
  //       console.log(retrievecurrentroundvalue[0].proposerAmount)
  //      this.arr[i].role="Proposer";
  //      this.arr[i].result=retrievecurrentroundvalue[0].responderResponse;
  //      if (retrievecurrentroundvalue[0].proposerAmount==0|| retrievecurrentroundvalue[0].responderResponse=="Decline"){
  //       this.arr[i].scorethisround=0;
  //      }
  //      else{
  //        this.arr[i].scorethisround=100-retrievecurrentroundvalue[0].proposerAmount;
  //      }

  //     }
  //     else{
  //       this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('gameId', '==', this.hi["GameId"]).where('responderName', '==', this.arr[i].username).where('round', '==', parseInt(ress["round"])));
  //       this.item = this.itemDoc.valueChanges();
  //       this.subscription= this.item.subscribe(retrievecurrentroundvalue=>{
  //         if (retrievecurrentroundvalue.length!=0&&retrievecurrentroundvalue[0].responderResponse!="Decline"){
  //           this.arr[i].role="Responder";
  //           this.arr[i].result=retrievecurrentroundvalue[0].responderResponse;
  //           this.arr[i].scorethisround=retrievecurrentroundvalue[0].proposerAmount;
  //         }
  //         else if (retrievecurrentroundvalue.length!=0&&retrievecurrentroundvalue[0].responderResponse=="Decline"){
  //           this.arr[i].role="Responder";
  //           this.arr[i].result=retrievecurrentroundvalue[0].responderResponse;
  //           this.arr[i].scorethisround=0;

  //         }
  //       })

  //     }

  //     })
  //   })
  //     }
  //     for (let u=0;u<this.arr.length;u++){
  //       if (this.arr[u].username==this.data["username"]){
  //         this.currentround=this.arr[u].scorethisround;
  //         this.score=this.arr[u].score;
  //       }
  //     }

  //   })
  //   }



  }
    )}


    goback(){
      this.navCtrl.setRoot(UltimatumPage);
    }
}
