import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RespondantPage } from '../respondant/respondant';

@Component({
  selector: 'page-proposer',
  templateUrl: 'proposer.html'
})
export class ProposerPage {

  constructor(public navCtrl: NavController) {
  }
  
  Next(){
    this.navCtrl.setRoot(RespondantPage);
  }
}
