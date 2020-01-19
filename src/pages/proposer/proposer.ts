import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RespondantPage } from '../respondant/respondant';
import { AngularFirestore } from '@angular/fire/firestore';
import {LoadingController} from 'ionic-angular';
import { Subject, Observable, Subscription } from 'rxjs';
import { ResultPage } from '../result/result';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-proposer',
  templateUrl: 'proposer.html'
})
export class ProposerPage {
  range=0;
  itemDoc:any;
  item:any;
  proposerData:any;
  firebaseId = "";
  maxtime: any=30;
  timer:any;
  subscription:Subscription;
  subscriptionn:Subscription;
  offer:Subscription;
  game:Subscription;
  professorcode:any;
  retrieveprofessor:any;
  subscribed=false;
  subscriptiontrue=false;
  presstrue=false;
  goonce=0;
  once=0;
  addround=0
  constructor(public navCtrl: NavController,
    public afs: AngularFirestore,
    public loadingCtrl:LoadingController,
    public navParams: NavParams,
    public storage:Storage) {
      this.presstrue=false;
     // this.StartTimer()
    //  let all=this.navParams.data;
    //  this.itemDoc = this.afs.collection<any>('Game');
    //  this.item = this.itemDoc.valueChanges();

    // this.subscription= this.item.subscribe(res=>{
    //    console.log("Hi: "+ res);
    //    for (let p=0;p<res.length;p++){
    //      this.professorcode = this.afs.collection<any>('Professor').doc(all["gamecode"])
    //      this.retrieveprofessor = this.professorcode.valueChanges();
    //      this.subscription=this.retrieveprofessor.subscribe(ress=>{
    //        //if (res[p].responderUUID == all.UUID && res[p].gameId==all.gamecode) { --> ***GAMECODE TEMP NOT WORKING

    //        if (res[p].responderUUID == all.UUID && res[p].round.toString()==ress["round"].toString() && res[p].proposerAmount=='') {
             // user is a responder in the next round
            //  this.proposerAmt = res[p].proposerAmount;
            //  this.proposerUsername = res[p].proposerName;
    //        }

    //      })}

    //  })

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
             // this.hidevalue = true;
            // this.offer= this.submitProposerOffer().subscribe((r)=>{
            //             this.range=0;
            //  this.updateProfessorStatus(r);
            //  let dict={"Role":"Proposer","FirebaseId":this.firebaseId,"Amount":0};
            //  this.navCtrl.setRoot(ResultPage,dict)
            //  })
            this.presstrue=true;
            this.range=0;
            // this.submitProposerOffer();


          }

      }, 1000);


  }

  ionViewDidEnter(){
    this.storage.set("proposer","false")
    this.presstrue=false;
    this.StartTimer();

}

  Next(){

    let all=this.navParams.data;
    console.log("((proposer.ts page)): " + all["gameMode"]);
    if (all["gameMode"] == "All same opponents") {

      // Yong Lin
      this.presstrue=true;

    this.submitProposerOffer();






    // then loading screen for the responder to respond
      // const loading = this.loadingCtrl.create({

      // });

      // this.submitProposerOffer().subscribe((r)=>{
      //   console.log(r)
      // this.afs.collection('Game').doc(r).valueChanges().subscribe(res=>{

      //   console.log(res);
      //   console.log(res["responderResponse"]);
      //   console.log(res["gameId"]);
      //   if (res["responderResponse"]!=""){
      //     this.navCtrl.push(ResultPage)
      //     loading.dismissAll();
      //     loading.dismiss();
      //   }
      //   else{
      //     this.presentLoading(loading);
      //     loading.present();
      //   }

      // })});
      //this.navCtrl.setRoot(RespondantPage);
    }
    else if (all["gameMode"] == "Random all players") {
      // Peishan
      this.presstrue=true;
      this.submitProposerOfferRandomAllPlayers();
    }

  }

  submitProposerOffer(){
    // this.storage.get("proposer").then((val) => {
    //   if (val=="false"){
        if (this.presstrue==true){
          let data=this.navParams.data;
          if (this.once!=0){
            this.once=data["once"];
          }
          let all=this.navParams.data;
          this.professorcode = this.afs.collection<any>('Professor').doc(all["GameId"]);
          this.subscriptiontrue=true;
          this.retrieveprofessor = this.professorcode.valueChanges();
          this.subscriptionn=this.retrieveprofessor.subscribe(ress=>{
        // get the data using proposer's UUID
        // then combine the id with current-round+proposer-name+responder-name
        // using this id, update the proposerAmount & proposerStatus
        this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('proposerUUID', '==', data["UUID"]).where('round', '==', parseInt(ress["round"])));
        this.item = this.itemDoc.valueChanges();

    this.subscribed=true;
        this.subscription= this.item.subscribe(res=>{
          console.log(res,"RESSSSS")

          console.log("My UUID: "+ all.UUID);
          for (let p=0;p<res.length;p++){
            if (res[p]==undefined || res[p]==null){
            }
            else{
              let all=this.navParams.data;
              console.log(all["GameId"])

              console.log(ress,"RESS")
            let roundnow=res[p].round.toString();
            let professorroundnow=ress["round"]
            console.log(roundnow,"roundnow");
            console.log(professorroundnow,"proroundnow")



              if (res[p].proposerUUID == all["UUID"] && roundnow==professorroundnow && res[p].responderResponse=="" && this.goonce==0 && this.once==0){ //*** hardcoding round
                // store proposerData here


                this.proposerData = res[p];
               // this.firebaseId = res[p].round + res[p].proposerName + res[p].responderName //ps code i comment out
               this.firebaseId= res[p].proposerUUID + res[p].round +  res[p].responderUUID +res[p].round;

                console.log("firebaseId: " + this.firebaseId );
                this.storage.set("proposer","true")
                this.updateProfessorStatus(this.firebaseId);
                this.goonce+=1;
                this.once+=1;
                let all=this.navParams.data;
                this.presstrue=false;
                let addround=res[p].round+1;
                if (addround<5){
                  let nextroundfirebaseid= res[p].proposerUUID + addround +  res[p].responderUUID + addround;
                  let dict={"Role":"Proposer","FirebaseId":this.firebaseId,"Amount":this.range,"GameId":all["GameId"],"Round":res[p].round,"once":1,"nextroundfirebaseid":nextroundfirebaseid, gameMode: data["gameMode"]};
                  this.presstrue=false;
                  this.navCtrl.setRoot(ResultPage,dict);
                  this.presstrue=false;
                }
                else{
                  let nextroundfirebaseid=res[p].responderUUID + addround + res[p].proposerUUID  + addround;
                  let dict={"Role":"Proposer","FirebaseId":this.firebaseId,"Amount":this.range,"GameId":all["GameId"],"Round":res[p].round,"once":1,"nextroundfirebaseid":nextroundfirebaseid, gameMode: data["gameMode"]};
                  this.presstrue=false;
                  this.navCtrl.setRoot(ResultPage,dict);
                  this.presstrue=false;
                }



              }
            }

          }})}
    
    
    
        )} 
    //   }
    // })
  



  }

  submitProposerOfferRandomAllPlayers() {

    let all=this.navParams.data;
    if (this.presstrue) {

      if (this.once!=0){
        this.once = all["once"]
      }
    }

    this.professorcode = this.afs.collection<any>('Professor').doc(all["GameId"]);
    this.subscriptiontrue=true;
    this.retrieveprofessor = this.professorcode.valueChanges(); // tryna retrieve current round from the Professor table

    this.subscriptionn=this.retrieveprofessor.subscribe(ress=>{

      console.log("BALLING: " + all["UUID"]);
      this.itemDoc = this.afs.collection<any>('Game', ref =>
      ref // should only return one val
      .where('gameId', '==', all["GameId"])
      .where('proposerUUID', '==', all["UUID"])
      .where('round', '==', parseInt(ress["round"])) // retrieve that specific round
      );
      this.item = this.itemDoc.valueChanges();
      this.subscribed=true;

      this.subscription= this.item.subscribe(gameValues=>{

        for (let p=0;p<gameValues.length;p++){
          if (gameValues[p]==undefined || gameValues[p]==null) {

          }
          else {

            console.log("((proposer.ts)) GameId: "+ all["GameId"]);

            if (gameValues[p].proposerUUID == all["UUID"] && gameValues[p].responderResponse==""){
              // storing proposerData
              this.proposerData = gameValues[p];
              this.firebaseId= gameValues[p].proposerUUID + gameValues[p].round +  gameValues[p].responderUUID + gameValues[p].round;
              this.updateProfessorStatus(this.firebaseId);

              let addround=gameValues[p].round+1;

              // round 1, 3, 5, 7, 9 just have to swap their roles
              // round 0, 2, 4, 6, 8, 10, 12, 14, 16, 18 is required to randomly generate the user
              if (addround<(gameValues[p].totalRound*2))
              {
                if ((addround % 2 !=0)) // *****(it starts from 0)
                { // swapping roles
                  let nextroundfirebaseid= gameValues[p].responderUUID + addround + gameValues[p].proposerUUID + addround;

                  let dict={
                    UUID: all["UUID"],
                    username: all["username"],
                    GameId:all["GameId"],
                    gameMode: all["gameMode"],
                    Role:"Proposer",
                    Amount:this.range,
                    FirebaseId: this.firebaseId,
                    nextroundfirebaseid:nextroundfirebaseid,
                    Round:gameValues[p].round,
                    once:1
                  };

                console.log("((proposer.ts)): "+ all["UUID"]);
                this.navCtrl.setRoot(ResultPage,dict);
              }
              else
              { // randomizing role in the previous round
                let nextroundfirebaseid= "23454"; // nth cos they are randomizing users now

                  let dict={
                    UUID: all["UUID"],
                    username: all["username"],
                    GameId:all["GameId"],
                    gameMode: all["gameMode"],
                    Role:"Proposer",
                    Amount:this.range,
                    FirebaseId: this.firebaseId,
                    nextroundfirebaseid:nextroundfirebaseid, // empty string
                    Round:gameValues[p].round,
                    once:1
                  };

                  console.log("((proposer.ts)): "+ all["UUID"]);
                  this.navCtrl.setRoot(ResultPage,dict);
                }
              }
            }
          }
        }

      })
    })
  }

  updateProfessorStatus(dbid){
    // Updating the game status to "Ready"
    this.afs.collection('Game').doc(dbid).update({
      proposerStatus: "Ready",
      proposerAmount: this.range
     })
    .then((data) => {
      //console.log("Data: "+data);
    }).catch((err) => {
      console.log("Err: "+err);
    })
  }



  async presentLoading(loading) {
    return await loading.present();
  }

  ionViewDidLeave(){
    if (this.subscribed==true){
         this.subscription.unsubscribe();
    }
    if (this.subscriptiontrue==true){
      this.subscriptionn.unsubscribe();
    }

   // this.offer.unsubscribe();
  //  this.game.unsubscribe();
  }
}

