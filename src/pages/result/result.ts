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
  arr=[];
  scoreboard=[];
  hi:any;
  currentround:number;
  score:number;
  professorcodes:any;
  totalproposeramount=0;
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
              if (this.Result=="Accept"){
                this.currentround=100-res["proposerAmount"];
              }
              else if (this.Result=="Decline"){
                this.currentround=0;
              }
              
              
    
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
}
