import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ScoreboardPage } from '../scoreboard/scoreboard';

@Component({
  selector: 'page-professor-home',
  templateUrl: 'professor-home.html'
})
export class ProfessorHomePage {
code=0;
  constructor(public navCtrl: NavController) {
    
  }

  Next(){
    this.navCtrl.setRoot(ScoreboardPage);
  }
  
  gamecode(){
    this.code = Math.floor(Math.random()*20)+Math.floor(Math.random()*20)+Math.floor(Math.random()*20)+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1+Math.floor(Math.random()*20)+1;
    console.log(this.code)
  }
}
