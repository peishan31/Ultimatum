import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

/**
 * Generated class for the ResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {
  Proposer:Boolean;
  Responder:Boolean;
  Result:String;
  ResponderName:String;
  ProposerName:String;
  subscription:Subscription;
  constructor(public navCtrl: NavController, public navParams: NavParams,public afs: AngularFirestore) {
    let data=navParams.data;
    this.subscription=  this.afs.collection('Game').doc(data["FirebaseId"]).valueChanges().subscribe(res=>{
      this.Result=res["responderResponse"];
      this.ProposerName=res["proposerName"];
      this.ResponderName=res["responderName"];

      console.log(res);
      console.log(res["responderResponse"]);
      console.log(res["gameId"]);
  
   
    if (data["Role"]=="Proposer"){
      if (this.Result==""){
        this.Proposer=false;
      }
      else{
        this.Proposer=true;

      }
    }
    else{
      this.Responder=true;
    }
   });
  }

  ionViewDidLoad() {
   
  }

 ionViewDidLeave(){
    this.subscription.unsubscribe();
  } 
}
