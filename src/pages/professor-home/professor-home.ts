import { Component } from '@angular/core';
import { NavController, NavParams, Alert } from 'ionic-angular';
import { ScoreboardPage } from '../scoreboard/scoreboard';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import {LoadingController,ToastController, MenuController} from 'ionic-angular';
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
retrieveprofessor:any;
professorcode:any;
rounds:number;
validator:string;
  constructor(public navCtrl: NavController,
    public afs: AngularFirestore,
    public loadingCtrl:LoadingController,
    public toastCtrl:ToastController,
    public navParams:NavParams,
    public UserPresenceStatusProvider: UserPresenceStatusProvider,
    public menuCtrl: MenuController
    ) {
let data=this.navParams.data;
if (data["waitForStudent"]==true){
  this.waitforstudent=true;
  this.code="trying to make this not empty";

}
  }

  ionViewWillEnter(){

    this.menuCtrl.swipeEnable(true, 'left');
    this.menuCtrl.enable(true, 'left');
  }

  Next(){
    this.waitforstudent=true;
     //choosing all same player mode
    if (this.alllsame==true){
      this.mode="All same opponents";
      this.assignsameplayers();
    }
    else{
      this.mode="Random all players";
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
    this.professorcode = this.afs.collection<any>('Professor').doc(this.code);
    this.retrieveprofessor = this.professorcode.valueChanges();
    this.subscription = this.retrieveprofessor.subscribe(ress=>{
    this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('round', '==', parseInt(ress["round"])).where('gameId', '==', this.code));
    this.item = this.itemDoc.valueChanges();

    this.subscription = this.item.subscribe(res=>{
      console.log(res);
      this.allgameinround1.length=0;
      this.alreadydone.length=0;

      for (let p=0;p<res.length;p++){
        if (res[p]==undefined || res[p]==null){
          console.log("BYE");
        }
        else{
          if (res[p].gameId==this.code && res[p].round==parseInt(ress["round"])){
            this.allgameinround1.push("1")

          }
          if (res[p].responderResponse!="" && res[p].gameId==this.code && res[p].round==parseInt(ress["round"])){
            // loading.dismiss();
            // console.log("RCHED HERE")
            // this.navCtrl.setRoot(ScoreboardPage);
            this.alreadydone.push("1")
          }
        }
      }
      if (this.allgameinround1.length!=0){
        if (this.alreadydone.length==this.allgameinround1.length){
            //  loading.dismiss();
              console.log("RCHED HERE")
              var id = localStorage.getItem("id");
              this.alreadydone.length=0;
              this.allgameinround1.length=0;
              this.navCtrl.setRoot(ScoreboardPage,{ gameId: this.code, gameMode: this.mode}); // i need gamecode and gamemode
        }
      }


    })})
    //this.navCtrl.setRoot(ScoreboardPage);
  }

  gamecode(){ // Aim: Count and display the user
    if (this.rounds%2==0){
      this.validator="";
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

    else{
      this.validator="Please choose an even number for rounds";
    }

  }

  updateCurrentParticipant(gameId) { // Real time update of current participant in the game. ## not working
    console.log("Weeeee Game code: " + gameId);
    // Real time update of current participant in the game.
    this.itemDoc = this.afs.collection<any>('Participant')
    this.item = this.itemDoc.valueChanges();
    this.item.length=0;
    this.subscription = this.item.subscribe(res=>{
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
        gameEnded: false,
        totalround:this.rounds,
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

  assignUserToPlayWithAnotherUser(){
    setTimeout(() => {
      // alert('Hello...')
       // Calling out all the users joining this gameId
      this.itemDoc = this.afs.collection<any>('Participant', ref => ref
      .where("gameId", "==", this.code)
      .where("online", "==" , true)
      );
      this.item = this.itemDoc.valueChanges();
      this.didsubscribed=true;
      this.subscription = this.item.subscribe(res=>{
        if (res.length!=0 && res.length%2==0) { // there is data

        for (let i=0; i<res.length;i++){
          //if (res[i].gameId==this.code){
            this.studentsList["username"].push(res[i].username);
            this.studentsList["UUID"].push(res[i].UUID);
            this.studentnum=this.studentsList["username"].length;
          //}
        }
        this.studentsList["totalRound"] = this.studentsList["username"].length;
        console.log("Student List: "+this.studentsList["username"]); // push users in this id

        if (this.studentsList["username"].length % 2 == 0)
        {
          // randomizing
          var firstusername = this.studentsList["username"].shift();
          this.studentsList["username"].push(firstusername);

          var firstUUID = this.studentsList["UUID"].shift();
          this.studentsList["UUID"].push(firstUUID);
          //alert("this.studentsList['UUID']: " + this.studentsList["UUID"]);
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

          //this.assignProposerAndResponder(areaA, areaB, areaAUUID, areaBUUID);
          var arrangedUsersA = areaA;
          var arrangedUsersB = areaB;

          for (var i=0 ; i < arrangedUsersA.length; i++) {

            console.log(arrangedUsersA[i] + " VS " + arrangedUsersB[i]);

            var id = areaAUUID[i] + "0" + areaBUUID[i] + "0";
            //alert(id);
            //alert("ResponderUUID: " + responderUUID);
              this.afs.collection('Game').doc(id).set({
                gameId:this.code,
                gameMode: 'Random all players',
                round: 0,
                totalRound: this.rounds,
                dateTime: new Date().toISOString(),
                proposerUUID: areaAUUID[i],
                proposerName: areaA[i],
                responderUUID: areaBUUID[i],
                responderName: areaB[i],
                proposerAmount: "",
                responderResponse: "",
                proposerStatus: "Not Ready",
                responderStatus: "Not Ready",
                gameStatus: "Not Ready"
              })

              var id3 = areaAUUID[i];

              var ref = firebase.database().ref(`/` + "User" + `/` + id3 + `/`);
              ref.update({
                UUID: id3,
                online: true,
                gameId: this.code,
                inGame: true
              });

                var id2 = areaBUUID[i];

                var ref2 = firebase.database().ref(`/` + "User" + `/` + id2 + `/`);
                ref2.update({
                  UUID: id2,
                  online: true,
                  gameId: this.code,
                  inGame: true
                })
              .then((data) => {


                })
          }
        }
        else {
          alert("There is currently odd number of students in the game! Please try again!");
        }
        // calculating how many rounds it would take for all users to play against each other in 2 groups.
        //this.assignProposerAndResponder (areaA, areaB, areaAUUID, areaBUUID, half_length, this.studentsList["totalRound"]);
        //this.assignProposerAndResponder (areaB, areaA,  half_length);
        }
      });
  }, 1500);

  }

  // assignProposerAndResponder (proposer, responder, proposerUUID, responderUUID){

  //   /*var arrangedUsersA = this.derange(proposer);
  //   var arrangedUsersB = this.derange(responder);*/
  //   /*var firstUserA = proposer.shift();
  //   proposer.push(firstUserA);
  //   var firstUUIDA = proposerUUID.shift();
  //   proposerUUID.push(firstUUIDA);*/

  //   var arrangedUsersA = proposer;
  //   var arrangedUsersB = responder;

  //   for (var i=0 ; i < arrangedUsersA.length; i++) {

  //     console.log(arrangedUsersA[i] + " VS " + arrangedUsersB[i]);

  //     var id = proposerUUID[i] + "0" + responderUUID[i] + "0";
  //     //alert(id);
  //     //alert("ResponderUUID: " + responderUUID);
  //       this.afs.collection('Game').doc(id).set({
  //         gameId:this.code,
  //         gameMode: 'Random all players',
  //         round: 0,
  //         totalRound: this.rounds,
  //         dateTime: new Date().toISOString(),
  //         proposerUUID: proposerUUID[i],
  //         proposerName: proposer[i],
  //         responderUUID: responderUUID[i],
  //         responderName: responder[i],
  //         proposerAmount: "",
  //         responderResponse: "",
  //         proposerStatus: "Not Ready",
  //         responderStatus: "Not Ready",
  //         gameStatus: "Not Ready"
  //        })

  //        var id3 = proposerUUID[i];

  //           var ref = firebase.database().ref(`/` + "User" + `/` + id3 + `/`);
  //           ref.update({
  //             UUID: id3,
  //             online: true,
  //             gameId: this.code,
  //             inGame: true
  //           });

  //         var id2 = responderUUID[i];

  //         var ref2 = firebase.database().ref(`/` + "User" + `/` + id2 + `/`);
  //         ref2.update({
  //           UUID: id2,
  //           online: true,
  //           gameId: this.code,
  //           inGame: true
  //         })
  //       .then((data) => {


  //         })
	// 	}
  // }
  //yonglin
  assignsameplayers(){
    setTimeout(() => {
      // alert('Hello...')
      this.itemDoc = this.afs.collection<any>('Participant', ref => ref
      .where("gameId", "==", this.code)
      .where("online", "==" , true));
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

   let rounds=(this.rounds/2);
   for (let i=0;i<this.listassgnsame1.length;i++){
     for (let u=0;u<rounds;u++){
      let id=this.listassgnsame1[i]+u.toString()+this.listassgnsame2[i]+u.toString();
      this.afs.collection('Game').doc(id).set({
        gameId:this.code,
        gameMode: 'All same opponents',
        round: u,
        totalRound: this.rounds,
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
   let rounds1=(this.rounds/2)
   for (let i=0;i<this.listassgnsame2.length;i++){
     for (let u=rounds1;u<this.rounds;u++){
      let id=this.listassgnsame2[i]+u.toString()+this.listassgnsame1[i]+u.toString();
      this.afs.collection('Game').doc(id).set({
        gameId:this.code,
        gameMode: 'All same opponents',
        round: u,
        totalRound: this.rounds,
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
  }, 5000);


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
    if (this.subscription) this.subscription.unsubscribe();
    // this.professorcode.unsubscribe();
  }
  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();

  }
}
