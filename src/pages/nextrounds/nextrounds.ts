import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { RespondantPage } from '../respondant/respondant';
/**
 * Generated class for the NextroundsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nextrounds',
  templateUrl: 'nextrounds.html',
})
export class NextroundsPage {
all:any;
itemDoc:any;
item:any;
subscription:Subscription;
  constructor(public navCtrl: NavController, public navParams: NavParams,public afs: AngularFirestore,) {
    var val = this.navCtrl.last().name;
    console.log("VAL");
    console.log(val);
  }

  ionViewDidLoad() {
    this.all=this.navParams.data;
    console.log("{{nextRound.ts Page}}: " + JSON.stringify(this.all["nextroundfirebaseid"]));
    console.log("{{nextRound.ts Page}}: " + JSON.stringify(this.all));
    console.log("{{nextRound.ts Page}}: " + this.all["gonextround"]);
    if (this.all['nextroundfirebaseid']==null){

    }
    else if (this.all["nextroundfirebaseid"]!=null && this.all["nextroundfirebaseid"]!=undefined && this.all["gonextround"]==0){
       //  let passnextpg={UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"]};
      this.subscription=  this.afs.collection('Game').doc(this.all.nextroundfirebaseid).valueChanges().subscribe(res=>{
        console.log("reshr",res)

        if (res!=undefined || res!=null){
          // gameMode
          console.log("{{nextround.ts}}: " + JSON.stringify(this.all));
          console.log("this is passed in ((nextround.ts)): ");
          let passnextpg={
            UUID: this.all["UUID"],
            username: this.all["username"],
            GameId: this.all["GameId"],
            gameMode: this.all["gameMode"],
            // Role
            // amount
            // FirebaseId
            // nextroundfirebaseid
            Round: this.all["Round"],
            once:0,
            gameMode: this.all["gameMode"]};
          if (res["proposerStatus"]=="Ready" && res["responderResponse"]=="" && this.all["Role"]=="Respondant") {

            this.navCtrl.setRoot(RespondantPage, passnextpg);
          }
        }
      })
    }
  }

}
