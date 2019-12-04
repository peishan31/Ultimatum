import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProposerPage } from '../proposer/proposer';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
/**
 * Generated class for the GamecodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gamecode',
  templateUrl: 'gamecode.html',
})
export class GamecodePage {
gamecode:string;
submitted=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,  public afs: AngularFirestore) {
    console.log(navParams.data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamecodePage');
  }

  Next(form: NgForm){
    this.submitted = true;

    if (form.valid && this.gamecode!= '' && this.gamecode!=null) {
    let all=this.navParams.data;
    all["gameId"]=this.gamecode;
    this.createParticipant(all);
    this.navCtrl.setRoot(ProposerPage);
    }
  }

  createParticipant(value){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('Participant').add({
        UUID:value.UUID,
        username:value.username,
        dateTime:value.dateTime,
        gameId:value.gameId

      })
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }
}
