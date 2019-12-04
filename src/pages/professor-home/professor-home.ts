import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ScoreboardPage } from '../scoreboard/scoreboard';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'page-professor-home',
  templateUrl: 'professor-home.html'
})
export class ProfessorHomePage {
code=0;
  constructor(public navCtrl: NavController,public afs: AngularFirestore) {
    
  }

  Next(){
    this.navCtrl.setRoot(ScoreboardPage);
  }
  
  gamecode(){
    this.code = Math.floor(Math.random()*20)+Math.floor(Math.random()*20)+Math.floor(Math.random()*20)+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1;
    console.log(this.code);
    let date=new Date();

    this.createProCode({gameId:this.code,dateTime:date.toISOString});
  }

  createProCode(value){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('Professor').add({
        gameId:value.gameId,
        dateTime:value.dateTime
       })
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }
}
