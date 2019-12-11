import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UltimatumPage } from '../ultimatum/ultimatum';

/**
 * Generated class for the ProfessorloginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-professorlogin',
  templateUrl: 'professorlogin.html',
})
export class ProfessorloginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfessorloginPage');
  }

  Next(){

  }

  back(){
    this.navCtrl.setRoot(UltimatumPage);
  }

}
