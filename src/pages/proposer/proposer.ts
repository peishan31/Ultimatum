import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RespondantPage } from '../respondant/respondant';
import { AngularFirestore } from '@angular/fire/firestore';
import {LoadingController} from 'ionic-angular';

@Component({
  selector: 'page-proposer',
  templateUrl: 'proposer.html'
})
export class ProposerPage {
  itemDoc:any;
  item:any;
  proposerData:any;
  firebaseId = "";
  proposerAmount = "";
  constructor(public navCtrl: NavController,
    public afs: AngularFirestore,
    public loadingCtrl:LoadingController,
    public navParams: NavParams) {
  }

  Next(){
    this.submitProposerOffer();
    // then loading screen for the responder to respond
    const loading = this.loadingCtrl.create({

    });
    this.presentLoading(loading);
    //this.navCtrl.setRoot(RespondantPage);
  }

  submitProposerOffer(){
    // get the data using proposer's UUID
    // then combine the id with current-round+proposer-name+responder-name
    // using this id, update the proposerAmount & proposerStatus
    this.itemDoc = this.afs.collection<any>('Game');
    this.item = this.itemDoc.valueChanges();
    let all=this.navParams.data;

    this.item.subscribe(res=>{
      console.log("Yoooo: "+JSON.stringify(res));
      console.log("My UUID: "+ all.UUID);
      for (let p=0;p<res.length;p++){
        if (res[p]==undefined || res[p]==null){
        }
        else{
          if (res[p].proposerUUID == all.UUID && res[p].round == 0){ //*** hardcoding round
            // store proposerData here
            this.proposerData = res[p];
            this.firebaseId = res[p].round + res[p].proposerName + res[p].responderName
            console.log("firebaseId: " + this.firebaseId );
            this.updateProfessorStatus(this.firebaseId);
          }
        }

      }

    })
  }

  updateProfessorStatus(dbid){
    // Updating the game status to "Ready"
    this.afs.collection('Game').doc(dbid).update({
      proposerStatus: "Ready",
      proposerAmount: this.proposerAmount // ** temp hardcoding
     })
    .then((data) => {
      //console.log("Data: "+data);
    }).catch((err) => {
      console.log("Err: "+err);
    })
  }

  async presentLoading(loading) {
    return await loading.present();
  }
}
