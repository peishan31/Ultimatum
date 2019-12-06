import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ScoreboardPage } from '../scoreboard/scoreboard';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';


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
  constructor(public navCtrl: NavController,public afs: AngularFirestore) {

  }

  Next(){
    //this.navCtrl.setRoot(ScoreboardPage);
    /*this.afs.collection('Professor').doc("yGLA8wGBceKnsGAYw4RR").set({ // needs unique id
      first: "Lin",
      last: "PeishanUpdated"
     })
    .then((data) => {
      console.log("Data: "+data);
    }).catch((err) => {
      console.log("Err: "+err);
    })*/
    // Updating the game status to "Ready"

    var id = localStorage.getItem("id");
    this.afs.collection('Professor').doc(id).update({
      professorStatus: "Ready"
     })
    .then((data) => {
      console.log("Data: "+data);
    }).catch((err) => {
      console.log("Err: "+err);
    })

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
}
