import { Component } from '@angular/core';
import { NavController, NavParams, NavOptions } from 'ionic-angular';
import { ProfessorHomePage } from '../professor-home/professor-home';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { UserPresenceStatusProvider } from '../../providers/user-presence-status/user-presence-status';
import * as firebase from 'firebase';

@Component({
  selector: 'page-scoreboard',
  templateUrl: 'scoreboard.html'
})
export class ScoreboardPage {
hi:any;
item:any;
itemDoc:any;
i=0;
subscription:Subscription
list=[]
myPerson=[]
studentnum=0;
scoreboard=[];

studentsList={"username": [], "UUID": [], "totalRound": 0}

proposerUUID="";
proposerName="";
responderUUID="";
responderName="";

  constructor(public navCtrl: NavController,
    public navParams:NavParams,
    public afs:AngularFirestore,
    public UserPresenceStatusProvider: UserPresenceStatusProvider
    ) {
    this.hi=navParams.data;
  }

  Home(){
    this.navCtrl.setRoot(ProfessorHomePage);
  }


  ionViewDidEnter(){
    this.i=0;
    this.scoreboardscore();
  }

  nextround(){

    this.hi=this.navParams.data;
    if (this.hi["gameMode"] == "All same opponents")
    {
      // Yong Lin's code
      this.itemDoc = this.afs.collection<any>('Professor').doc(this.hi["gameId"])
      this.item = this.itemDoc.valueChanges();
      this.subscription=this.item.subscribe(res=>{
        if (this.i==0){
          let round=parseInt(res["round"]);
          if (round<9){
            this.i+=1;
            round=round+1;
            this.afs.collection('Professor').doc(this.hi["gameId"]).update({
              round:round.toString(),
            })
            .then((data) => {
              console.log("Data: ");
              this.navCtrl.setRoot(ProfessorHomePage,{"gameId": this.hi["gameId"],gameMode: this.hi["gameMode"], waitForStudent:true})
            }).catch((err) => {
                console.log("Err: "+err);
                this.item.length=0;
                this.item.subscribe(res=>{
                  this.list.length=0;
                  //console.log(res)
                })
            })
          }
        }
      })
    }
    else if (this.hi["gameMode"] == "Random all players")
    {
      // Peishan's code
      // Check how many round it currently is (<19)!
      // Check if users are online/offline
      // Arrange and see how many rounds can players play with the user
      this.itemDoc = this.afs.collection<any>('Professor').doc(this.hi["gameId"])
      this.item = this.itemDoc.valueChanges();
      this.subscription=this.item.subscribe(res=>{
        if (this.i==0){
          let round=parseInt(res["round"]);
          if (round<19){
            console.log("Previous round: " + round);
            this.i+=1;
            round=round+1;
            console.log("Current round: " + round);
            //console.log("current round: " + round);
            this.afs.collection('Professor').doc(this.hi["gameId"]).update({
              round:round.toString(),
            })
            .then((data) => {
              console.log("Data: ");
              this.navCtrl.setRoot(ProfessorHomePage,{"gameId": this.hi["gameId"],gameMode: this.hi["gameMode"], waitForStudent:true})
            }).catch((err) => {
                console.log("Err: "+err);
                this.item.length=0;
                this.item.subscribe(res=>{
                  this.list.length=0;
                  //console.log(res)
                })
            })

            console.log("Hang on... Arranging another player...");
            // 1. Check if any user(s) disconnect & update them (1/2/2020)
            this.UserPresenceStatusProvider.updateUserPresenceStatus();

            // 2. arrange them in sequence again & 3. Insert them in db based on the current round
            if (round % 2 != 0) {
              // ********if round is an even num, retrieve the previous proposerUUID, proposerName, responderUUID and responder name
              // retrieve the previous proposerUUID, proposerName, responderUUID, responderName from database <<Game>>
              // var prevRound = round - 1;
              // where res[p].gameId==this.hi["gameId"] and res[p].round==prevRound; ---> store this into a list
              // this.proposerUUID, this.proposerName, this.responderUUID, this.responderName --> Swap the placing
              // Insert the data in <<Game>>
              var prevRound = round-1;
              this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('gameId', '==', this.hi["gameId"]).where('round', '==', prevRound));
              this.item = this.itemDoc.valueChanges();

              this.subscription = this.item.subscribe(res=>{

                for (let p=0;p<res.length;p++) {

                    // get this.proposerUUID, this.proposerName, this.responderUUID, this.responderName
                    this.proposerUUID = res[p].responderUUID;
                    this.responderUUID = res[p].proposerUUID;
                    this.proposerName = res[p].responderName;
                    this.responderName = res[p].proposerName;

                    var id = this.proposerUUID + round + this.responderUUID + round;
                    this.afs.collection('Game').doc(id).set({
                      gameId:this.hi["gameId"],
                      gameMode: 'Random all players',
                      round: round,
                      totalRound: 10,
                      dateTime: new Date().toISOString(),
                      proposerUUID: this.proposerUUID,
                      proposerName: this.proposerName,
                      responderUUID: this.responderUUID,
                      responderName: this.responderName,
                      proposerAmount: "",
                      responderResponse: "",
                      proposerStatus: "Not Ready",
                      responderStatus: "Not Ready",
                      gameStatus: "Not Ready"
                      })
                    .then((data) => {
                      //console.log("Data: "+data);
                    }).catch((err) => {
                      console.log("Err: "+err);
                    })
                }
              })
            }
            else {
              this.assignUserToPlayWithAnotherUser(round);
            }


            console.log("Added name???");
          }
        }
      })
    }
  }

  scoreboardscore(){
    this.hi=this.navParams.data;
    this.itemDoc = this.afs.collection<any>('Professor').doc(this.hi["gameId"])
    this.item = this.itemDoc.valueChanges();

    this.subscription=this.item.subscribe(ress=>{
    this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('gameId', '==', this.hi["gameId"]).where('round', '==', parseInt(ress["round"])));
    this.item = this.itemDoc.valueChanges();
    this.subscription= this.item.subscribe(res=>{
      for (let p=0;p<res.length;p++){
        if (res[p].responderResponse=="Decline"){
          let proposerlist={"username":res[p].proposerName,"score":0,"role":"Proposer"}
          let responderlist={"username":res[p].responderName,"score":0,"role":"Responder"}
          this.scoreboard.push(proposerlist)
          this.scoreboard.push(responderlist)
        
         }
       else if (res[p].responderResponse=="Accept"){
            let proposerlist={"username":res[p].proposerName,"score":res[p].proposerAmount,"role":"Proposer"}
            let responderlist={"username":res[p].responderName,"score":res[p].proposerAmount,"role":"Responder"}
            this.scoreboard.push(proposerlist)
            this.scoreboard.push(responderlist)
                  }
        
       
     
  }


  derangementNumber(n) {
    if(n == 0) {
      return 1;
    }
    var factorial = 1;
    while(n) {
      factorial *= n--;
    }
    return Math.floor(factorial / Math.E);
  }

  derange(array) {
    array = array.slice();
    var mark = array.map(function() { return false; });
    for(var i = array.length - 1, u = array.length - 1; u > 0; i--) {
      if(!mark[i]) {
        var unmarked = mark.map(function(_, i) { return i; })
          .filter(function(j) { return !mark[j] && j < i; });
        var j = unmarked[Math.floor(Math.random() * unmarked.length)];

        var tmp = array[j];
        array[j] = array[i];
        array[i] = tmp;

        // this introduces the unbiased random characteristic
        if(Math.random() < u * this.derangementNumber(u - 1) /  this.derangementNumber(u + 1)) {
          mark[j] = true;
          u--;
        }
        u--;
      }
    }
    return array;
  }

  assignUserToPlayWithAnotherUser(currentRound){
    // Calling out all the users joining this gameId
    this.itemDoc = this.afs.collection<any>('Participant');
    this.item = this.itemDoc.valueChanges();
    this.item.subscribe(res=>{
      this.studentsList["username"] = [];
      this.studentsList["UUID"] = [];
      for (let i=0; i<res.length;i++){

        if ((res[i].gameId==this.hi["gameId"]) && (res[i].online == true)){ // must be inside the game & online
          console.log("res[i]: " + JSON.stringify(res[i]));
          this.studentsList["username"].push(res[i].username);
          console.log("My username: " + res[i].username);
          this.studentsList["UUID"].push(res[i].UUID);
          this.studentnum=this.studentsList["username"].length;
        }
      }
      this.studentsList["totalRound"] = this.studentsList["username"].length;
      console.log("Student List: "+this.studentsList["username"]); // push users in this id

      if (this.studentsList["username"].length % 2 != 0) // odd number; needs to generate AI
      {
        this.studentsList["username"][this.studentsList["username"].length] = "AI-101";
        this.studentsList["UUID"].push("101");
        //this.studentsIdList[this.studentsList.length] = 1;
      }

      // splitting users into 2 groups
      var half_length = Math.ceil(this.studentsList["username"].length / 2);
      var areaA = this.studentsList["username"].splice(0, half_length);
      var areaB = this.studentsList["username"];
      var areaAUUID = this.studentsList["UUID"].splice(0, half_length);
      var areaBUUID = this.studentsList["UUID"];
      console.log("areaA: "+ areaA);
      console.log("areaB: "+ areaB);
      console.log("areaA's id: "+ areaAUUID);
      console.log("areaB's id: "+ areaBUUID);

      this.assignProposerAndResponder(areaA, areaB, areaAUUID, areaBUUID, currentRound);
      // calculating how many rounds it would take for all users to play against each other in 2 groups.
      //this.assignProposerAndResponder (areaA, areaB, areaAUUID, areaBUUID, half_length, this.studentsList["totalRound"]);
      //this.assignProposerAndResponder (areaB, areaA,  half_length);
    });
  }

  assignProposerAndResponder (proposer, responder, proposerUUID, responderUUID, currentRound){

    var arrangedUsersA = this.derange(proposer);
    var arrangedUsersB = this.derange(responder);

    console.log("Before shuffle: (areaA)" + proposer);
		console.log("Now: (areaA)" + arrangedUsersA);

		console.log("Before shuffle: (areaB)" + responder);
    console.log("Now: (areaB)" + arrangedUsersB);

    for (var i=0 ; i < arrangedUsersA.length; i++) {

      console.log(arrangedUsersA[i] + " VS " + arrangedUsersB[i]);

      var id = proposerUUID[i] + currentRound + responderUUID[i] + currentRound;
        this.afs.collection('Game').doc(id).set({
          gameId:this.hi["gameId"],
          gameMode: 'Random all players',
          round: currentRound,
          totalRound: 10,
          dateTime: new Date().toISOString(),
          proposerUUID: proposerUUID[i],
          proposerName: proposer[i],
          responderUUID: responderUUID[i],
          responderName: responder[i],
          proposerAmount: "",
          responderResponse: "",
          proposerStatus: "Not Ready",
          responderStatus: "Not Ready",
          gameStatus: "Not Ready"
         })
        .then((data) => {
          //console.log("Data: "+data);
        }).catch((err) => {
          console.log("Err: "+err);
        })
		}
  }
}
     ) })}
}
