import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProposerPage } from '../proposer/proposer';
import { RespondantPage } from '../respondant/respondant';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import {LoadingController} from 'ionic-angular';
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
itemDoc:any;
item:any;
list=[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afs: AngularFirestore,
    public loadingCtrl:LoadingController
    ) {
    console.log(navParams.data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamecodePage');

  }

  Next(form: NgForm){
    this.submitted = true;

    if (form.valid && this.gamecode!= '' && this.gamecode!=null) {
      const loading = this.loadingCtrl.create({

      });
      this.presentLoading(loading);
      let all=this.navParams.data;
      all["gameId"]=this.gamecode;
      this.createParticipant(all);
      this.itemDoc = this.afs.collection<any>('Professor')
      this.item = this.itemDoc.valueChanges();
      this.item.subscribe(res=>{
        console.log(res);
        for (let p=0;p<res.length;p++){
          if (res[p]==undefined || res[p]==null){
            console.log("BYE");
          }
            else{
              if (res[p].professorStatus=='Ready' && res[p].gameId==this.gamecode){
                // find out if user is a proposer or responder
                loading.dismiss();
                this.responderOrProposal(this.navParams.data);

              }
          }

        }

      })

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

  responderOrProposal(all){

    this.itemDoc = this.afs.collection<any>('Game');
    this.item = this.itemDoc.valueChanges();

    this.item.subscribe(res=>{

      const loadingg = this.loadingCtrl.create({

      });
    this.presentLoading(loadingg);

      for (let p=0;p<res.length;p++){

          let passnextpg={UUID: all.UUID, username: all.username, gamecode: this.gamecode}
          if (res[p].responderUUID == all.UUID && res[p].gameId==this.gamecode && res[p].proposerStatus=="Ready") {
            // user is a responder in the next round
            // **** needs to create a loader and wait for the proposer to submit their values
            loadingg.dismiss();
            loadingg.dismissAll();
            console.log("ok")
            this.navCtrl.push(RespondantPage, passnextpg);


          }
          if (res[p].proposerUUID == all.UUID && res[p].gameId==this.gamecode){
            // user is a proposer in the next round
            loadingg.dismiss();

            this.navCtrl.push(ProposerPage, passnextpg);
          }

        }

    })
  }

  async presentLoading(loading) {
    return await loading.present();
  }
}
