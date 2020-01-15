import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Loading } from 'ionic-angular';
import { ProposerPage } from '../proposer/proposer';
import { RespondantPage } from '../respondant/respondant';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import {LoadingController} from 'ionic-angular';
import * as firebase from 'firebase';
// import functions from 'firebase-functions';

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
  subscription:any;
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
      console.log(this.gamecode);
      // added .doc(all["GameId"]) to line 67
      this.itemDoc = this.afs.collection<any>('Professor').doc(this.gamecode);
      this.item = this.itemDoc.valueChanges();
      this.subscription=this.item.subscribe(res=>{
        console.log(res);

        this.userDisconnectState(all);
       res=[res];
        for (let p=0;p<res.length;p++){
             if (res[p].professorStatus=='Ready'){
              // find out if user is a proposer or responder
              this.loader.dismiss();
              console.log("in")
              this.responderOrProposal(this.navParams.data);

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

  ionViewDidLeave(){
    this.subscription.unsubscribe();
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
    console.log(all,"ALLPA")
    all=this.navParams.data;
    this.itemDoc =  this.afs.collection<any>('Game', ref => ref.where('responderUUID', '==', all.UUID).where('round', '==', 0));
    this.item = this.itemDoc.valueChanges();
let iu=0;// else if keep getting in
this.subscription=this.item.subscribe(res=>{

  console.log("res1",res)
  if (res.length==0){
    //meaning this person is proposer instead
    this.itemDoc =  this.afs.collection<any>('Game', ref => ref.where('proposerUUID', '==', all.UUID).where('round', '==', 0));
    this.item = this.itemDoc.valueChanges();
let iu=0;// else if keep getting in
this.subscription=this.item.subscribe(res=>{
  console.log("Res2,",res)
  for (let p=0;p<res.length;p++){
    if (res[p].proposerStatus=="Not Ready" && iu==0){
      // user is a proposer in the next round
      let passnextpg={UUID: all.UUID, username: all.username, GameId: this.gamecode, gameMode: res[p].gameMode}
      console.log("((gamecode.ts)): "+ res[p].gameMode);
      this.navCtrl.push(ProposerPage, passnextpg);
    iu+=1
     console.log("First")

    }
  }
})
  }
  else{
     for (let p=0;p<res.length;p++){

          let passnextpg={UUID: all.UUID, username: all.username, GameId: this.gamecode, gameMode: res[p].gameMode}
          if (res[p].proposerStatus=="Ready" && res[p].round==0) {
            // user is a responder in the next round
            // **** needs to create a loader and wait for the proposer to submit their values
          //  this.loader.dismiss();
            console.log("((gamecode.ts)): "+ res[p].gameMode);
            this.navCtrl.push(RespondantPage, passnextpg);


          }

          //  else if (res[p].proposerStatus=="Not Ready" && iu==0){
          //   // user is a proposer in the next round
          //   // this.loader.dismissAll()
          //   this.navCtrl.push(ProposerPage, passnextpg);
          // iu+=1
          //  console.log("First")

          // }
          else{
            this.hide=true;
          }

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

