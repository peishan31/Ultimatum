import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ScoreboardPage } from '../scoreboard/scoreboard';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import {LoadingController} from 'ionic-angular';

@Component({
  selector: 'page-professor-home',
  templateUrl: 'professor-home.html'
})
export class ProfessorHomePage {
code=0;
studentnum=0;
itemDoc:any;
item:any;
list=[];
studentsList=[];
studentsIdList=[];
  constructor(public navCtrl: NavController,
    public afs: AngularFirestore,
    public loadingCtrl:LoadingController
    ) {

  }

  Next(){
    // Update Professor Status
    this.updateProfessorStatus();

    // assign users to the respective user
    this.assignUserToPlayWithAnotherUser();

    // loading screen and only change when students have played every rounds
    const loading = this.loadingCtrl.create({

    });
    this.presentLoading(loading);

    this.itemDoc = this.afs.collection<any>('Participant');
    this.item = this.itemDoc.valueChanges();

    this.item.subscribe(res=>{
      console.log(res);
      for (let p=0;p<res.length;p++){
        if (res[p]==undefined || res[p]==null){
          console.log("BYE");
        }
        else{
          if (res[p].gameStatus=='Ready' && res[p].gameId==this.gamecode){
            loading.dismiss();
            this.navCtrl.setRoot(ScoreboardPage);
          }
        }

      }

    })
    //this.navCtrl.setRoot(ScoreboardPage);
  }

  gamecode(){
    this.code = Math.floor(Math.random()*20)+Math.floor(Math.random()*20)+Math.floor(Math.random()*20)+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1;
    console.log(this.code);
    let date=new Date();

    this.createProCode({gameId:this.code,dateTime:date.toISOString()});
    this.itemDoc = this.afs.collection<any>('Participant')
    this.item = this.itemDoc.valueChanges();
    this.item.length=0;
    this.item.subscribe(res=>{
      this.list.length=0;
      console.log(res)
      for (let i=0; i<res.length;i++){
        if (res[i].gameId==this.code){
        this.list.push(res[i].username);
        this.studentnum=this.list.length;
        }

      }
      console.log(this.list)
    })
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

      this.afs.collection('Professor').doc(id).set({
        gameId:value.gameId,
        dateTime:value.dateTime,
        professorStatus: "Not Ready"
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
    this.afs.collection('Professor').doc(id).update({
      professorStatus: "Ready"
     })
    .then((data) => {
      //console.log("Data: "+data);
    }).catch((err) => {
      console.log("Err: "+err);
    })
  }

  assignUserToPlayWithAnotherUser(){
    // Calling out all the users joining this gameId
    this.itemDoc = this.afs.collection<any>('Participant');
    this.item = this.itemDoc.valueChanges();
    this.item.subscribe(res=>{
      for (let i=0; i<res.length;i++){
        if (res[i].gameId==this.code){
          this.studentsList.push(res[i].username);
          this.studentnum=this.studentsList.length;
        }
      }

      console.log("Student List: "+this.studentsList); // push users in this id

      if (this.studentsList.length % 2 != 0) // odd number; needs to generate AI
      {
        this.studentsList[this.studentsList.length] = "AI";
        this.studentsIdList[this.studentsList.length] = 1;
      }

      // splitting users into 2 groups
      var half_length = Math.ceil(this.studentsList.length / 2);
      var areaA = this.studentsList.splice(0, half_length);
      var areaB = this.studentsList;
      console.log("areaA: "+ areaA);
      console.log("areaB: "+ areaB);

      // calculating how many rounds it would take for all users to play against each other in 2 groups.
      this.assignProposerAndResponder (areaA, areaB, half_length);
      this.assignProposerAndResponder (areaB, areaA,  half_length);
    });
  }

  assignProposerAndResponder (proposer, responder, half_length){
    // calculating how many rounds it would take for all users to play against each other in 2 groups.
    for (var j = 0; j < half_length; j++)
    {
      var temp = 0;
      console.log("Round "+j+" :")

      for (var i = 0; i < half_length; i++) {

        console.log("(Proposer) "+ proposer[i] + " VS (Responder) "+ responder[temp]);
        // adding student's sequence into database
        var id = j+proposer[i]+responder[temp];
        this.afs.collection('Game').doc(id).set({
          gameId:this.code,
          round: j,
          dateTime: new Date().toISOString(),
          proposerName: proposer[i],
          responderName: responder[temp],
          proposerAmount: 0,
          responderResponder: false,
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
  }

  async presentLoading(loading) {
    return await loading.present();
  }
}
