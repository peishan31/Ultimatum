import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Loading } from 'ionic-angular';
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
  gohereonceagn=0;
  loader:Loading;
  username="";

  constructor(public navCtrl: NavController,
    public loadingCtrl:LoadingController,
    public afs: AngularFirestore,
    public navParams: NavParams,
    public storage:Storage,
    public toastCtrl:ToastController) {

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


  ionViewWillEnter(){


  }

  ionViewDidEnter(){
    let all=this.navParams.data;

    this.afs.collection<any>('Participant').ref
      .where('UUID', '==', all["UUID"])
      .get()
      .then(ress => {

      if (ress.docs.length != 0) {

        ress.forEach(ParticipantDoc => {
          this.username = ParticipantDoc.data().username;
        })
      }
      });

    console.log("<<Respondant.ts>> Game Mode: " + all["gameMode"]);
    this.storage.set("responder"+all["UUID"],"false");
    this.StartTimer();
    if (all["gameMode"] == "All same opponents") {

      // Yong Lin
      this.professorcode = this.afs.collection<any>('Professor').doc(all["GameId"])
    this.retrieveprofessor = this.professorcode.valueChanges();
    this.subscription=this.retrieveprofessor.subscribe(ress=>{
    this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('responderUUID', '==', all["UUID"]).where('round', '==', parseInt(ress["round"])));
    this.item = this.itemDoc.valueChanges();

   this.subscription= this.item.subscribe(res=>{
     console.log(res,"RESPRES")
     if (res.length!=0){
        // user is a responder in the next round
        this.proposerAmt = res[0].proposerAmount;
        console.log(res[0].proposerName,"Proposername")
        this.proposerUsername = res[0].proposerName;
     }
     //if cannot find the length, we test if its proposer
     
   
 
  
if (res.length==0){
  this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('proposerUUID', '==', all["UUID"]).where('round', '==', parseInt(ress["round"])));
    this.itemm = this.itemDoc.valueChanges();

  this.itemm.subscribe(resss=>{
     console.log(resss,"RESPRES2")
this.res=resss;
console.log(this.res,"RES")
for (let p=0;p<this.res.length;p++){
  let all=this.navParams.data;
setTimeout(() => {
    
      if (this.res[p].proposerUUID==all["UUID"] && this.res[p].round.toString()==ress["round"].toString() && this.res[p].responderResponse=="" && this.res[p].proposerAmount==""  && this.res[p].proposerAmount!=0){
        console.log("amounthere",this.res[p].proposerAmount)
        let all=this.navParams.data;
        let date=new Date();
    this.datetime=date.toISOString();
        let passnextpg={UUID:this.res[p].proposerUUID,username:this.res[p].proposerName,dateTime:this.datetime,GameId: all["GameId"],once:0, gameMode: all["gameMode"]};
        this.navCtrl.setRoot(ProposerPage,passnextpg);
     }
 

  }  , 5000);
  if (this.res[p].proposerUUID==all.UUID && this.res[p].round.toString()==ress["round"].toString() && this.res[p].proposerAmount!=""){
    let all=this.navParams.data;
    let date=new Date();
this.datetime=date.toISOString();
this.firebaseId = this.res[p].proposerUUID + this.res[p].round + this.res[p].responderUUID + this.res[p].round
    // let passnextpg={UUID:res[p].proposerUUID,username:res[p].proposerName,dateTime:this.datetime,GameId: all["GameId"]};
    let dict={"Role":"Proposer","FirebaseId":this.firebaseId,"Amount":this.res[p].proposerAmount,"GameId":all["GameId"],"Round":this.res[p].round,once:1,UUID:this.res[p].proposerUUID,username:this.res[p].proposerName,dateTime:this.datetime, gameMode: all["gameMode"]};
    this.navCtrl.setRoot(ResultPage,dict);
  }
}
})

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
              console.log("gonextround")
              this.navCtrl.setRoot(NextroundsPage)
            }

            else if (res[p].round==0 && res[p].proposerStatus=="Ready" && res[p].proposerAmount!='' && res[p].responderResponse!=""){
              let nextroundfirebaseid= res[p].proposerUUID + res[p].round.toString() +  res[p].responderUUID + res[p].round.toString();
              this.firebaseId = res[p].proposerUUID + res[p].round + res[p].responderUUID + res[p].round;
              console.log("went result")
              let dict={"Role":"Respondant","FirebaseId":this.firebaseId,"UUID":res[p].responderUUID,"Result":res[p].responderResponse,"GameId":all["GameId"],"Round":res[p].round,"nextroundfirebaseid":nextroundfirebaseid, gameMode: all["gameMode"]};
              this.navCtrl.setRoot(ResultPage,dict)
            }

           else if (res[p].responderResponse=="" && res[p].proposerAmount!="") {
              // user is a responder in the next round
              console.log("hu")
              this.proposerAmt = res[p].proposerAmount;
              console.log(res[p].proposerName,"Proposername")
              this.proposerUsername = res[p].proposerName;


            }

           else if (res[p].round!=0 && res[p].responderResponse!=""){
            this.firebaseId = res[p].proposerUUID + res[p].round + res[p].responderUUID + res[p].round
            let all=this.navParams.data;
            let dict={"Role":"Respondant","FirebaseId":this.firebaseId,"UUID":res[p].responderUUID,"Result":this.result,"GameId":all["GameId"],"Round":res[p].round, gameMode: all["gameMode"]};
           this.navCtrl.setRoot(ResultPage,dict)
           console.log("went here")
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
            let dict={"Role":"Proposer","FirebaseId":this.firebaseId,"Amount":res[p].proposerAmount,"UUID":res[p].proposerUUID,"GameId":all["GameId"],"Round":res[p].round,once:1,username:res[p].proposerName,dateTime:this.datetime, gameMode: all["gameMode"]};
            this.navCtrl.setRoot(ResultPage,dict);
          }



        }})})

    }
    else if (all["gameMode"] == "Random all players") {
      // Peishan
      //this.storage.get(all.UUID+"EnteredRespondant").then((val) => {

        //if (val == false) {
          if (this.gohereonceagn==0){

            this.gohereonceagn+=1;

            this.professorcode = this.afs.collection<any>('Professor').ref
              .where('gameId', '==', all["GameId"])
              .get()
              .then(ress => {

              if (ress.docs.length != 0) {
                ress.forEach(ProfessorDoc => {
                  console.log("UUID: " + all["UUID"]);
                  console.log("round: " + all["round"]);
                  this.itemDoc = this.afs.collection<any>('Game').ref
                    .where('responderUUID', '==', all["UUID"])
                    .where('round', '==', parseInt(ProfessorDoc.data().round));
                    console.log("ProfessorDoc's round!: " + ProfessorDoc.data().round);
                    this.itemDoc.get().then(res=>{ //sacso
                      //alert("MY UUID: " + all['UUID']);
                      if (res.docs.length != 0) {

                        res.forEach(RespondantGameDoc =>{

                          this.proposerAmt = RespondantGameDoc.data().proposerAmount;
                          console.log(RespondantGameDoc.data().proposerName,"Proposername")
                          this.proposerUsername = RespondantGameDoc.data().proposerName;

                          if (RespondantGameDoc.data().responderResponse=="" &&
                            RespondantGameDoc.data().proposerAmount!="") {

                            this.proposerAmt = RespondantGameDoc.data().proposerAmount;
                            this.proposerUsername = RespondantGameDoc.data().proposerName;

                          }

                        })
                      }
                    })
                })
              }
            })
          //}
          }
        //}
      //})
      /*.then(val=>{
        this.storage.get(all.UUID+"EnteredRespondant").then((val) => {

          if (val == true) {
            if (this.subscription) // use localstorage to unsub it
            this.subscription.unsubscribe()
          }
        })
      })*/

    }
 }


  StartTimer(){
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


  }

  Accept(){

    let all=this.navParams.data;
    if (all["gameMode"] == "All same opponents") {
      // update responder's response as 'Accept'
      this.storage.get("responder"+all["UUID"]).then((val) => {
        console.log("VAL",val)
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
                "UUID": all["UUID"]
              };
              this.storage.set("responder"+all["UUID"],"true")
              // clearTimeout(this.timer); 
              this.navCtrl.setRoot(ResultPage,dict);
              

          //   subject.next(this.firebaseId);
            }

          })}

      //   }

      // })
      //return subject.asObservable();
      if (this.count==0){
          this.result="Accept";
          this.count+=1;
      }
    }
  })
      }})
    }
    else if (all["gameMode"] == "Random all players") {

        // update responder's response as 'Accept'
        let all=this.navParams.data;
        console.log("all: " + JSON.stringify(all));
        this.storage.get(all.UUID+"EnteredRespondant").then((val) => {
          if (val == false) {
            this.itemDoc = this.afs.collection<any>('Game').ref
            .where('responderUUID', '==', all["UUID"]);
            //this.item = this.itemDoc.valueChanges();

            this.itemDoc.get().then(res=>{
              if (res.docs.length == 0) {
                // no documents found
              }
              else {
                res.forEach(RespondantGameDoc =>{ // userIndividualRound.data().gameMode

                  console.log(RespondantGameDoc);
                  console.log(RespondantGameDoc.data());
                  console.log(RespondantGameDoc.data().gameMode)

                  this.professorcode = this.afs.collection<any>('Professor').ref
                  .where('gameId', '==', all["GameId"])
                  .get()
                  .then(ress => {
                    if (ress.docs.length != 0) {
                      ress.forEach(ProfessorDoc => {

                        console.log(ProfessorDoc);
                        console.log(ProfessorDoc.data());

                        console.log("RespondantGameDoc.data().responderUUID: " + RespondantGameDoc.data().responderUUID);
                        console.log(all["UUID"]);
                        console.log(RespondantGameDoc.data().round.toString());
                        console.log(ProfessorDoc.data().round);
                        console.log(RespondantGameDoc.data().responderResponse);
                        console.log(RespondantGameDoc.data());
                        console.log(this.goonce);

                        if (RespondantGameDoc.data().responderUUID == all["UUID"] &&
                        RespondantGameDoc.data().round.toString() == ProfessorDoc.data().round && //**** Change this part!!! They are not equal
                        RespondantGameDoc.data().responderResponse=="" && this.goonce==0) {

                          // store responderData here
                          this.goonce+=1;
                          this.responderData = RespondantGameDoc.data();
                          this.firebaseId = RespondantGameDoc.data().proposerUUID + RespondantGameDoc.data().round + RespondantGameDoc.data().responderUUID + RespondantGameDoc.data().round
                          console.log("firebaseId: " + this.firebaseId );
                          let all=this.navParams.data;
                          this.storage.set("responder"+all["UUID"],"true")
                          this.updateResponderStatus(this.firebaseId, 'Accept');

                          let addround=RespondantGameDoc.data().round+1;

                          var nextroundfirebaseid = "2345";

                          if ((addround % 2 !=0)) // *****(it starts from 0)
                          { // swapping roles
                              nextroundfirebaseid= RespondantGameDoc.data().responderUUID + addround + RespondantGameDoc.data().proposerUUID + addround;
                          }

                          let dict={
                            UUID: all["UUID"],
                            username: all["username"],
                            GameId: all["GameId"],
                            gameMode: all["gameMode"],
                            Role:"Respondant", // Current Role
                            // Amount
                            FirebaseId: this.firebaseId,
                            nextroundfirebaseid: nextroundfirebaseid, // if addround % 2 != 0 --> user is randomized
                            Result:"Accept",
                            Round:RespondantGameDoc.data().round,
                            // once
                          };
                          localStorage.setItem("enterGameCode"+all.UUID, "NO");
                          this.storage.set(all.UUID+"EnteredRespondant", true);
                          // clearTimeout(this.timer); 
                          this.navCtrl.setRoot(ResultPage, dict);
                        }
                      })
                    }
                  })

                })
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

  }


  Decline(){

    let all=this.navParams.data;
    if (all["gameMode"] == "All same opponents") {

      // update responder's response as 'Decline'
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
                  "UUID": all["UUID"]
                };
                // clearTimeout(this.timer); 
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
    else if (all["gameMode"] == "Random all players") {

        //this.storage.get(all.UUID+"EnteredRespondant").then((val) => {

        //if (val == false) {

          this.itemDoc = this.afs.collection<any>('Game').ref
          .where('responderUUID', '==', all["UUID"]);
          //this.item = this.itemDoc.valueChanges();

          this.itemDoc.get().then(res=>{

            if (res.docs.length != 0) {

              res.forEach(RespondantGameDoc =>{

                this.professorcode = this.afs.collection<any>('Professor').ref
                .where('gameId', '==', all["GameId"])
                .get()
                .then(ress => {

                  if (ress.docs.length != 0) {
                    ress.forEach(ProfessorDoc => {
                      console.log("RespondantGameDoc.data().responderUUID: " + RespondantGameDoc.data().responderUUID);
                      console.log("all[UUID]: " + all["UUID"]);
                      console.log("RespondantGameDoc.data().round.toString(): " + RespondantGameDoc.data().round.toString());
                      console.log("ProfessorDoc.data().Round: " + ProfessorDoc.data().round);
                      console.log("RespondantGameDoc.data().responderResponse: " + RespondantGameDoc.data().responderResponse);
                      //console.log()
                      if (RespondantGameDoc.data().responderUUID == all["UUID"] &&
                      RespondantGameDoc.data().round.toString() == ProfessorDoc.data().round &&
                      RespondantGameDoc.data().responderResponse=="" && this.goonce==0){

                        // store responderData here
                        this.goonce+=1;
                        this.responderData = RespondantGameDoc.data();
                        this.firebaseId =  RespondantGameDoc.data().proposerUUID + RespondantGameDoc.data().round + RespondantGameDoc.data().responderUUID + RespondantGameDoc.data().round;
                        console.log("firebaseId: " + this.firebaseId );
                        let all=this.navParams.data;
                        this.storage.set("responder"+all["UUID"],"true")
                        this.updateResponderStatus(this.firebaseId, 'Decline');

                        let addround=RespondantGameDoc.data().round+1;

                        var nextroundfirebaseid = "2345";

                        if ((addround % 2 !=0)) // *****(it starts from 0)
                        { // swapping roles
                            nextroundfirebaseid= RespondantGameDoc.data().responderUUID + addround + RespondantGameDoc.data().proposerUUID + addround;
                        }
                        let dict={
                          UUID: all["UUID"],
                          username: all["username"],
                          GameId: all["GameId"],
                          gameMode: all["gameMode"],
                          Role:"Respondant", // Current Role
                          // Amount
                          FirebaseId: this.firebaseId,
                          nextroundfirebaseid: nextroundfirebaseid,  // if addround % 2 != 0 --> user is randomized
                          Result:"Decline",
                          Round:RespondantGameDoc.data().round,
                          // once
                        };
                        localStorage.setItem("enterGameCode"+all.UUID, "NO");
                        this.storage.set(all.UUID+"EnteredRespondant", true); 
                        // clearTimeout(this.timer); 
                        this.navCtrl.setRoot(ResultPage,dict)
                      }

                    })
                  }
                })
              })
            }
          })
        //}
      //})
        if (this.count==0){
          this.result="Decline";
          this.count+=1;
        }

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
      let all=this.navParams.data;
      this.storage.set("responder"+all["UUID"],"true");
      console.log("DID SET STORAGE")
    }).catch((err) => {
      console.log("Err: "+err);
    })
  }

  // async presentLoading(loading) {
  //   return await loading.present();
  // }

  ionViewDidLeave(){
    clearTimeout(this.timer);  console.log("Should I leave? Yes"); return true; 
    //this.subscription.unsubscribe();

  }
  ngOnDestroy() {

    let all=this.navParams.data;
    if (all["gameMode"] == "Random all players") {
      if (this.subscription) this.subscription.unsubscribe();
    }
  }
}
