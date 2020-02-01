import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ProposerPage } from '../pages/proposer/proposer';
import { RespondantPage } from '../pages/respondant/respondant';
import { UltimatumPage } from '../pages/ultimatum/ultimatum';
import { ScoreboardPage } from '../pages/scoreboard/scoreboard';
import { ProfessorHomePage } from '../pages/professor-home/professor-home';
import { UserPresenceStatusProvider } from '../providers/user-presence-status/user-presence-status';
import { PastscoreboardPage } from '../pages/pastscoreboard/pastscoreboard';
import { ResetPage } from '../pages/reset/reset';
import { ViewpastornewPage } from '../pages/viewpastornew/viewpastornew';
import { AnalyticsPage } from '../pages/analytics/analytics';
// import { Network } from '@ionic-native/network';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/interval';
import { Observable, Subject } from 'rxjs';
import { ToastController } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  pingStream: Subject<number> = new Subject<number>();
  ping: number = 0;
  url: string = "https://cors-test.appspot.com/test";
  @ViewChild(Nav) navCtrl: Nav;
    rootPage:any = UltimatumPage;
    public onlineOffline: boolean = navigator.onLine
  constructor(public presence:UserPresenceStatusProvider, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private _http: HttpClient,private toastCtrl: ToastController) {
    platform.ready().then(() => {
      Observable.interval(5000)
      .subscribe((data) => {
        // console.log(data)
        let timeStart: number = performance.now();

        this._http.get(this.url)
          .subscribe((data) => {
            // console.log(data)
            let timeEnd: number = performance.now();

            let ping: number = timeEnd - timeStart;
            this.ping = ping/10;
            // console.log(this.ping);
            if (this.ping>60){
            this.presentToast();
            }
            this.pingStream.next(ping);
            
          });
      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      if (!navigator.onLine) {
      alert("Offline");
        }
        window.addEventListener('offline', () => {
         this.presentofflineToast();
          });
        window.addEventListener('online', () => {
          this.presentOnlineToast();
        });
    });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Connection is slow',
      duration: 5000,
      position: 'bottom',
      showCloseButton:true
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  presentofflineToast() {
    let toast = this.toastCtrl.create({
      message: 'You are offline!',
      duration: 5000,
      position: 'bottom',
      showCloseButton:true
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  presentOnlineToast() {
    let toast = this.toastCtrl.create({
      message: 'You are online!!',
      duration: 5000,
      position: 'bottom',
      showCloseButton:true
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }
  
  goToUltimatum(params){
    if (!params) params = {};
    this.navCtrl.setRoot(UltimatumPage);
  }newgame(params){
    if (!params) params = {};
    this.navCtrl.setRoot(ProfessorHomePage);
  }goHome(params){
    if (!params) params = {};
    this.navCtrl.setRoot(ViewpastornewPage);
}pastscore(params){
  if (!params) params = {};
  this.navCtrl.setRoot(PastscoreboardPage);
}reset(params){
  if (!params) params = {};
  this.navCtrl.setRoot(ResetPage);
}analytics(params){
  if (!params) params = {};
  this.navCtrl.setRoot(AnalyticsPage);
}
}
