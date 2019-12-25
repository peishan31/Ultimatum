import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Loading } from 'ionic-angular';
import { ProposerPage } from '../proposer/proposer';
import { RespondantPage } from '../respondant/respondant';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import {LoadingController} from 'ionic-angular';
import * as firebase from 'firebase';
import functions from 'firebase-functions';

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
loader:Loading;
hide:Boolean;
myPerson={};
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afs: AngularFirestore,
    public loadingCtrl:LoadingController,
    public toastCtrl:ToastController
    ) {
    console.log(navParams.data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamecodePage');

  }

  Next(form: NgForm){

    this.submitted = true;

    if (form.valid && this.gamecode!= '' && this.gamecode!=null) {
      this.loader =  this.loadingCtrl.create({

      });
      this.loader.present();

      const toast = this.toastCtrl.create({
        message: 'See your name on the screen..',
        duration:3000
      });
      toast.present();

      let all=this.navParams.data;
      all["gameId"]=this.gamecode;
      this.createParticipant(all);
      this.itemDoc = this.afs.collection<any>('Professor')
      this.item = this.itemDoc.valueChanges();
      this.item.subscribe(res=>{

        console.log(res);

        this.userDisconnectState(all);
        //var ref = firebase.database().ref(`/` + "User" + `/` + all.UUID + `/`);


        for (let p=0;p<res.length;p++){
          if (res[p]==undefined || res[p]==null){
            console.log("BYE");
          }
            else{
              if (res[p].professorStatus=='Ready' && res[p].gameId==this.gamecode){
                // find out if user is a proposer or responder
                this.loader.dismiss();
                this.responderOrProposal(this.navParams.data);

              }
          }

        }

      })

    }
  }

  userDisconnectState(all) {
    return new Promise<any>((resolve, reject) => {

      var ref = firebase.database().ref(`/` + "User" + `/` + all.UUID + `/`);
      ref.on('value', snapshot => {
        console.log("Yoooo: "+ ref);
        ref
        .onDisconnect()
        .set({
          gameId: all.gameId,
          online: false
        })
        .then((all) => {
          /*ref.on('value', personSnapshot => {
            this.myPerson = personSnapshot.val();
            if (personSnapshot["online"] == false){
              //===========================================
              //****** unable to update online to false on firestore
              var id = all.UUID;
              this.afs.collection('Participant').doc("1000").set({
                UUID: all.UUID,
                username: all.username,
                dateTime: all.dateTime,
                gameId: all.gameId,
                online: false
              })
              //===========================================
            }
          });*/
        })
      })

    })
  }

  createParticipant(value){

    return new Promise<any>((resolve, reject) => {
      var id = value.UUID;
      this.afs.collection('Participant').doc(id).set({
        UUID:value.UUID,
        username:value.username,
        dateTime:value.dateTime,
        gameId:value.gameId,
        online: true
      })
      .then(
        res => resolve(res),
        err => reject(err)
      );

      var ref = firebase.database().ref(`/` + "User" + `/` + value.UUID + `/`);
      ref.update({
        online: true,
        gameId: value.gameId
      });
    })

  }

  responderOrProposal(all){
    // let shand = document.getElementsByClassName('errormsg') as HTMLCollectionOf<HTMLElement>;
    // shand[0].style.display="none";
    this.itemDoc = this.afs.collection<any>('Game');
    this.item = this.itemDoc.valueChanges();
    let iu=0;// else if keep getting in
    this.item.subscribe(res=>{
      // this.loader =  this.loadingCtrl.create({

      // });
      // this.loader.present();

      for (let p=0;p<res.length;p++){

          let passnextpg={UUID: all.UUID, username: all.username, gamecode: this.gamecode}
          if (res[p].responderUUID == all.UUID && res[p].gameId==this.gamecode && res[p].proposerStatus=="Ready" && res[p].round=="0") {
            // user is a responder in the next round
            // **** needs to create a loader and wait for the proposer to submit their values
          //  this.loader.dismiss();
            this.navCtrl.push(RespondantPage, passnextpg);


          }

           else if (res[p].proposerUUID == all.UUID && res[p].gameId==this.gamecode && res[p].round=="0" && res[p].proposerStatus=="Not Ready" && iu==0){
            // user is a proposer in the next round
            // this.loader.dismissAll()
            this.navCtrl.push(ProposerPage, passnextpg);
          iu+=1
           console.log("First")

          }
          else{
            this.hide=true;
          }

        }

    })
  }

  // async presentLoading(loading) {
  //   return await loading.present();
  // }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({

    });
    await this.loader.present();
  }

  async dismissLoading() {
    await this.loader.dismiss();
  }
}

