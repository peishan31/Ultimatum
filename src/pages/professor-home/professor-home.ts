import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ScoreboardPage } from '../scoreboard/scoreboard';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import {LoadingController,ToastController} from 'ionic-angular';
import * as firebase from 'firebase';
import { UserPresenceStatusProvider } from '../../providers/user-presence-status/user-presence-status';
import { Subscription } from 'rxjs';

@Component({
  selector: 'page-professor-home',
  templateUrl: 'professor-home.html'
})
export class ProfessorHomePage {
code="";
ok=false;
studentnum=0;
itemDoc:any;
item:any;
list=[];
//alllsame:boolean;
alllsame=false;
randomm=false;
assgnsame=[];
listassgnsame1=[];
listassgnsame2=[];
usernamelist=[];
listusername2=[];
listusername1=[];
allgameinround1=[];
alreadydone=[];
waitforstudent:Boolean;
mode:string;
myPerson = {};
listUUID = [];
errormsg:string;
subscription:Subscription;
didsubscribed=false;
studentsList={"username": [], "UUID": [], "totalRound": 0};
  constructor(public navCtrl: NavController,
    public afs: AngularFirestore,
    public loadingCtrl:LoadingController,
    public toastCtrl:ToastController,
    public navParams:NavParams,
    public UserPresenceStatusProvider: UserPresenceStatusProvider
    ) {
let data=this.navParams.data;
if (data==true){
  this.waitforstudent=true;

}
  }

  Next(){

    this.waitforstudent=true;
     //choosing all same player mode
    if (this.alllsame==true){
      this.mode="All same players";
      this.assignsameplayers();
    }
    else{
      this.mode="All different players";
      // assign users to the respective user
      this.assignUserToPlayWithAnotherUser();
    }

    // Update Professor Status
    this.updateProfessorStatus();

    // loading screen and only change when students have played every rounds
    // const loading = this.loadingCtrl.create({

    // });
    // this.presentLoading(loading);

    const toast = this.toastCtrl.create({
      message: 'Waiting for students to finish game',
      duration:3000
    });
    toast.present();

    this.itemDoc = this.afs.collection<any>('Game');
    this.item = this.itemDoc.valueChanges();

    this.item.subscribe(res=>{
      console.log(res);
      this.allgameinround1.length=0;
      this.alreadydone.length=0;

      for (let p=0;p<res.length;p++){
        if (res[p]==undefined || res[p]==null){
          console.log("BYE");
        }
        else{
          if (res[p].gameId==this.code && res[p].round==0){
            this.allgameinround1.push("1")

          }
          if (res[p].responderResponse!="" && res[p].gameId==this.code && res[p].round==0){
            // loading.dismiss();
            // console.log("RCHED HERE")
            // this.navCtrl.setRoot(ScoreboardPage);
            this.alreadydone.push("1")
          }
        }
      }
     if (this.alreadydone.length==this.allgameinround1.length){
            //  loading.dismiss();
              console.log("RCHED HERE")
              var id = localStorage.getItem("id");
              this.navCtrl.setRoot(ScoreboardPage,{ gameId: this.code, gameMode: this.mode}); // i need gamecode and gamemode
        }

    })
    //this.navCtrl.setRoot(ScoreboardPage);
  }

  gamecode(){ // Aim: Count and display the user

    if ((this.randomm != false || this.alllsame != false)) {

      this.ok = false;
      //this.code = Math.floor(Math.random()*20)+Math.floor(Math.random()*20)+Math.floor(Math.random()*20)+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1;
      this.code = this.randomGeneratedGameCode();

      const toast = this.toastCtrl.create({
        message: 'Waiting for students...',
        duration:3000
      });
      toast.present();

      //console.log(this.code);
      let date=new Date();

      this.createProCode({gameId:this.code,dateTime:date.toISOString()});

      this.UserPresenceStatusProvider.updateUserPresenceStatus();
      let mylist = this.updateCurrentParticipant(this.code);
      this.list = mylist;
      this.studentnum = mylist.length;
      console.log("My list: "+ mylist);
      //console.log("My list's length: "+ mylist.length);

    }
    else{
      this.ok=true;
    }

  }

  updateCurrentParticipant(gameId) { // Real time update of current participant in the game. ## not working
    console.log("Weeeee Game code: " + gameId);
    // Real time update of current participant in the game.
    this.itemDoc = this.afs.collection<any>('Participant')
    this.item = this.itemDoc.valueChanges();
    this.item.length=0;
    this.item.subscribe(res=>{
      this.list.length=0;
      //console.log(res)

      // Peishan
      for (let i=0; i<res.length;i++){

        const personRefs: firebase.database.Reference = firebase.database().ref(`/` + "User" + `/` + res[i].UUID + `/`);

        personRefs.on('value', personSnapshot => {

          this.myPerson = personSnapshot.val();
          if ((this.myPerson != null) || (this.myPerson != undefined)){

            if (this.myPerson["online"] == true) { // stores only the online users

              if (res[i].gameId==gameId){

                this.list.push(res[i].username);
                console.log("res[i].username: "+ res[i].username);
              }
            }
            this.studentnum = this.list.length;
          }
        });

      }
      //console.log("Coming from user-presence-status: "+ this.list)
    })
    //console.log("Coming from user-presence-status 2: "+ this.list)
    return this.list;
    /*{
      mylist: this.list,
      mystudentnum: this.studentnum
    };*/
  }

  randomGeneratedGameCode() {
		return 'xxxxxx'.replace(/[xy]/g, function(c) {
		  var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		  return v.toString(16);
		});
	}

  createProCode(value){
    return new Promise<any>((resolve, reject) => {
      /*this.afs.collection('Professor').add({
        gameId:value.gameId,
        dateTime:value.dateTime,
        gameStatus: "Ready"
       })
      .then(
        res => resolve(res),
        err => reject(err)
      )*/
      var id = this.afs.createId();
      localStorage.setItem("id", id);

      this.afs.collection('Professor').doc(this.code).set({
        gameId:value.gameId,
        dateTime:value.dateTime,
        professorStatus: "Not Ready",
        round:""

       })
      .then((data) => {
        console.log("Data: "+data);
      }).catch((err) => {
        console.log("Err: "+err);
      })
    })
  }

  updateProfessorStatus(){
    // Updating the game status to "Ready"
    var id = localStorage.getItem("id");
    this.afs.collection('Professor').doc(this.code).update({
      professorStatus: "Ready",
      round:"0",
      gameMode:this.mode
     })
    .then((data) => {
      //console.log("Data: "+data);
    }).catch((err) => {
      console.log("Err: "+err);
    })
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

  assignUserToPlayWithAnotherUser(){
    // Calling out all the users joining this gameId
    this.itemDoc = this.afs.collection<any>('Participant');
    this.item = this.itemDoc.valueChanges();
    this.item.subscribe(res=>{
      for (let i=0; i<res.length;i++){
        if (res[i].gameId==this.code){
          this.studentsList["username"].push(res[i].username);
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

      this.assignProposerAndResponder(areaA, areaB, areaAUUID, areaBUUID);
      // calculating how many rounds it would take for all users to play against each other in 2 groups.
      //this.assignProposerAndResponder (areaA, areaB, areaAUUID, areaBUUID, half_length, this.studentsList["totalRound"]);
      //this.assignProposerAndResponder (areaB, areaA,  half_length);
    });
  }

  assignProposerAndResponder (proposer, responder, proposerUUID, responderUUID){

    var arrangedUsersA = this.derange(proposer);
    var arrangedUsersB = this.derange(responder);

    console.log("Before shuffle: (areaA)" + proposer);
		console.log("Now: (areaA)" + arrangedUsersA);

		console.log("Before shuffle: (areaB)" + responder);
    console.log("Now: (areaB)" + arrangedUsersB);

    for (var i=0 ; i < arrangedUsersA.length; i++) {

      console.log(arrangedUsersA[i] + " VS " + arrangedUsersB[i]);

      var id = proposerUUID[i] + "0" + responderUUID[i] + "0";
        this.afs.collection('Game').doc(id).set({
          gameId:this.code,
          gameMode: 'Random all players',
          round: 0,
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
  /*assignProposerAndResponder (proposer, responder, proposerUUID, responderUUID, half_length, totalRound){
    // calculating how many rounds it would take for all users to play against each other in 2 groups.
    for (var j = 0; j < half_length; j++)
    {
      var temp = 0;
      console.log("Round "+j+" :")

      for (var i = 0; i < half_length; i++) {

        console.log("(Proposer) "+ proposer[i] + " VS (Responder) "+ responder[temp]);
        console.log("(Responder UUID) "+ responderUUID[i] + " (Responder Name) "+ responder[temp]);
        // adding student's sequence into database
        //var id = j+proposer[i]+responder[temp];
        var id = "HIIIIIIII" + proposerUUID[i] + j + responderUUID[i] + j;
        this.afs.collection('Game').doc(id).set({
          gameId:this.code,
          gameMode: 'Random all players',
          round: j,
          totalRound: totalRound,
          dateTime: new Date().toISOString(),
          proposerUUID: proposerUUID[i],
          proposerName: proposer[i],
          responderUUID: responderUUID[i],
          responderName: responder[temp],
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

        temp++;
      }

      var num = responder.shift();
      responder[responder.length] = num;
    }
  }*/

  //yonglin
  assignsameplayers(){
    this.itemDoc = this.afs.collection<any>('Participant');
    this.item = this.itemDoc.valueChanges();
    this.didsubscribed=true;
    this.subscription=this.item.subscribe(res=>{
      for (let i=0; i<res.length;i++){
        if (res[i].gameId==this.code){
          this.assgnsame.push(res[i].UUID);
          this.usernamelist.push(res[i].username)
  }
}
console.log(this.assgnsame);
if (this.assgnsame.length%2==0){
  let lengthdivide=this.assgnsame.length/2
  for (let i=0;i<lengthdivide;i++){
    this.listassgnsame1.push(this.assgnsame[i]);
    this.listusername1.push(this.usernamelist[i]);
  }
 for (let i=lengthdivide;i<this.assgnsame.length;i++){
   this.listassgnsame2.push(this.assgnsame[i])
   this.listusername2.push(this.usernamelist[i]);
 }

 for (let i=0;i<this.listassgnsame1.length;i++){
   for (let u=0;u<5;u++){
    let id=this.listassgnsame1[i]+u.toString()+this.listassgnsame2[i]+u.toString();
    this.afs.collection('Game').doc(id).set({
      gameId:this.code,
      gameMode: 'All same opponents',
      round: u,
      totalRound: 10,
      dateTime: new Date().toISOString(),
      proposerUUID: this.listassgnsame1[i],
      proposerName: this.listusername1[i],
      responderUUID: this.listassgnsame2[i],
      responderName: this.listusername2[i],
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

 for (let i=0;i<this.listassgnsame2.length;i++){
   for (let u=5;u<10;u++){
    let id=this.listassgnsame2[i]+u.toString()+this.listassgnsame1[i]+u.toString();
    this.afs.collection('Game').doc(id).set({
      gameId:this.code,
      gameMode: 'All same opponents',
      round: u,
      totalRound: 10,
      dateTime: new Date().toISOString(),
      proposerUUID: this.listassgnsame2[i],
      proposerName: this.listusername2[i],
      responderUUID: this.listassgnsame1[i],
      responderName: this.listusername1[i],
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
    })

}

  async presentLoading(loading) {
    return await loading.present();
  }

  randomall(){
    let shand = document.getElementsByClassName('randomall') as HTMLCollectionOf<HTMLElement>;
    shand[0].style.backgroundColor="cornflowerblue";
    shand[0].style.color="white";

    let shands = document.getElementsByClassName('allsame') as HTMLCollectionOf<HTMLElement>;
    shands[0].style.backgroundColor="transparent";
    shands[0].style.color="cornflowerblue";

   this.randomm=true;
   this.alllsame=false;
  }

  allsame(){
    let shand = document.getElementsByClassName('allsame') as HTMLCollectionOf<HTMLElement>;
    shand[0].style.backgroundColor="cornflowerblue";
    shand[0].style.color="white";

    let shands = document.getElementsByClassName('randomall') as HTMLCollectionOf<HTMLElement>;
    shands[0].style.backgroundColor="transparent";
    shands[0].style.color="cornflowerblue";

    this.randomm=false;
    this.alllsame=true;
  }

  ionViewDidLeave(){
    if (this.didsubscribed==true){
      this.subscription.unsubscribe();
    }

    // this.professorcode.unsubscribe();
  }
}
