import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
/**
 * Generated class for the PastscoreboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pastscoreboard',
  templateUrl: 'pastscoreboard.html',
})
export class PastscoreboardPage {
  hi:any;
  item:any;
  itemDoc:any;
  i=0;
  subscription:Subscription
  list=[]
  myPerson=[]
  studentnum=0;
  scoreboard=[];
  roundsselectedfilter:number;
  studentsList={"username": [], "UUID": [], "totalRound": 0}
  scorefilter:string;
  proposerUUID="";
  proposerName="";
  responderUUID="";
  responderName="";
  arr:any;
  currentround:number;
  totalround:number;
  retrievedvalue:any;
  u=0;
  roundss=[];
  selecting="Accumulated rounds";
   //
 chosengamecode:string;
 professorcodes:any;
 gamecode=[];
 gamemode:string;
 mode:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,public afs:AngularFirestore,) {
  }

  ionViewDidEnter(){
    this.scorefilter="Score-High to Low";
    this.professorcodes = this.afs.collection<any>('Professor').ref
    .where('professorStatus', '==', "Ready")
    .get()
    .then(ress => {
console.log(ress)
    if (ress.docs.length != 0) {
      ress.forEach(ProfessorDoc => {
        if ( ProfessorDoc.data().professorStatus=='Ready' && parseInt(ProfessorDoc.data().round)==parseInt(ProfessorDoc.data().totalround)-1) {
          this.gamecode.push(ProfessorDoc.data().gameId);
        }
      }
      )

    }
  })
  }

  scoreboardscore(){ 
    this.scorefilter="Score-High to Low";
    this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('gameId', '==', this.chosengamecode).where('proposerStatus', '==', "Ready"));
    this.scoreboard.length=0;
    this.item = this.itemDoc.valueChanges();
    this.subscription= this.item.subscribe(res=>{

      for (let p=0;p<res.length;p++){
         if (res[p].responderResponse=="Accept"){
            let responderlist={"username":res[p].responderName,"score":res[p].proposerAmount,"role":"Responder"}
            this.scoreboard.push(responderlist);
            if (res[p].proposerAmount==0){
           let proposerlist={"username":res[p].proposerName,"score":0,"role":"Proposer"}
           this.scoreboard.push(proposerlist)
            }
            else{  
           let proposerlist={"username":res[p].proposerName,"score":100-res[p].proposerAmount,"role":"Proposer"}
           this.scoreboard.push(proposerlist)
            }
           

      }
      else if (res[p].responderResponse=="Decline"){
          let responderlist={"username":res[p].responderName,"score":0,"role":"Responder"}
          let proposerlist={"username":res[p].proposerName,"score":0,"role":"Proposer"}
          this.scoreboard.push(proposerlist)
          this.scoreboard.push(responderlist)
        }
        console.log(this.scoreboard,"scoreboard")

  }
  var holder = {};
  this.scoreboard.forEach(function(d) {
    if (holder.hasOwnProperty(d.username)) {
      holder[d.username] = holder[d.username] + d.score;
    } else {
      holder[d.username] = d.score;
    }

  });
  var obj2 = [];
  for (var prop in holder) {
    obj2.push({ username: prop, score: holder[prop]});
  }
  console.log(obj2);
  obj2.sort(function(a, b){return a.score - b.score});
  obj2.reverse();
  this.arr=obj2;
  console.log(this.arr,"ARR");
  
  for (let i=0; i<this.arr.length;i++){
    this.itemDoc = this.afs.collection<any>('Professor', ref => ref.where('gameId', '==', this.chosengamecode));
    this.item = this.itemDoc.valueChanges();
    this.subscription= this.item.subscribe(ress=>{
      this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('gameId', '==', this.chosengamecode).where('proposerName', '==', this.arr[i].username).where('round', '==', parseInt(ress[0].round)));
    this.item = this.itemDoc.valueChanges();
    this.subscription= this.item.subscribe(retrievecurrentroundvalue=>{
      if (retrievecurrentroundvalue.length!=0){
        console.log(retrievecurrentroundvalue[0].proposerAmount)
       this.arr[i].role="Proposer";
       this.arr[i].result=retrievecurrentroundvalue[0].responderResponse; 
       if (retrievecurrentroundvalue[0].proposerAmount==0|| retrievecurrentroundvalue[0].responderResponse=="Decline"){
        this.arr[i].scorethisround=0;
       } 
       else{
         this.arr[i].scorethisround=100-retrievecurrentroundvalue[0].proposerAmount;
       }
       
      }
      else{
        this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('gameId', '==', this.chosengamecode).where('responderName', '==', this.arr[i].username).where('round', '==', parseInt(ress[0].round)));
        this.item = this.itemDoc.valueChanges();
        this.subscription= this.item.subscribe(retrievecurrentroundvalue=>{
          if (retrievecurrentroundvalue.length!=0&&retrievecurrentroundvalue[0].responderResponse!="Decline"){
            this.arr[i].role="Responder";
            this.arr[i].result=retrievecurrentroundvalue[0].responderResponse; 
            this.arr[i].scorethisround=retrievecurrentroundvalue[0].proposerAmount;
          }
          else if (retrievecurrentroundvalue.length!=0&&retrievecurrentroundvalue[0].responderResponse=="Decline"){
            this.arr[i].role="Responder";
            this.arr[i].result=retrievecurrentroundvalue[0].responderResponse; 
            this.arr[i].scorethisround=0;

          }
        })
      
      }

      })
    })
      }
    })
    }

  onSelectChange(selectedValue: any) {
    this.scorefilter="Score-High to Low";
    console.log('Selected', selectedValue);
    if (selectedValue=="Individual round"){
     this.selecting="Individual round";
     this.roundsselectedfilter=1;
     this.roundselect(this.roundsselectedfilter);
    }
    // else if (selectedValue=="Score-High to Low"){
      // let shandss = document.getElementsByClassName('hidecollectedby') as HTMLCollectionOf<HTMLElement>;
      // shandss[0].style.display="";
      // let shandsss = document.getElementsByClassName('hidesign') as HTMLCollectionOf<HTMLElement>;
      // shandsss[0].style.display="";
    //   this.selecting="Score-High to Low";
    // }
    // else if (selectedValue=="Score- Low to High"){
    // this.selecting="Score- Low to High";
    // }
    else if (selectedValue=="Accumulated rounds"){
      this.selecting="Accumulated rounds";
      this.scoreboardscore();

    }
  }

    roundselect(selectedValue: any) {
      this.scorefilter="Score-High to Low";
      this.roundsselectedfilter=parseInt(selectedValue);
      let list=[];
        this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('gameId', '==', this.chosengamecode).where('round', '==', selectedValue-1));
      this.item = this.itemDoc.valueChanges();
      this.subscription= this.item.subscribe(retrievecurrentroundvalue=>{
        for (let i=0;i<retrievecurrentroundvalue.length;i++){   
        if (retrievecurrentroundvalue[i].proposerName!=""){
         if (retrievecurrentroundvalue[i].proposerAmount==0|| retrievecurrentroundvalue[i].responderResponse=="Decline"){
          let selectround={};
          selectround["role"]="Proposer";
          selectround["username"]=retrievecurrentroundvalue[i].proposerName;
         selectround["result"]=retrievecurrentroundvalue[i].responderResponse; 
          selectround["scorethisround"]=0;
          selectround["score"]=0;
          selectround["score"]=0;
          selectround["amt"]=retrievecurrentroundvalue[i].proposerAmount;
         list.push(selectround)
         } 
         else if (retrievecurrentroundvalue[i].proposerAmount!=0|| retrievecurrentroundvalue[i].responderResponse=="Accept"){
          let selectround={};
          selectround["role"]="Proposer";
          selectround["username"]=retrievecurrentroundvalue[i].proposerName;
         selectround["result"]=retrievecurrentroundvalue[i].responderResponse; 
           selectround["scorethisround"]=100-retrievecurrentroundvalue[i].proposerAmount;
           selectround["username"]=retrievecurrentroundvalue[i].proposerName;
           selectround["score"]=100-retrievecurrentroundvalue[i].proposerAmount;
           selectround["amt"]=retrievecurrentroundvalue[i].proposerAmount;
           
           list.push(selectround)
         }
         
        }
        if (retrievecurrentroundvalue[i].responderName!=""){
          if (retrievecurrentroundvalue[i].proposerAmount==0|| retrievecurrentroundvalue[i].responderResponse=="Decline"){
            let responderdict={};
            responderdict["scorethisround"]=0;
            responderdict["score"]=0;
            responderdict["role"]="Responder";
           responderdict["username"]=retrievecurrentroundvalue[i].responderName;
           responderdict["result"]=retrievecurrentroundvalue[i].responderResponse;
           responderdict["amt"]=retrievecurrentroundvalue[i].proposerAmount; 
          list.push(responderdict)
          } 
        else if (retrievecurrentroundvalue[i].proposerAmount!=0 && retrievecurrentroundvalue[i].responderResponse=="Accept"){
          let responderdict={};
            responderdict["scorethisround"]=retrievecurrentroundvalue[i].proposerAmount;
            responderdict["score"]=0;
            responderdict["role"]="Responder";
            responderdict["username"]=retrievecurrentroundvalue[i].responderName;
            responderdict["score"]=retrievecurrentroundvalue[i].proposerAmount;
            responderdict["result"]=retrievecurrentroundvalue[i].responderResponse; 
            responderdict["amt"]=retrievecurrentroundvalue[i].proposerAmount; 
            list.push(responderdict)
          }
          
         }
       
  
    
       }
       if (this.arr.length!=0){
         this.arr.length=0;
       }
       list.sort(function(a, b){return a.score - b.score});
       list.reverse();
       this.arr=list;
       
       })

    }

    scorefiltering(selectedValue: any){
     this.scorefilter=selectedValue;
     console.log(this.scorefilter)
  if (selectedValue=="Score-High to Low"){
    this.scorefilter="Score-High to Low";
       this.arr.reverse();
       
     }
     else {
       this.scorefilter="Score-Low to High";
       this.arr.reverse();
     }

    }

    gamecodes(selectedValue:any){
      let shandss = document.getElementsByClassName('hidethisfirst') as HTMLCollectionOf<HTMLElement>;
      shandss[0].style.display="";
      this.chosengamecode=selectedValue;
      this.scoreboardscore();
      this.selecting="Accumulated rounds";
      this.professorcodes = this.afs.collection<any>('Professor').ref
      .where('professorStatus', '==', "Ready")
      .where('gameId', '==', this.chosengamecode)
      .get()
      .then(ress => {
  console.log(ress)
      if (ress.docs.length != 0) {
        ress.forEach(ProfessorDoc => {
          console.log(ress)
          if ( ProfessorDoc.data().professorStatus=='Ready' && parseInt(ProfessorDoc.data().round)==parseInt(ProfessorDoc.data().totalround)-1) {
            this.totalround= parseInt(ProfessorDoc.data().totalround);
            this.gamemode=ProfessorDoc.data().gameMode;
            
          }
        }
        )
  
      }
    })
    

    }

    prevround(round){
      this.scorefilter="Score-High to Low";
      console.log(round);
      this.roundselect(round-1);
      this.roundsselectedfilter=parseInt(round)-1;
      console.log(this.roundsselectedfilter,"filter")
      
    }

    gonext(round){
      this.scorefilter="Score-High to Low";
      console.log(round);
      this.roundselect(round+1);
      this.roundsselectedfilter=parseInt(round)+1;

    }

    ngOnDestroy() {

      let all=this.navParams.data;
      if (all["gameMode"] == "Random all players") {
        if (this.subscription) this.subscription.unsubscribe();
      }
    }


}
