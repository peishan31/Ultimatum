import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfessorHomePage } from '../professor-home/professor-home';
import { PastscoreboardPage } from '../pastscoreboard/pastscoreboard';
import { ScoreboardPage } from '../scoreboard/scoreboard';

/**
 * Generated class for the ViewpastornewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewpastornew',
  templateUrl: 'viewpastornew.html',
})
export class ViewpastornewPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewpastornewPage');
  }

  past(){
this.navCtrl.setRoot(PastscoreboardPage)

  }

  newgame(){
   this.navCtrl.setRoot(ProfessorHomePage)
  }

}
