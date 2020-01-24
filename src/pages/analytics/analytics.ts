import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
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
  

  

  bars: any;
  colorArray: any;

  lines:any;
  colorArrayLine:any;

  doublebars:any;
  doublelines:any;

  constructor() { }

  ionViewDidEnter() {
    this.createBarChart();
    this.createLineChart();
    this.createHrzBarChart();
    this.doubleLineChart();
  }

  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
        datasets: [{
          label: 'Viewers in millions',
          data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17],
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

  createLineChart(){
this.lines = new Chart(this.lineChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
        datasets: [{
          label: 'Viewers in millions',
          data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17],
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
}
