import { Component } from '@angular/core';
import { NavController, DateTime } from 'ionic-angular';
import { ProposerPage } from '../proposer/proposer';
import { ProfessorHomePage } from '../professor-home/professor-home';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { GamecodePage } from '../gamecode/gamecode';
import {LoadingController} from 'ionic-angular';
import { ProfessorloginPage } from '../professorlogin/professorlogin';

@Component({
  selector: 'page-ultimatum',
  templateUrl: 'ultimatum.html'
})
export class UltimatumPage {

  Username:string;
  datetime:string;
  random:string;
  submitted = false;

  constructor(public navCtrl: NavController,
    public afs: AngularFirestore,
    public loadingCtrl:LoadingController
    ) {
  }

  ionViewWillEnter() {
    //this.random = Math.floor(Math.random()*20)+Math.floor(Math.random()*20)+Math.floor(Math.random()*20)+Math.floor(Math.random()*20)+1;
    this.random = this.uuidv4();
    console.log(this.random)
  }

  Next(form: NgForm){
    this.submitted = true;

    if (form.valid && this.Username!= '' && this.Username!=null) {
      if (this.Username=="Professor123"){
        this.navCtrl.setRoot(ProfessorHomePage);
      }
      else{
        const loading = this.loadingCtrl.create({

        });
        this.presentLoading(loading);
        let date=new Date();
        this.datetime=date.toISOString();
        let passnextpg={UUID:this.random,username:this.Username,dateTime:this.datetime};
        loading.dismiss();
        this.navCtrl.setRoot(GamecodePage,passnextpg);
      }
    }
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  ProfessorLogin(){
    this.navCtrl.setRoot(ProfessorloginPage);
  }

}
