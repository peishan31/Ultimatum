import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RespondantPage } from '../respondant/respondant';
import { AngularFirestore } from '@angular/fire/firestore';
import {LoadingController} from 'ionic-angular';
import { Subject, Observable, Subscription } from 'rxjs';
import { ResultPage } from '../result/result';

@Component({
  selector: 'page-proposer',
  templateUrl: 'proposer.html'
})
export class ProposerPage {
  range=0;
  itemDoc:any;
  item:any;
  proposerData:any;
  firebaseId = "";
  maxtime: any=30;
  timer:any;
  subscription:Subscription;
  offer:Subscription;
  game:Subscription;

  constructor(public navCtrl: NavController,
    public afs: AngularFirestore,
    public loadingCtrl:LoadingController,
    public navParams: NavParams) {
     // this.StartTimer()
  }

  StartTimer(){
    this.timer = setTimeout(x => 
      {
          if(this.maxtime <= 0) { }
          this.maxtime -= 1;

          if(this.maxtime>0){
           // this.hidevalue = false;
            this.StartTimer();
          }
          
          else if (this.maxtime==0){
             // this.hidevalue = true;
            // this.offer= this.submitProposerOffer().subscribe((r)=>{
            //             this.range=0;
            //  this.updateProfessorStatus(r);
            //  let dict={"Role":"Proposer","FirebaseId":this.firebaseId,"Amount":0};
            //  this.navCtrl.setRoot(ResultPage,dict)
            //  })
            this.submitProposerOffer();
          }

      }, 1000);
 

  }

  ionViewDidEnter(){
    this.StartTimer();
  }

  Next(){
    this.submitProposerOffer();
    
   // then loading screen for the responder to respond
    // const loading = this.loadingCtrl.create({

    // });
   
    // this.submitProposerOffer().subscribe((r)=>{
    //   console.log(r)
    // this.afs.collection('Game').doc(r).valueChanges().subscribe(res=>{
    
    //   console.log(res);
    //   console.log(res["responderResponse"]);
    //   console.log(res["gameId"]);
    //   if (res["responderResponse"]!=""){
    //     this.navCtrl.push(ResultPage)
    //     loading.dismissAll();
    //     loading.dismiss();
    //   }
    //   else{
    //     this.presentLoading(loading);
    //     loading.present();
    //   }
  
    // })});
    //this.navCtrl.setRoot(RespondantPage);
  }

  submitProposerOffer():Observable<any>{
    var subject = new Subject<any>();
    // get the data using proposer's UUID
    // then combine the id with current-round+proposer-name+responder-name
    // using this id, update the proposerAmount & proposerStatus
    this.itemDoc = this.afs.collection<any>('Game');
    this.item = this.itemDoc.valueChanges();
    let all=this.navParams.data;

    this.subscription= this.item.subscribe(res=>{

      console.log("My UUID: "+ all.UUID);
      for (let p=0;p<res.length;p++){
        if (res[p]==undefined || res[p]==null){
        }
        else{
          if (res[p].proposerUUID == all.UUID && res[p].round == 0 && res[p].responderResponse==""){ //*** hardcoding round
            // store proposerData here
            this.proposerData = res[p];
           // this.firebaseId = res[p].round + res[p].proposerName + res[p].responderName //ps code i comment out
           this.firebaseId= res[p].proposerUUID + res[p].round +  res[p].responderUUID +res[p].round;
            console.log("firebaseId: " + this.firebaseId );
            this.updateProfessorStatus(this.firebaseId);

            let dict={"Role":"Proposer","FirebaseId":this.firebaseId,"Amount":this.range};
            this.navCtrl.setRoot(ResultPage,dict);
            subject.next(this.firebaseId);
           
          }
        }

      }

    }) 
    return subject.asObservable();
  }

  updateProfessorStatus(dbid){
    // Updating the game status to "Ready"
    this.afs.collection('Game').doc(dbid).update({
      proposerStatus: "Ready",
      proposerAmount: this.range
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

  ionViewDidLeave(){
    this.subscription.unsubscribe();
   // this.offer.unsubscribe();
  //  this.game.unsubscribe();
  } 
}

