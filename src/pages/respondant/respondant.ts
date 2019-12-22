import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProfessorHomePage } from '../professor-home/professor-home';
import { AngularFirestore } from '@angular/fire/firestore';
import {LoadingController} from 'ionic-angular';
import { ResultPage } from '../result/result';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'page-respondant',
  templateUrl: 'respondant.html'
})
export class RespondantPage {
  itemDoc:any;
  item:any;
  proposerAmt = 0;
  proposerUsername = "";
  responderData:any;
  firebaseId = "";
  maxtime: any=30;
  timer:any;

  constructor(public navCtrl: NavController,
    public loadingCtrl:LoadingController,
    public afs: AngularFirestore,
    public navParams: NavParams) {
      this.StartTimer()

      let all=this.navParams.data;
      this.itemDoc = this.afs.collection<any>('Game');
      this.item = this.itemDoc.valueChanges();

      this.item.subscribe(res=>{
        console.log("Hi: "+ res);
        for (let p=0;p<res.length;p++){
            //if (res[p].responderUUID == all.UUID && res[p].gameId==all.gamecode) { --> ***GAMECODE TEMP NOT WORKING
            if (res[p].responderUUID == all.UUID && res[p].round==0) {
              // user is a responder in the next round
              this.proposerAmt = res[p].proposerAmount;
              this.proposerUsername = res[p].proposerName;
            }

          }

      })
        //this.proposerAmt = all.proposerAmount;
      // const loading = this.loadingCtrl.create({

      // });
      // loading.dismiss();
      //this.CheckIfProposerStatusChange();
  }

  /*CheckIfProposerStatusChange(){
    // Makes sure that the proposer is 'Ready' before responder could do anything
    this.itemDoc = this.afs.collection<any>('Game');
    this.item = this.itemDoc.valueChanges();
    let all=this.navParams.data;

    this.item.subscribe(res=>{

      console.log("My UUID: "+ all.UUID);
      for (let p=0;p<res.length;p++){
        if (res[p]==undefined || res[p]==null){
        }
        else{

          // constantly loading until proposer has entered a value
          const loading = this.loadingCtrl.create({

          });
          this.presentLoading(loading);
          console.log("Hi!");
          if (res[p].responderUUID == all.UUID && res[p].round == 0 && res[p].proposerStatus == "Ready"){ //*** hardcoding round

            // store proposerAmount here
            console.log("Proposer Status changed!");
            this.proposerAmt = res[p].proposerAmount;
            loading.dismiss();
          }
        }

      }

    })
  }*/

  /*Next(){
    this.navCtrl.setRoot(ProfessorHomePage);
  }*/

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
            this.Accept().subscribe((r)=>{
            console.log(r)
             this.afs.collection('Game').doc(r).valueChanges().subscribe(res=>{
    
      console.log(res);
            this.firebaseId=res["proposerUUID"] + res["round"] +  res["responderUUID"] +res["round"];
            this.updateResponderStatus(this.firebaseId,"Accept");
            let dict={"Role":"Respondant","FirebaseId":this.firebaseId};
            this.navCtrl.push(ResultPage,dict)
            })})

         }
          
          else{
             // this.hidevalue = true;
          }

      }, 1000);
 

  }

  Accept():Observable<any>{
    var subject = new Subject<any>();
    // update responder's response as 'Accept'
    this.itemDoc = this.afs.collection<any>('Game');
    this.item = this.itemDoc.valueChanges();
    let all=this.navParams.data;

    this.item.subscribe(res=>{

      console.log("My UUID: "+ all.UUID);
      for (let p=0;p<res.length;p++){
        if (res[p]==undefined || res[p]==null){
        }
        else{
          if (res[p].responderUUID == all.UUID && res[p].round == 0){ //*** hardcoding round
            // store responderData here
            this.responderData = res[p];
            this.firebaseId = res[p].proposerUUID + res[p].round + res[p].responderUUID + res[p].round
            console.log("firebaseId: " + this.firebaseId );
            this.updateResponderStatus(this.firebaseId, 'Accept');
            let dict={"Role":"Respondant","FirebaseId":this.firebaseId,"Result":"Accept"};
            this.navCtrl.setRoot(ResultPage,dict)
            subject.next(this.firebaseId);
          }

        }

      }

    })
    return subject.asObservable();
  }

  Decline(){
    // update responder's response as 'Decline'
    this.itemDoc = this.afs.collection<any>('Game');
    this.item = this.itemDoc.valueChanges();
    let all=this.navParams.data;

    this.item.subscribe(res=>{

      console.log("My UUID: "+ all.UUID);
      for (let p=0;p<res.length;p++){
        if (res[p]==undefined || res[p]==null){
        }
        else{
          if (res[p].responderUUID == all.UUID && res[p].round == 0){ //*** hardcoding round
            // store responderData here
            this.responderData = res[p];
            this.firebaseId =  res[p].proposerUUID + res[p].round + res[p].responderUUID + res[p].round
            console.log("firebaseId: " + this.firebaseId );
            this.updateResponderStatus(this.firebaseId, 'Decline');
            let dict={"Role":"Respondant","FirebaseId":this.firebaseId,"Result":"Decline"};
            this.navCtrl.setRoot(ResultPage,dict)
          }
        }

      }

    })
  }

  updateResponderStatus(dbid, responderResponse){
    // Updating the game status to "Ready"
    this.afs.collection('Game').doc(dbid).update({
      responderStatus: "Ready",
      responderResponse: responderResponse
     })
    .then((data) => {
      //console.log("Data: "+data);
    }).catch((err) => {
      console.log("Err: "+err);
    })
  }

  // async presentLoading(loading) {
  //   return await loading.present();
  // }
}
