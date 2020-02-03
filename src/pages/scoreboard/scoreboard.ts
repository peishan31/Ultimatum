import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, NavOptions, Loading } from 'ionic-angular';
import { ProfessorHomePage } from '../professor-home/professor-home';
import { AngularFirestore } from '@angular/fire/firestore';
import {LoadingController} from 'ionic-angular';
import { Subscription } from 'rxjs';
import { UserPresenceStatusProvider } from '../../providers/user-presence-status/user-presence-status';
import * as firebase from 'firebase';
import { ViewpastornewPage } from '../viewpastornew/viewpastornew';
import { snapshotChanges } from '@angular/fire/database';

@Component({
  selector: 'page-scoreboard',
  templateUrl: 'scoreboard.html'
})
export class ScoreboardPage {
mode:string;
hi:any;
item:any;
itemDoc:any;
i=0;
subscription:Subscription
list=[]
myPerson=[]
studentnum=0;
scoreboard=[];
roundsselectedfilter:number;
studentsList={"username": [], "UUID": [], "totalRound": 0}
scorefilter:string;
proposerUUID="";
proposerName="";
responderUUID="";
responderName="";
arr:any;
currentround:number;
totalround:number;
retrievedvalue:any;
u=0;
roundss=[];
selecting="Accumulated rounds";
loader:Loading;
randomModeTotalRound="";
  constructor(public navCtrl: NavController,
    public navParams:NavParams,
    public afs:AngularFirestore,
    public UserPresenceStatusProvider: UserPresenceStatusProvider,
    public loadingCtrl:LoadingController
    ) {
    this.hi=navParams.data;
    this.mode=this.hi["gameMode"] ;
  }

  Home(){
    var result = confirm("Do you really want to leave the game?");
    if (result == true) {
      window.open('https://ultimatum-f9099.firebaseapp.com/', '_self')
      //this.navCtrl.setRoot(ViewpastornewPage);
    }

  }


  ionViewDidEnter(){
    this.u=0;
    this.scoreboardscore();
    if (this.hi["gameMode"] == "All same opponents")
    {
      // Yong Lin's code
      this.itemDoc = this.afs.collection<any>('Professor').doc(this.hi["gameId"])
      this.item = this.itemDoc.valueChanges();
      this.subscription=this.item.subscribe(res=>{
        if (this.u==0){
          this.currentround=parseInt(res["round"]);
          this.totalround=parseInt(res["totalround"])-1;
          for (let i=0;i<this.totalround+1;i++){
            this.roundss.push(i+1);
          }
            this.u+=1;
          }

      })
    }
    else if (this.hi["gameMode"] == "Random all players")
    {
      // Peishan's code
      this.itemDoc = this.afs.collection<any>('Professor').doc(this.hi["gameId"])
      this.item = this.itemDoc.valueChanges();
      this.subscription=this.item.subscribe(res=>{

        if (this.u==0){
          this.currentround=parseInt(res["round"]);
          this.totalround=parseInt(res["totalround"])-1;
          for (let i=0;i<this.totalround+1;i++){
            this.roundss.push(i+1);
          }
            this.u+=1;


          }
        })
    }
  }

  nextround(){
    this.hi=this.navParams.data;
    if (this.hi["gameMode"] == "All same opponents")
    {
      // Yong Lin's code
      this.loader =  this.loadingCtrl.create({

      });
      this.loader.present();
      this.itemDoc = this.afs.collection<any>('Professor').doc(this.hi["gameId"])
      this.item = this.itemDoc.valueChanges();
      this.subscription=this.item.subscribe(res=>{
        if (this.i==0){
          let round=parseInt(res["round"]);
          if (round<(parseInt(res["totalround"])-1)){
            this.i+=1;
            round=round+1;

            this.afs.collection<any>('Participant').ref
              .where("gameId","==", this.hi["gameId"])
              .where("online", "==", true)
              .get()
              .then(ress => {

                if (ress.docs.length != 0) {
                  // alert("ress.docs.length: " + ress.docs.length);
                  if (ress.docs.length%2==0) {

                    this.afs.collection('Professor').doc(this.hi["gameId"]).update({
                      round:round.toString(),
                    })
                    .then((data) => {
                      console.log("Data: ");
                      this.loader.dismiss();
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
                  else {
                    alert("There is currently only " + ress.docs.length + " students in the game. Game cannot continue as there is odd number of students!");
                    window.open('https://ultimatum-5c5e6.firebaseapp.com/', '_self')
                  }
                }
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
      this.loader =  this.loadingCtrl.create({

      });
      this.loader.present();

      this.itemDoc = this.afs.collection<any>('Professor').doc(this.hi["gameId"])
      this.item = this.itemDoc.valueChanges();
      this.subscription=this.item.subscribe(res=>{

        if (parseInt(res["totalround"])!=res["round"]+1){
        this.randomModeTotalRound = res["totalround"];
        if (this.i==0){
          let round=parseInt(res["round"]);
          //let totalRound=parseInt(res["totalRound"]) * 2;
          if (round<(parseInt(res["totalround"])-1)){
            console.log("Previous round: " + round);
            this.i+=1;
            round=round+1;
            console.log("Current round: " + round);
            //console.log("current round: " + round);

            this.itemDoc = this.afs.collection<any>('Participant').ref
              .where("gameId","==", this.hi["gameId"])
              .where("online", "==", true)
              .get()
              .then(ress => {

                if (ress.docs.length != 0) {
                  // alert("ress.docs.length: " + ress.docs.length);
                  if (ress.docs.length%2==0) {

                    this.afs.collection('Professor').doc(this.hi["gameId"]).update({
                      round:round.toString(),
                    })
                    .then((data) => {
                      this.loader.dismiss();
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
                      this.afs.collection<any>('Game').ref
                      .where('gameId', '==',  this.hi["gameId"])
                      .where('round', '==', prevRound)
                      .get()
                      .then(ress => {

                        if (ress.docs.length != 0) {

                          ress.forEach(GameDoc => {

                            // get this.proposerUUID, this.proposerName, this.responderUUID, this.responderName
                            this.proposerUUID = GameDoc.data().responderUUID;
                            this.responderUUID = GameDoc.data().proposerUUID;
                            this.proposerName = GameDoc.data().responderName;
                            this.responderName = GameDoc.data().proposerName;
                            console.log("HIIIIIII: " + GameDoc.data().totalround)
                            var id = this.proposerUUID + round + this.responderUUID + round;
                            this.afs.collection('Game').doc(id).set({
                            gameId:this.hi["gameId"],
                            gameMode: 'Random all players',
                            round: round,
                            totalRound: this.randomModeTotalRound,
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
                          })
                        }
                      })
                    }
                    else { // randomize player

                      this.assignUserToPlayWithAnotherUser(round, this.randomModeTotalRound);

                    }
                    //console.log("Added name???");

                  }
                  else {
                    alert("There is currently only " + ress.docs.length + " students in the game. Game cannot continue as there is odd number of students!");
                    window.open('https://ultimatum-5c5e6.firebaseapp.com/', '_self')
                  }
                }
              })
          }
          else {
            alert("Cannot click any further!");;
            console.log("Cannot click another further!");
          }
        }
      }},  error => { this.loader.dismiss() })

    }
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({

    });
    await this.loader.present();
  }

  async dismissLoading() {
    await this.loader.dismiss();
  }

  scoreboardscore(){
    this.hi=this.navParams.data;
    this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('gameId', '==', this.hi["gameId"]).where('proposerStatus', '==', "Ready"));
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

  for (let i=0; i<this.arr.length;i++){
    this.itemDoc = this.afs.collection<any>('Professor', ref => ref.where('gameId', '==', this.hi["gameId"]));
    this.item = this.itemDoc.valueChanges();
    this.subscription= this.item.subscribe(ress=>{
      this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('gameId', '==', this.hi["gameId"]).where('proposerName', '==', this.arr[i].username).where('round', '==', parseInt(ress[0].round)));
    this.item = this.itemDoc.valueChanges();
    this.subscription= this.item.subscribe(retrievecurrentroundvalue=>{
      if (retrievecurrentroundvalue.length!=0){
        console.log(retrievecurrentroundvalue[0].proposerAmount)
       this.arr[i].role="Proposer";
       this.arr[i].result=retrievecurrentroundvalue[0].responderResponse;
       if (retrievecurrentroundvalue[0].proposerAmount==0|| retrievecurrentroundvalue[0].responderResponse=="Decline"){
        this.arr[i].scorethisround=0;
       }
       else{
         this.arr[i].scorethisround=100-retrievecurrentroundvalue[0].proposerAmount;
       }

      }
      else{
        this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('gameId', '==', this.hi["gameId"]).where('responderName', '==', this.arr[i].username).where('round', '==', parseInt(ress[0].round)));
        this.item = this.itemDoc.valueChanges();
        this.subscription= this.item.subscribe(retrievecurrentroundvalue=>{
          if (retrievecurrentroundvalue.length!=0&&retrievecurrentroundvalue[0].responderResponse!="Decline"){
            this.arr[i].role="Responder";
            this.arr[i].result=retrievecurrentroundvalue[0].responderResponse;
            this.arr[i].scorethisround=retrievecurrentroundvalue[0].proposerAmount;
          }
          else if (retrievecurrentroundvalue.length!=0&&retrievecurrentroundvalue[0].responderResponse=="Decline"){
            this.arr[i].role="Responder";
            this.arr[i].result=retrievecurrentroundvalue[0].responderResponse;
            this.arr[i].scorethisround=0;

          }
        })

      }

      })
    })
      }
    })
    }

  assignUserToPlayWithAnotherUser(currentRound, totalround){
    // Calling out all the users joining this gameId
   this.itemDoc = this.afs.collection<any>('Participant').ref
    .get()
    .then(ress => {

      if (ress.docs.length != 0) {

          this.studentsList["username"] = [];
          this.studentsList["UUID"] = [];

          ress.forEach(ProfessorDoc => {

            /*db.database.ref('/User/').orderByChild('uID').equalTo(this.uID).once('value', (snapshot) => {
              console.log(snapshot.val().email)
          })*/

            //if ((res[i].gameId==this.hi["gameId"]) && (res[i].online == true)){ // must be inside the game & online
            if ((ProfessorDoc.data().gameId==this.hi["gameId"]) && ProfessorDoc.data().online == true){
              // console.log("res[i]: " + JSON.stringify(res[i]));

              /*const requestRef = firebase.database().ref(`/` + "User" + `/` + res[i].username + `/`);
              requestRef.orderByChild('inGame')
                .equalTo(true)
                .once('value')
                .then(snapshot=>{
                  alert(snapshot)
                  alert(JSON.stringify(snapshot.val()));
                })
                .then((data) => {// your handle code here})
                    //data.id

                })*/
                const personRefs: firebase.database.Reference = firebase.database().ref(`/` + "User" + `/`  + ProfessorDoc.data().UUID + `/`);
                personRefs.on('value', snapshot => {

                  if ((snapshot.val().inGame == true)) {
                    //alert(snapshot.val().UUID);
                    this.studentsList["username"].push(ProfessorDoc.data().username);
                    console.log("My username: " + ProfessorDoc.data().username);
                    this.studentsList["UUID"].push(ProfessorDoc.data().UUID);
                    this.studentnum=this.studentsList["username"].length;
                  }
                })
                personRefs.off('value');
            }
          })

          console.log(ress)

          this.studentsList["totalRound"] = this.studentsList["username"].length;
          console.log("Student List: "+this.studentsList["username"]); // push users in this id

          /*if (this.studentsList["username"].length % 2 != 0) // odd number; needs to generate AI
          {
            this.studentsList["username"][this.studentsList["username"].length] = "AI-101";
            this.studentsList["UUID"].push("101");
            //this.studentsIdList[this.studentsList.length] = 1;
          }*/
          // randomizing
          /*var firstusername = this.studentsList["username"].shift();
          this.studentsList["username"].push(firstusername);

          var firstUUID = this.studentsList["UUID"].shift();
          this.studentsList["UUID"].push(firstUUID);*/

          var chosenIndex = Math.floor(Math.random() * this.studentsList["username"].length);
          console.log("chosenIndex: " + chosenIndex);

          console.log("chosenVal: " + this.studentsList["username"][chosenIndex]);
          console.log("Before: " + this.studentsList["username"]);

          var storeChosenVal = this.studentsList["username"][chosenIndex];
          this.studentsList["username"].splice(chosenIndex, 1);

          this.studentsList["username"].push(storeChosenVal);
          console.log("After: " + this.studentsList["username"]);

          console.log("chosenVal: " + this.studentsList["UUID"][chosenIndex]);
          console.log("Before: " + this.studentsList["UUID"]);

          var storeChosenValUUID = this.studentsList["UUID"][chosenIndex];
          this.studentsList["UUID"].splice(chosenIndex, 1);

          this.studentsList["UUID"].push(storeChosenValUUID);
          console.log("After: " + this.studentsList["UUID"]);


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

          this.assignProposerAndResponder(areaA, areaB, areaAUUID, areaBUUID, currentRound, totalround);
          // calculating how many rounds it would take for all users to play against each other in 2 groups.
          //this.assignProposerAndResponder (areaA, areaB, areaAUUID, areaBUUID, half_length, this.studentsList["totalRound"]);
          //this.assignProposerAndResponder (areaB, areaA,  half_length);

      }

    });
  }

  assignProposerAndResponder (proposer, responder, proposerUUID, responderUUID, currentRound, totalround){


    /*if ( (proposer.length+responder.length) == 4) {
      var arrangedUsersA = this.shuffle(proposer);
      var arrangedUsersB = this.shuffle(responder);
    }
    else {
      arrangedUsersA = this.derange(proposer);
      arrangedUsersB = this.derange(responder);
    }*/

    var arrangedUsersA = proposer;
    var arrangedUsersB = responder;

    console.log("Before shuffle: (areaA)" + proposer);
		console.log("Now: (areaA)" + arrangedUsersA);

		console.log("Before shuffle: (areaB)" + responder);
    console.log("Now: (areaB)" + arrangedUsersB);

    var totalUser = proposer.length + responder.length;

    if (totalUser%2==0) {
      for (var i=0 ; i < arrangedUsersA.length; i++) {

        console.log(arrangedUsersA[i] + " VS " + arrangedUsersB[i]);

        var id = proposerUUID[i] + currentRound + responderUUID[i] + currentRound;
          this.afs.collection('Game').doc(id).set({
            gameId:this.hi["gameId"],
            gameMode: 'Random all players',
            round: currentRound,
            totalRound: totalround,
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
    else {
      //alert("HELL NOOOOOOOOOOOOOOO @scoreboard.ts");
      alert("Currently, there is " + totalUser + " student(s). You can't proceed because the number of students are in odd number!");
      this.navCtrl.setRoot(ProfessorHomePage);
    }
  }

  onSelectChange(selectedValue: any) {
    console.log('Selected', selectedValue);
    if (selectedValue=="Individual round"){
     this.selecting="Individual round";
     this.roundsselectedfilter=this.totalround+1;
     this.roundselect(this.roundsselectedfilter);
    }
    // else if (selectedValue=="Score- High to Low"){
      // let shandss = document.getElementsByClassName('hidecollectedby') as HTMLCollectionOf<HTMLElement>;
      // shandss[0].style.display="";
      // let shandsss = document.getElementsByClassName('hidesign') as HTMLCollectionOf<HTMLElement>;
      // shandsss[0].style.display="";
    //   this.selecting="Score- High to Low";
    // }
    // else if (selectedValue=="Score- Low to High"){
    // this.selecting="Score- Low to High";
    // }
    else if (selectedValue=="Accumulated rounds"){
      this.selecting="Accumulated rounds";
      this.scoreboardscore();

    }
  }

    roundselect(selectedValue: any) {
      this.roundsselectedfilter=parseInt(selectedValue);
      let list=[];
      this.hi=this.navParams.data;
        this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('gameId', '==', this.hi["gameId"]).where('round', '==', selectedValue-1));
      this.item = this.itemDoc.valueChanges();
      this.subscription= this.item.subscribe(retrievecurrentroundvalue=>{
        for (let i=0;i<retrievecurrentroundvalue.length;i++){
        if (retrievecurrentroundvalue[i].proposerName!=""){
         if (retrievecurrentroundvalue[i].proposerAmount==0|| retrievecurrentroundvalue[i].responderResponse=="Decline"){
          let selectround={};
          selectround["role"]="Proposer";
          selectround["username"]=retrievecurrentroundvalue[i].proposerName;
         selectround["result"]=retrievecurrentroundvalue[i].responderResponse;
          selectround["scorethisround"]=0;
          selectround["score"]=0;
          selectround["score"]=0;
          selectround["amt"]=retrievecurrentroundvalue[i].proposerAmount;
         list.push(selectround)
         }
         else if (retrievecurrentroundvalue[i].proposerAmount!=0|| retrievecurrentroundvalue[i].responderResponse=="Accept"){
          let selectround={};
          selectround["role"]="Proposer";
          selectround["username"]=retrievecurrentroundvalue[i].proposerName;
         selectround["result"]=retrievecurrentroundvalue[i].responderResponse;
           selectround["scorethisround"]=100-retrievecurrentroundvalue[i].proposerAmount;
           selectround["username"]=retrievecurrentroundvalue[i].proposerName;
           selectround["score"]=100-retrievecurrentroundvalue[i].proposerAmount;
           selectround["amt"]=retrievecurrentroundvalue[i].proposerAmount;

           list.push(selectround)
         }

        }
        if (retrievecurrentroundvalue[i].responderName!=""){
          if (retrievecurrentroundvalue[i].proposerAmount==0|| retrievecurrentroundvalue[i].responderResponse=="Decline"){
            let responderdict={};
            responderdict["scorethisround"]=0;
            responderdict["score"]=0;
            responderdict["role"]="Responder";
           responderdict["username"]=retrievecurrentroundvalue[i].responderName;
           responderdict["result"]=retrievecurrentroundvalue[i].responderResponse;
           responderdict["amt"]=retrievecurrentroundvalue[i].proposerAmount;
          list.push(responderdict)
          }
        else if (retrievecurrentroundvalue[i].proposerAmount!=0 && retrievecurrentroundvalue[i].responderResponse=="Accept"){
          let responderdict={};
            responderdict["scorethisround"]=retrievecurrentroundvalue[i].proposerAmount;
            responderdict["score"]=0;
            responderdict["role"]="Responder";
            responderdict["username"]=retrievecurrentroundvalue[i].responderName;
            responderdict["score"]=retrievecurrentroundvalue[i].proposerAmount;
            responderdict["result"]=retrievecurrentroundvalue[i].responderResponse;
            responderdict["amt"]=retrievecurrentroundvalue[i].proposerAmount;
            list.push(responderdict)
          }

         }



       }
       if (this.arr.length!=0){
         this.arr.length=0;
       }
       list.sort(function(a, b){return a.score - b.score});
       list.reverse();
       this.arr=list;

       })

    }

    scorefiltering(selectedValue: any){
     this.scorefilter=selectedValue;
     if (selectedValue=="-"){
       this.scorefilter="Score- High to Low";
     }

    }

    prevround(round){
      console.log(round);
      this.roundselect(round-1);
      this.roundsselectedfilter=parseInt(round)-1;
      console.log(this.roundsselectedfilter,"filter")

    }

    gonext(round){
      console.log(round);
      this.roundselect(round+1);
      this.roundsselectedfilter=parseInt(round)+1;

    }

    
    ngOnDestroy() {
      if (this.subscription) this.subscription.unsubscribe();
    }

}
