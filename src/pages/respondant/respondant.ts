import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProfessorHomePage } from '../professor-home/professor-home';
import { AngularFirestore } from '@angular/fire/firestore';
import {LoadingController} from 'ionic-angular';
import { ResultPage } from '../result/result';
import { Observable, Subject, Subscription } from 'rxjs';
import { NextroundsPage } from '../nextrounds/nextrounds';
import { ProposerPage } from '../proposer/proposer';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-respondant',
  templateUrl: 'respondant.html'
})
export class RespondantPage {
  itemDoc:any;
  item:any;
  proposerAmt = 0;
  proposerUsername = "";
  responderData:any;
  firebaseId = "";
  maxtime: any=30;
  timer:any;
  subscription:Subscription;
  professorcode:any;
  retrieveprofessor:any;
  goonce=0;
  result:string;
  count=0;
  datetime:any;
  addround=0;
  res:any
  itemm:any;

  constructor(public navCtrl: NavController,
    public loadingCtrl:LoadingController,
    public afs: AngularFirestore,
    public navParams: NavParams,
    public storage:Storage) {


      this.storage.set("responder","false")



        //this.proposerAmt = all.proposerAmount;
      // const loading = this.loadingCtrl.create({

      // });
      // loading.dismiss();
      //this.CheckIfProposerStatusChange();
  }

  /*CheckIfProposerStatusChange(){
    // Makes sure that the proposer is 'Ready' before responder could do anything
    this.itemDoc = this.afs.collection<any>('Game');
    this.item = this.itemDoc.valueChanges();
    let all=this.navParams.data;

    this.item.subscribe(res=>{

      console.log("My UUID: "+ all.UUID);
      for (let p=0;p<res.length;p++){
        if (res[p]==undefined || res[p]==null){
        }
        else{

          // constantly loading until proposer has entered a value
          const loading = this.loadingCtrl.create({

          });
          this.presentLoading(loading);
          console.log("Hi!");
          if (res[p].responderUUID == all.UUID && res[p].round == 0 && res[p].proposerStatus == "Ready"){ //*** hardcoding round

            // store proposerAmount here
            console.log("Proposer Status changed!");
            this.proposerAmt = res[p].proposerAmount;
            loading.dismiss();
          }
        }

      }

    })
  }*/

  /*Next(){
    this.navCtrl.setRoot(ProfessorHomePage);
  }*/

  ionViewDidEnter(){
    let all=this.navParams.data;

    console.log("<<Respondant.ts>> Game Mode: " + all["gameMode"]);

    if (all["gameMode"] == "All same opponents") {

      // Yong Lin
      this.professorcode = this.afs.collection<any>('Professor').doc(all["GameId"])
    this.retrieveprofessor = this.professorcode.valueChanges();
    this.subscription=this.retrieveprofessor.subscribe(ress=>{
    this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('responderUUID', '==', all["UUID"]).where('round', '==', parseInt(ress["round"])));
    this.item = this.itemDoc.valueChanges();

   this.subscription= this.item.subscribe(res=>{
     console.log(res,"RESPRES")

     //if cannot find the length, we test if its proposer
if (res.length==0){
  this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('proposerUUID', '==', all["UUID"]).where('round', '==', parseInt(ress["round"])));
    this.itemm = this.itemDoc.valueChanges();

  this.itemm.subscribe(resss=>{
     console.log(resss,"RESPRES2")
this.res=resss;
console.log(this.res,"RES")

     for (let p=0;p<this.res.length;p++){
      if (this.res[p].proposerUUID==all.UUID && this.res[p].round.toString()==ress["round"].toString() && this.res[p].responderResponse=="" && this.res[p].proposerAmount==""){
        let all=this.navParams.data;
        let date=new Date();
    this.datetime=date.toISOString();
        let passnextpg={UUID:this.res[p].proposerUUID,username:this.res[p].proposerName,dateTime:this.datetime,GameId: all["GameId"],once:0, gameMode: all["gameMode"]};
        this.navCtrl.setRoot(ProposerPage,passnextpg);
     }
     else if (this.res[p].proposerUUID==all.UUID && this.res[p].round.toString()==ress["round"].toString() && this.res[p].proposerAmount!=""){
      let all=this.navParams.data;
      let date=new Date();
  this.datetime=date.toISOString();
  this.firebaseId = this.res[p].proposerUUID + this.res[p].round + this.res[p].responderUUID + this.res[p].round
      // let passnextpg={UUID:res[p].proposerUUID,username:res[p].proposerName,dateTime:this.datetime,GameId: all["GameId"]};
      let dict={"Role":"Proposer","FirebaseId":this.firebaseId,"Amount":this.res[p].proposerAmount,"GameId":all["GameId"],"Round":this.res[p].round,once:1,UUID:this.res[p].proposerUUID,username:this.res[p].proposerName,dateTime:this.datetime, gameMode: all["gameMode"]};
      this.navCtrl.setRoot(ResultPage,dict);
    }

  }})
//   let all=this.navParams.data;
//   let date=new Date();
// this.datetime=date.toISOString();
//   let passnextpg={UUID:all["UUID"],username:all["username"],dateTime:this.datetime,GameId: all["GameId"],once:0};
//   this.navCtrl.setRoot(ProposerPage,passnextpg);
}
      for (let p=0;p<res.length;p++){

          //if (res[p].responderUUID == all.UUID && res[p].gameId==all.gamecode) { --> ***GAMECODE TEMP NOT WORKING
          if (res[p].responderUUID == all["UUID"] && res[p].round.toString()==ress["round"].toString()){
            if (res[p].round!=0 && res[p].proposerStatus!="Ready" && res[p].proposerAmount==''){
              this.navCtrl.setRoot(NextroundsPage)
            }

            else if (res[p].round==0 && res[p].proposerStatus=="Ready" && res[p].proposerAmount!='' && res[p].responderResponse!=""){
              let nextroundfirebaseid= res[p].proposerUUID + res[p].round.toString() +  res[p].responderUUID + res[p].round.toString();
              this.firebaseId = res[p].proposerUUID + res[p].round + res[p].responderUUID + res[p].round;
              let dict={"Role":"Respondant","FirebaseId":this.firebaseId,"Result":res[p].responderResponse,"GameId":all["GameId"],"Round":res[p].round,"nextroundfirebaseid":nextroundfirebaseid, gameMode: all["gameMode"]};
              this.navCtrl.setRoot(ResultPage,dict)
            }

           else if (res[p].responderResponse=="" && res[p].proposerAmount!="") {
              // user is a responder in the next round
              console.log("hu")
              this.proposerAmt = res[p].proposerAmount;
              this.proposerUsername = res[p].proposerName;

            }

           else if (res[p].round!=0 && res[p].responderResponse!=""){
            this.firebaseId = res[p].proposerUUID + res[p].round + res[p].responderUUID + res[p].round
            let all=this.navParams.data;
            let dict={"Role":"Respondant","FirebaseId":this.firebaseId,"Result":this.result,"GameId":all["GameId"],"Round":res[p].round, gameMode: all["gameMode"]};
           this.navCtrl.setRoot(ResultPage,dict)
           }


          }
//added this part if it is proposer now
          else if (res[p].proposerUUID==all.UUID && res[p].round.toString()==ress["round"].toString() && res[p].responderResponse=="" && res[p].proposerAmount==""){
            let all=this.navParams.data;
            let date=new Date();
        this.datetime=date.toISOString();
            let passnextpg={UUID:res[p].proposerUUID,username:res[p].proposerName,dateTime:this.datetime,GameId: all["GameId"],once:0, gameMode: all["gameMode"]};
            this.navCtrl.setRoot(ProposerPage,passnextpg);
          }
          else if (res[p].proposerUUID==all.UUID && res[p].round.toString()==ress["round"].toString() && res[p].proposerAmount!=""){
            let all=this.navParams.data;
            let date=new Date();
        this.datetime=date.toISOString();
        this.firebaseId = res[p].proposerUUID + res[p].round + res[p].responderUUID + res[p].round
            // let passnextpg={UUID:res[p].proposerUUID,username:res[p].proposerName,dateTime:this.datetime,GameId: all["GameId"]};
            let dict={"Role":"Proposer","FirebaseId":this.firebaseId,"Amount":res[p].proposerAmount,"GameId":all["GameId"],"Round":res[p].round,once:1,UUID:res[p].proposerUUID,username:res[p].proposerName,dateTime:this.datetime, gameMode: all["gameMode"]};
            this.navCtrl.setRoot(ResultPage,dict);
          }



        }})})

     this.StartTimer()
    }
    else if (all["gameMode"] == "Random all players") {

      // Peishan
      this.professorcode = this.afs.collection<any>('Professor').doc(all["GameId"])
      this.retrieveprofessor = this.professorcode.valueChanges();
      this.subscription=this.retrieveprofessor.subscribe(ress=>{
      this.itemDoc = this.afs.collection<any>('Game', ref =>
        ref
        .where('responderUUID', '==', all["UUID"])
        .where('round', '==', parseInt(ress["round"]))
        );
      this.item = this.itemDoc.valueChanges();

      this.subscription= this.item.subscribe(res=>{

        console.log(res,"RESPRES")

        //if cannot find the length, we test if its proposer
        if (res.length==0){
          this.itemDoc = this.afs.collection<any>('Game', ref =>
            ref
            .where('proposerUUID', '==', all["UUID"])
            .where('round', '==', parseInt(ress["round"]))
          );
          this.itemm = this.itemDoc.valueChanges();

          this.itemm.subscribe(resss=>{

            console.log(resss,"RESPRES2")
            this.res=resss;
            console.log(this.res,"RES")

            for (let p=0;p<this.res.length;p++){

              if (this.res[p].proposerUUID==all.UUID && this.res[p].round.toString()==ress["round"].toString() && this.res[p].responderResponse=="" && this.res[p].proposerAmount==""){

                let all=this.navParams.data;
                let date=new Date();
                this.datetime=date.toISOString();
                let passnextpg={
                  UUID:this.res[p].proposerUUID,
                  username:this.res[p].proposerName,
                  GameId: all["GameId"],
                  gameMode: all["gameMode"],
                  // Role
                  // amount
                  // FirebaseId
                  // nextroundfirebaseid
                  // round
                  once:0,
                  // gonextround
                  dateTime:this.datetime,
                };
                this.navCtrl.setRoot(ProposerPage,passnextpg);
            }
            else if (this.res[p].proposerUUID==all.UUID && this.res[p].round.toString()==ress["round"].toString() && this.res[p].proposerAmount!=""){
              let all=this.navParams.data;
              let date=new Date();
              this.datetime=date.toISOString();
              this.firebaseId = this.res[p].proposerUUID + this.res[p].round + this.res[p].responderUUID + this.res[p].round
              // let passnextpg={UUID:res[p].proposerUUID,username:res[p].proposerName,dateTime:this.datetime,GameId: all["GameId"]};
              let dict={
                UUID:this.res[p].proposerUUID,
                username:this.res[p].proposerName,
                GameId:all["GameId"],
                gameMode: all["gameMode"],
                Role:"Proposer",
                Amount: this.res[p].proposerAmount,
                FirebaseId:this.firebaseId,
                // nextroundfirebaseid
                Round:this.res[p].round,
                once:1,
                // gonextround
                dateTime:this.datetime,

              };
              this.navCtrl.setRoot(ResultPage,dict);
            }

          }})
        }
        for (let p=0;p<res.length;p++){

          //==========================================
          //added this part if it is proposer now
          console.log("((respondant.ts)) proposerUUID: " + res[p].proposerUUID);
          console.log("((respondant.ts)) responderUUID: " + res[p].responderUUID);
          console.log("((respondant.ts)) myUUID: " + all.UUID);
          console.log("((respondant.ts)) res[p].responderResponse: " + res[p].responderResponse);
          console.log("((respondant.ts)) res[p].proposerAmount: " + res[p].proposerAmount);
          console.log("((respondant.ts)) ress['round']: " + ress["round"]);
          console.log("((respondant.ts)) ress['round']: " + res[p].round);
          //==========================================
            //if (res[p].responderUUID == all.UUID && res[p].gameId==all.gamecode) { --> ***GAMECODE TEMP NOT WORKING
            if (res[p].responderUUID == all["UUID"] && res[p].round.toString()==ress["round"].toString()){
              if (res[p].round!=0 && res[p].proposerStatus!="Ready" && res[p].proposerAmount==''){
                console.log("Please check line 294 in respondant.ts!!!!");
                //this.navCtrl.setRoot(NextroundsPage)
              }

              else if (res[p].round==0 && res[p].proposerStatus=="Ready" && res[p].proposerAmount!='' && res[p].responderResponse!=""){
                let nextroundfirebaseid= res[p].proposerUUID + res[p].round.toString() +  res[p].responderUUID + res[p].round.toString();
                this.firebaseId = res[p].proposerUUID + res[p].round + res[p].responderUUID + res[p].round;
                let dict={
                  UUID: all["UUID"],
                  username: all["username"],
                  GameId:all["GameId"],
                  gameMode: all["gameMode"],
                  Role:"Respondant",
                  // amount
                  FirebaseId:this.firebaseId,
                  nextroundfirebaseid:nextroundfirebaseid,
                  Round:res[p].round,
                  // once
                  Result:res[p].responderResponse, // new
                  // gonextround
                };
                this.navCtrl.setRoot(ResultPage,dict)
              }

              else if (res[p].responderResponse=="" && res[p].proposerAmount!="") {
                // user is a responder in the next round
                console.log("check line 320 in respondant.ts!")
                this.proposerAmt = res[p].proposerAmount;
                this.proposerUsername = res[p].proposerName;

              }

              else if (res[p].round!=0 && res[p].responderResponse!=""){
                this.firebaseId = res[p].proposerUUID + res[p].round + res[p].responderUUID + res[p].round
                let all=this.navParams.data;
                let dict={
                  UUID: all["UUID"],
                  username: all["username"],
                  GameId:all["GameId"],
                  gameMode: all["gameMode"],
                  Role:"Respondant",
                  // amount
                  FirebaseId:this.firebaseId,
                  // nextroundfirebaseid
                  Round:res[p].round,
                  // once
                  Result:this.result,  // new
                  // gonextround
                };
              this.navCtrl.setRoot(ResultPage,dict)
              }
            }

            //added this part if it is proposer now
            else if (res[p].proposerUUID==all.UUID && res[p].round.toString()==ress["round"].toString() && res[p].responderResponse=="" && res[p].proposerAmount==""){
              let all=this.navParams.data;
              let date=new Date();
              this.datetime=date.toISOString();
              let passnextpg={
                UUID:res[p].proposerUUID,
                username:res[p].proposerName,
                GameId: all["GameId"],
                gameMode: all["gameMode"],
                // Role
                // amount
                // FirebaseId
                // nextroundfirebaseid
                // round
                once:0,
                dateTime:this.datetime,
                // go next round
              };
              this.navCtrl.setRoot(ProposerPage,passnextpg);
            }
            else if (res[p].proposerUUID==all.UUID && res[p].round.toString()==ress["round"].toString() && res[p].proposerAmount!=""){
              let all=this.navParams.data;
              let date=new Date();
              this.datetime=date.toISOString();
              this.firebaseId = res[p].proposerUUID + res[p].round + res[p].responderUUID + res[p].round
              // let passnextpg={UUID:res[p].proposerUUID,username:res[p].proposerName,dateTime:this.datetime,GameId: all["GameId"]};
              let dict={
                UUID:res[p].proposerUUID,
                username:res[p].proposerName,
                GameId:all["GameId"],
                gameMode: all["gameMode"],
                Role:"Proposer",
                Amount:res[p].proposerAmount,
                FirebaseId:this.firebaseId,
                // nextroundfirebaseid
                Round:res[p].round,
                once:1,
                // gonextround
                dateTime:this.datetime,
              };
              this.navCtrl.setRoot(ResultPage,dict);
            }
        }
      })
    })
      this.StartTimer();
    }


  }


  StartTimer(){
    this.storage.get("responder").then((val) => {
      if (val=="false"){
    this.timer = setTimeout(x =>
      {
          if(this.maxtime <= 0) { }
          this.maxtime -= 1;

          if(this.maxtime>0){
           // this.hidevalue = false;
            this.StartTimer();
          }

          else if (this.maxtime==0){
            
         this.Accept();
           



         }

          else{
             // this.hidevalue = true;
          }

      }, 1000);
    }})

  }

  Accept(){    
    // update responder's response as 'Accept'
    this.storage.get("responder").then((val) => {
      if (val=="false"){
   
    let all=this.navParams.data;
    this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('responderUUID', '==', all["UUID"]));
    this.item = this.itemDoc.valueChanges();


    this.subscription= this.item.subscribe(res=>{


      for (let p=0;p<res.length;p++){
        if (res[p]==undefined || res[p]==null){
        }
        else{
          this.professorcode = this.afs.collection<any>('Professor').doc(all["GameId"])
          this.retrieveprofessor = this.professorcode.valueChanges();
          this.subscription=this.retrieveprofessor.subscribe(ress=>{
          if (res[p].responderUUID == all["UUID"] && res[p].round.toString() == ress["round"].toString() && res[p].responderResponse=="" && this.goonce==0){ //*** hardcoding round
            // store responderData here
            this.goonce+=1;
            this.responderData = res[p];
            this.firebaseId = res[p].proposerUUID + res[p].round + res[p].responderUUID + res[p].round
            console.log("firebaseId: " + this.firebaseId );
            this.storage.set("responder","true")
            this.updateResponderStatus(this.firebaseId, 'Accept');
            let all=this.navParams.data;
            let addround=res[p].round+1;

            let nextroundfirebaseid= res[p].proposerUUID + addround +  res[p].responderUUID + addround;
            let dict={
              "Role":"Respondant",
              "FirebaseId":this.firebaseId,
              "Result":"Accept",
              "GameId":all["GameId"],
              "Round":res[p].round,
              "nextroundfirebaseid":nextroundfirebaseid,
              gameMode: all["gameMode"],
              UUID: all["UUID"]
            };
            this.navCtrl.setRoot(ResultPage,dict)

         //   subject.next(this.firebaseId);
          }

        })}

      }

    })
    //return subject.asObservable();
    if (this.count==0){
        this.result="Accept";
        this.count+=1;
    }
  }
})

  }

  Decline(){
    // update responder's response as 'Decline'
    let all=this.navParams.data;
    this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('responderUUID', '==', all["UUID"]));
    this.item = this.itemDoc.valueChanges();


  this.subscription=  this.item.subscribe(res=>{

      console.log("My UUID: "+ all.UUID);
      for (let p=0;p<res.length;p++){
        if (res[p]==undefined || res[p]==null){
        }
        else{
          this.professorcode = this.afs.collection<any>('Professor').doc(all["GameId"])
          this.retrieveprofessor = this.professorcode.valueChanges();
          this.subscription=this.retrieveprofessor.subscribe(ress=>{
          if (res[p].responderUUID == all["UUID"] && res[p].round.toString() == ress["round"].toString()&& res[p].responderResponse=="" && this.goonce==0){ //*** hardcoding round
            // store responderData here
            this.goonce+=1;
            this.responderData = res[p];
            this.firebaseId =  res[p].proposerUUID + res[p].round + res[p].responderUUID + res[p].round;
            console.log("firebaseId: " + this.firebaseId );
            this.updateResponderStatus(this.firebaseId, 'Decline');
            let all=this.navParams.data;
            let addround=res[p].round+1;
            let nextroundfirebaseid= res[p].proposerUUID + addround +  res[p].responderUUID + addround;
            let dict={
              "Role":"Respondant",
              "FirebaseId":this.firebaseId,
              "Result":"Decline",
              "GameId":all["GameId"],
              "Round":res[p].round,
              "nextroundfirebaseid":nextroundfirebaseid,
              gameMode: all["gameMode"],
              UUID: all["UUID"]
            };
            this.navCtrl.setRoot(ResultPage,dict)

          }
        }
          )}
      }

    })
    if (this.count==0){
      this.result="Decline";
      this.count+=1;
  }

  }

  updateResponderStatus(dbid, responderResponse){
    // Updating the game status to "Ready"
    this.afs.collection('Game').doc(dbid).update({
      responderStatus: "Ready",
      responderResponse: responderResponse
     })
    .then((data) => {
      //console.log("Data: "+data);
    }).catch((err) => {
      console.log("Err: "+err);
    })
  }

  // async presentLoading(loading) {
  //   return await loading.present();
  // }

  ionViewDidLeave(){
    //this.subscription.unsubscribe();
  }
}
