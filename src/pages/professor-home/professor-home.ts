import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ScoreboardPage } from '../scoreboard/scoreboard';

@Component({
  selector: 'page-professor-home',
  templateUrl: 'professor-home.html'
})
export class ProfessorHomePage {

  constructor(public navCtrl: NavController) {
    
  }

  Next(){
    this.navCtrl.setRoot(ScoreboardPage);
  }
  
}
