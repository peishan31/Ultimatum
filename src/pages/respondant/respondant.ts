import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProfessorHomePage } from '../professor-home/professor-home';

@Component({
  selector: 'page-respondant',
  templateUrl: 'respondant.html'
})
export class RespondantPage {

  constructor(public navCtrl: NavController) {
  }
  
  Next(){
    this.navCtrl.setRoot(ProfessorHomePage);
  }
}
