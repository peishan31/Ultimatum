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
professorcode: any;
retrieveprofessor: any;
itemm: any;

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
      console.log('ok')
    }
    else if (this.all['nextroundfirebaseid']=="") {
      // find their nextroundfirebaseid here
      /*this.professorcode = this.afs.collection<any>('Professor').doc(this.all["GameId"])
      this.retrieveprofessor = this.professorcode.valueChanges();
      //if (this.goonce == 1){
      this.subscription=this.retrieveprofessor.subscribe(ress=>{ // one data from Professor
        this.itemDoc = this.afs.collection<any>('Game', ref =>
        ref
        //.where('gameId', '==', all["GameId"])
        .where('responderUUID', '==', this.all["UUID"])
        .where('round', '==', parseInt(ress["round"]))
        );

        this.item = this.itemDoc.valueChanges();

        this.subscription= this.item.subscribe(res=>{
          //if cannot find the length, we test if its proposer
          if (res.length==0) { // User is highly likely to be a proposer cos responder data is empty
            this.itemDoc = this.afs.collection<any>('Game', ref =>
                ref
                //.where('gameId', '==', all["GameId"])
                .where('proposerUUID', '==', this.all["UUID"])
                .where('round', '==', parseInt(ress["round"]))
              );
              this.itemm = this.itemDoc.valueChanges();

              this.subscription= this.itemm.subscribe(resss=>{
                if (resss.length!=0) { // User is proposer cos there is data
                  for (let p=0;p<resss.length;p++){

                    var nextroundfirebaseid = resss[p].proposerUUID + parseInt(ress["round"]) + resss[p].responderUUID + parseInt(ress["round"]);
                    console.log("Proposer's next round firebase id: ((nextround.ts)) " + nextroundfirebaseid);
                  }
                }
                else {
                  console.log("Whoops! An error has occurred at Line 282 on respondant page. You are neither a proposer or responder for the time being");
                }
              })
          }
          else { // responder
            for (let p=0;p<res.length;p++){ // Game table
              var nextroundfirebaseid = res[p].proposerUUID + parseInt(ress["round"]) + res[p].responderUUID + parseInt(ress["round"]);
              console.log("Proposer's next round firebase id: ((nextround.ts)) " + nextroundfirebaseid);
            }
          }
        })
      })*/
      console.log("Peishan, please code nextroundfireid");
    }
    if (this.all["nextroundfirebaseid"]!=null && this.all["nextroundfirebaseid"]!=undefined && this.all["gonextround"]==0){
       //  let passnextpg={UUID:res["responderUUID"],username:res["responderName"],dateTime:this.datetime,GameId:this.data["GameId"]};
      this.subscription=  this.afs.collection('Game').doc(this.all.nextroundfirebaseid).valueChanges().subscribe(res=>{
        console.log("reshr (next round firebase id's stuff) --> if there is nth, nextroundfirebaseid",res)

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
            //gameMode: this.all["gameMode"]
          };

          console.log("Round: " + this.all["Round"]);
          if (res["proposerStatus"]=="Ready" && res["responderResponse"]=="" && this.all["Role"]=="Respondant") {

            console.log("this is passed in");
            this.navCtrl.setRoot(RespondantPage, passnextpg);
          }
        }
      })
    }
  }

}
