import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { AngularFirestore } from '@angular/fire/firestore';
/**
 * Generated class for the AnalyticsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-analytics',
  templateUrl: 'analytics.html',
})
export class AnalyticsPage {
  @ViewChild('barChart') barChart;
  @ViewChild('lineChart') lineChart;
  @ViewChild('hrzBars') hrzBars;
  @ViewChild('doubleline') doubleline;
  professorcodes:any;
  gamecode=[];
  scorefilter:string;
  
  chosengamecode:string;

  

  bars: any;
  colorArray: any;

  lines:any;
  colorArrayLine:any;

  doublebars:any;
  doublelines:any;

  constructor(public afs:AngularFirestore) { }

  ionViewDidEnter() {
    this.chosengamecode="-";
    this.createBarChart();
    this.createLineChart();
    this.createHrzBarChart();
    this.doubleLineChart();

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

  createBarChart() {
    if (this.chosengamecode=="-"){
      this.afs.collection<any>('Game').ref
      // .where('gameId', '==', this.data["GameId"])
      // .where('round', '==', changeparse)
      // .where('responderUUID', '==', this.data["UUID"])
      .get()
      .then(res=>{
        if (res.docs.length != 0){ 
          let one=0;
          let two=0;
          let three=0;
          let four=0;
          let five=0;
          let six=0;
          let seven=0;
          let eight=0;
          let nine=0;
          let ten=0;
  
          res.forEach(ResponderGameDoc=>{
             if (ResponderGameDoc.data().proposerAmount<=10 ){
                one+=1;
             }
             else if (ResponderGameDoc.data().proposerAmount<=20 ){
              two+=1;
            }
            else if (ResponderGameDoc.data().proposerAmount<=30 ){
              three+=1;
            }
            else if (ResponderGameDoc.data().proposerAmount<=40 ){
              four+=1;
            }
            else if (ResponderGameDoc.data().proposerAmount<=50 ){
              five+=1;
            }
            else if (ResponderGameDoc.data().proposerAmount<=60 ){
              six+=1;
            }
            else if (ResponderGameDoc.data().proposerAmount<=70 ){
              seven+=1;
            }
            else if (ResponderGameDoc.data().proposerAmount<=80 ){
              eight+=1;
            }
            else if (ResponderGameDoc.data().proposerAmount<=90 ){
              nine+=1;
            }
            else{
              ten+=1;
            }
            // var nextroundfirebaseid = ResponderGameDoc.data().proposerUUID + changeparse + ResponderGameDoc.data().responderUUID + changeparse;
          })
          this.bars = new Chart(this.barChart.nativeElement, {
            type: 'bar',
            data: {
              labels: ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80','81-90','91-100'],
              datasets: [{
                label: "Proposers' offer",
                data: [one,two,three,four,five,six,seven,eight,nine,ten],
                backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
                borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
          });
        }
      
      })
    }
    else{
      this.afs.collection<any>('Game').ref
      .where('gameId', '==', this.chosengamecode)
      // .where('round', '==', changeparse)
      // .where('responderUUID', '==', this.data["UUID"])
      .get()
      .then(res=>{
        if (res.docs.length != 0){ 
          let one=0;
          let two=0;
          let three=0;
          let four=0;
          let five=0;
          let six=0;
          let seven=0;
          let eight=0;
          let nine=0;
          let ten=0;
  
          res.forEach(ResponderGameDoc=>{
             if (ResponderGameDoc.data().proposerAmount<=10 ){
                one+=1;
             }
             else if (ResponderGameDoc.data().proposerAmount<=20 ){
              two+=1;
            }
            else if (ResponderGameDoc.data().proposerAmount<=30 ){
              three+=1;
            }
            else if (ResponderGameDoc.data().proposerAmount<=40 ){
              four+=1;
            }
            else if (ResponderGameDoc.data().proposerAmount<=50 ){
              five+=1;
            }
            else if (ResponderGameDoc.data().proposerAmount<=60 ){
              six+=1;
            }
            else if (ResponderGameDoc.data().proposerAmount<=70 ){
              seven+=1;
            }
            else if (ResponderGameDoc.data().proposerAmount<=80 ){
              eight+=1;
            }
            else if (ResponderGameDoc.data().proposerAmount<=90 ){
              nine+=1;
            }
            else{
              ten+=1;
            }
            // var nextroundfirebaseid = ResponderGameDoc.data().proposerUUID + changeparse + ResponderGameDoc.data().responderUUID + changeparse;
          })
          this.bars = new Chart(this.barChart.nativeElement, {
            type: 'bar',
            data: {
              labels: ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80','81-90','91-100'],
              datasets: [{
                label: "Proposers' offer",
                data: [one,two,three,four,five,six,seven,eight,nine,ten],
                backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
                borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
          });
        }
      
      })
    }
   
    
    
    
  }

  createLineChart(){
  if (this.chosengamecode=="-"){
    this.afs.collection<any>('Game').ref
    // .where('gameId', '==', this.data["GameId"])
    // .where('round', '==', changeparse)
    .where('responderResponse', '==', "Accept")
    .get()
    .then(res=>{
      if (res.docs.length != 0){ 
        let one=0;
        let two=0;
        let three=0;
        let four=0;
        let five=0;
        let six=0;
        let seven=0;
        let eight=0;
        let nine=0;
        let ten=0;

        res.forEach(ResponderGameDoc=>{
           if (ResponderGameDoc.data().proposerAmount<=10 ){
              one+=1;
           }
           else if (ResponderGameDoc.data().proposerAmount<=20 ){
            two+=1;
          }
          else if (ResponderGameDoc.data().proposerAmount<=30 ){
            three+=1;
          }
          else if (ResponderGameDoc.data().proposerAmount<=40 ){
            four+=1;
          }
          else if (ResponderGameDoc.data().proposerAmount<=50 ){
            five+=1;
          }
          else if (ResponderGameDoc.data().proposerAmount<=60 ){
            six+=1;
          }
          else if (ResponderGameDoc.data().proposerAmount<=70 ){
            seven+=1;
          }
          else if (ResponderGameDoc.data().proposerAmount<=80 ){
            eight+=1;
          }
          else if (ResponderGameDoc.data().proposerAmount<=90 ){
            nine+=1;
          }
          else{
            ten+=1;
          }
          // var nextroundfirebaseid = ResponderGameDoc.data().proposerUUID + changeparse + ResponderGameDoc.data().responderUUID + changeparse;
        })
this.lines = new Chart(this.lineChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80','81-90','91-100'],
        datasets: [{
          label: 'Amount accepted by Responders',
          data:  [one,two,three,four,five,six,seven,eight,nine,ten],
          backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
})
  }
  else{
    this.afs.collection<any>('Game').ref
    .where('gameId', '==', this.chosengamecode)
    // .where('round', '==', changeparse)
    .where('responderResponse', '==', "Accept")
    .get()
    .then(res=>{
      if (res.docs.length != 0){ 
        let one=0;
        let two=0;
        let three=0;
        let four=0;
        let five=0;
        let six=0;
        let seven=0;
        let eight=0;
        let nine=0;
        let ten=0;

        res.forEach(ResponderGameDoc=>{
           if (ResponderGameDoc.data().proposerAmount<=10 ){
              one+=1;
           }
           else if (ResponderGameDoc.data().proposerAmount<=20 ){
            two+=1;
          }
          else if (ResponderGameDoc.data().proposerAmount<=30 ){
            three+=1;
          }
          else if (ResponderGameDoc.data().proposerAmount<=40 ){
            four+=1;
          }
          else if (ResponderGameDoc.data().proposerAmount<=50 ){
            five+=1;
          }
          else if (ResponderGameDoc.data().proposerAmount<=60 ){
            six+=1;
          }
          else if (ResponderGameDoc.data().proposerAmount<=70 ){
            seven+=1;
          }
          else if (ResponderGameDoc.data().proposerAmount<=80 ){
            eight+=1;
          }
          else if (ResponderGameDoc.data().proposerAmount<=90 ){
            nine+=1;
          }
          else{
            ten+=1;
          }
          // var nextroundfirebaseid = ResponderGameDoc.data().proposerUUID + changeparse + ResponderGameDoc.data().responderUUID + changeparse;
        })
this.lines = new Chart(this.lineChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80','81-90','91-100'],
        datasets: [{
          label: 'Amount accepted by Responders',
          data:  [one,two,three,four,five,six,seven,eight,nine,ten],
          backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
})
  }
}

  createHrzBarChart() {
    this.doublebars = new Chart(this.hrzBars.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
        datasets: [{
          label: 'Online viewers in millions',
          data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17],
          backgroundColor: '#ddee44', // array should have same number of elements as number of dataset
          borderColor: '#ddee44',// array should have same number of elements as number of dataset
          borderWidth: 1
        },
        {
          label: 'Offline viewers in millions',
          data: [1.5, 2.8, 4, 4.9, 3.9, 4.5, 7, 12],
          backgroundColor: '#dd1144', // array should have same number of elements as number of dataset
          borderColor: '#dd1144',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
    });
  }

  doubleLineChart(){
    this.doublelines = new Chart(this.doubleline.nativeElement, {
          type: 'line',
          data: {
            labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
            datasets: [{
              label: 'Viewers in millions',
              data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17],
              backgroundColor: 'rgb(0,0,0,0)', // array should have same number of elements as number of dataset
              borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
              borderWidth: 1
            },{
              label: 'Viewers in millions',
              data: [8,9,10,15,18,20,25,30],
              backgroundColor: 'rgb(0,0,0,0)', // array should have same number of elements as number of dataset
              borderColor: 'red',// array should have same number of elements as number of dataset
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
      }

      gamecodes(selectedValue:any){
        this.chosengamecode=selectedValue;
        this.createBarChart();
        this.createLineChart();
        this.createHrzBarChart();
        this.doubleLineChart();
      
      }
  
}
