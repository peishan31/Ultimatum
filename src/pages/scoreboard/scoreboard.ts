import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProfessorHomePage } from '../professor-home/professor-home';

@Component({
  selector: 'page-scoreboard',
  templateUrl: 'scoreboard.html'
})
export class ScoreboardPage {

  constructor(public navCtrl: NavController) {
  }

  Home(){
    this.navCtrl.setRoot(ProfessorHomePage);
  }
  
}
