import { Component } from '@angular/core';
import { NavController, DateTime } from 'ionic-angular';
import { ProposerPage } from '../proposer/proposer';
import { ProfessorHomePage } from '../professor-home/professor-home';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { GamecodePage } from '../gamecode/gamecode';

@Component({
  selector: 'page-ultimatum',
  templateUrl: 'ultimatum.html'
})
export class UltimatumPage {

  Username:string;
  datetime:string;
  random:number;
  submitted = false;

  constructor(public navCtrl: NavController,
    public afs: AngularFirestore
    ) {
  }

  ionViewWillEnter() {
    this.random = Math.floor(Math.random()*20)+Math.floor(Math.random()*20)+Math.floor(Math.random()*20)+Math.floor(Math.random()*20)+1;
    console.log(this.random)
  }

  Next(form: NgForm){
    this.submitted = true;

    if (form.valid && this.Username!= '' && this.Username!=null) {
      if (this.Username=="Professor123"){
        this.navCtrl.setRoot(ProfessorHomePage);
      }
      else{
        let date=new Date();
        this.datetime=date.toISOString();
        let passnextpg={UUID:this.random,username:this.Username,dateTime:this.datetime};
        this.navCtrl.setRoot(GamecodePage,passnextpg);
      }
    }
  }

  
}
