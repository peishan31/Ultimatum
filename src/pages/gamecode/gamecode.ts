import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Loading } from 'ionic-angular';
import { ProposerPage } from '../proposer/proposer';
import { RespondantPage } from '../respondant/respondant';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import {LoadingController} from 'ionic-angular';
import * as firebase from 'firebase';
import { UltimatumPage } from '../ultimatum/ultimatum';
import { Storage } from '@ionic/storage';
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
  professorcodes:any;
gamecode:string;
submitted=false;
itemDoc:any;
item:any;
list=[];
loader:Loading;
hide:Boolean;
showLoading: Boolean;
myPerson={};
errormsg:string;
inhere=0;
subscribed=false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afs: AngularFirestore,
    public loadingCtrl:LoadingController,
    public toastCtrl:ToastController,
    private storage: Storage
    ) {
    console.log(navParams.data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamecodePage');

  }

  validate(){
    this.professorcodes = this.afs.collection<any>('Professor').ref
    .where('gameId', '==', this.gamecode)
    .where('professorStatus', '==', "Not Ready")
    .get()
    .then(ress => {
    console.log(ress)
    if (ress.docs.length == 0) {
      // ress.forEach(ProfessorDoc => {

      // })
      this.errormsg="Code invalid or game has already started...";
    }
    else{
      this.errormsg="";
    }
     }   )

  }

  Next(form: NgForm){
    this.submitted = true;
    if (form.valid && this.gamecode!= '' && this.gamecode!=null && this.inhere==0) {
      this.showLoading=true;
      this.professorcodes = this.afs.collection<any>('Professor').ref
      .where('gameId', '==', this.gamecode)
      .where('professorStatus', '==', "Not Ready")
      .get()
      .then(ress => {
      console.log(ress)
      if (ress.docs.length == 0) {
        // ress.forEach(ProfessorDoc => {
        
        // })
        this.errormsg="Code invalid or game has already started...";
      }
      else{
        this.errormsg="";
    
       
     if (this.errormsg==""){
 // let shand = document.getElementsByClassName('hidemsg') as HTMLCollectionOf<HTMLElement>;
    // shand[0].style.display="none";
    let data= this.navParams.data;
    this.itemDoc = this.afs.collection<any>('Participant', ref => ref.where('username', '==', data["username"]).where('gameId', '==', this.gamecode));
    this.item = this.itemDoc.valueChanges();
    this.subscription= this.item.subscribe(res=>{

      this.subscribed = true;
      if (res.length==0){

        //means currently no user with same username
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
                //this.updateParticipantInGame(all);
                //this.createParticipant(all);
                this.loader.dismiss();
                console.log("in")
                this.inhere+=1;
                this.responderOrProposal(this.navParams.data);

            }

          }

        })
      }

      else{
        // let shand = document.getElementsByClassName('hidemsg') as HTMLCollectionOf<HTMLElement>;
        // shand[0].style.display="";
        this.errormsg="Already have exising username..";
      }

    })


  }
  else{
    // let shand = document.getElementsByClassName('hidemsg') as HTMLCollectionOf<HTMLElement>;
    // shand[0].style.display="";
  }

  this.storage.get("EnteredGameCode").then((val) => {

    if (val == true) {
      if (this.subscription){
        this.subscription.unsubscribe();
      }
    }
  })
     }
    }
      )  } 
   
  }

  userDisconnectState(all) {
    return new Promise<any>((resolve, reject) => {

      var ref = firebase.database().ref(`/` + "User" + `/` + all.UUID + `/`);
      ref.on('value', snapshot => {
        console.log("Yoooo: "+ ref);
        ref
        .onDisconnect()
        .update({
          /*
          UUID: value.UUID,
          online: true,
          gameId: value.gameId,
          inGame: false
          */
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
    if (this.subscribed == true) {
      this.subscription.unsubscribe();
    }
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
      ref.set({
        UUID: value.UUID,
        online: true,
        gameId: value.gameId,
        inGame: false
      });
    })

  }

  responderOrProposal(all){
    /*all=this.navParams.data;
    let iu=0;// else if keep getting in
    if (iu==0){
    this.itemDoc =  this.afs.collection<any>('Game', ref => ref.where('responderUUID', '==', all.UUID).where('round', '==', 0));
    this.item = this.itemDoc.valueChanges();
    this.subscription=this.item.subscribe(res=>{

      console.log("res1",res)
      if (res.length==0 && iu==0){
        //meaning this person is proposer instead
        this.itemDoc =  this.afs.collection<any>('Game', ref => ref.where('proposerUUID', '==', all.UUID).where('round', '==', 0));
        this.item = this.itemDoc.valueChanges();
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
      else if (iu==0){
        for (let p=0;p<res.length;p++){
          let passnextpg={UUID: all.UUID, username: all.username, GameId: this.gamecode, gameMode: res[p].gameMode}
          if (res[p].proposerStatus=="Ready" && res[p].round==0) {
            // user is a responder in the next round
            // **** needs to create a loader and wait for the proposer to submit their values
          //  this.loader.dismiss();
            console.log("((gamecode.ts)): "+ res[p].gameMode);
            iu+=1
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
  }*/
  all=this.navParams.data;
    let iu=0;// else if keep getting in
    if (iu==0){
    console.log("all: " + JSON.stringify(all));
    console.log("Before: " + all.Round);
    this.itemDoc =  this.afs.collection<any>('Game', ref => // real-time to check if proposal/responder is ready
      ref
      .where('responderUUID', '==', all.UUID)
      .where('round', '==', 0));
    this.item = this.itemDoc.valueChanges();
    this.subscription=this.item.subscribe(res=>{
      console.log("local storage stuff: " + localStorage.getItem("enterGameCode"+all.UUID));
      console.log("res1",res)
      if ((res.length==0 && iu==0 && localStorage.getItem("enterGameCode"+all.UUID)==null) || ((localStorage.getItem("enterGameCode"+all.UUID)=="OK"))){

        //meaning this person is proposer instead
        this.itemDoc =  this.afs.collection<any>('Game', ref =>
          ref
          .where('proposerUUID', '==', all.UUID)
          .where('round', '==', 0));
        this.item = this.itemDoc.valueChanges();
        this.subscription=this.item.subscribe(res=>{

          console.log("Res2,",res)
          for (let p=0;p<res.length;p++){
            if (res[p].proposerStatus=="Not Ready" && iu==0){

              // user is a proposer in the next round
              let passnextpg={
                UUID: all.UUID,
                username: all.username,
                GameId: this.gamecode,
                gameMode: res[p].gameMode,
                Round: all.Round
              }
              if (all.Round > 0) {

                passnextpg["Role"] = "Proposal";
                passnextpg["FirebaseId"] = all.FirebaseId;
                passnextpg["nextroundfirebaseid"] = all.nextroundfirebaseid;
              }

              console.log("((gamecode.ts)): "+ res[p].gameMode);

              this.subscription.unsubscribe();

              // Create local storage here
              this.storage.set(all.UUID+"EnteredGameCode", false);
              this.storage.set(all.UUID+"EnteredProposal", false);
              this.storage.set(all.UUID+"EnteredRespondant", false);
              this.storage.set(all.UUID+"EnteredResult", false);
              this.storage.set(all.UUID+"EnteredNextRound", false);

              localStorage.setItem("enterGameCode"+all.UUID, "NO");
              this.navCtrl.setRoot(ProposerPage, passnextpg);

              iu+=1
              console.log("First")
            }
          }
        })
      }
      else if ((iu==0 && localStorage.getItem("enterGameCode"+all.UUID)==null) || (localStorage.getItem("enterGameCode"+all.UUID)=="OK")){

        for (let p=0;p<res.length;p++){
          let passnextpg={
            UUID: all.UUID,
            username: all.username,
            GameId: this.gamecode,
            gameMode: res[p].gameMode,
            Round: all.Round}
            if (all.Round > 0) {
              passnextpg["Role"] = "Respondant";
              passnextpg["FirebaseId"] = all.FirebaseId;
              passnextpg["nextroundfirebaseid"] = all.nextroundfirebaseid;

            }
          if (res[p].proposerStatus=="Ready" && res[p].round==0) {
            // user is a responder in the next round
            // **** needs to create a loader and wait for the proposer to submit their values
          //  this.loader.dismiss();
            console.log("((gamecode.ts)): "+ res[p].gameMode);
            iu+=1

            this.subscription.unsubscribe();

            // Create local storage here
            this.storage.set(all.UUID+"EnteredGameCode", false);
            this.storage.set(all.UUID+"EnteredProposal", false);
            this.storage.set(all.UUID+"EnteredRespondant", false);
            this.storage.set(all.UUID+"EnteredResult", false);
            this.storage.set(all.UUID+"EnteredNextRound", false);

            localStorage.setItem("enterGameCode"+all.UUID, "NO");
            this.navCtrl.setRoot(RespondantPage, passnextpg);
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


  back(){
    this.navCtrl.setRoot(UltimatumPage);
  }

  ionViewWillEnter(){
    this.storage.set("EnteredGameCode", false)
    if (this.subscribed == true) {
      this.subscription.unsubscribe();
    }
  }
}

