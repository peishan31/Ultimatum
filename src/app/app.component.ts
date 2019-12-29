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


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
    rootPage:any = UltimatumPage;

  constructor(public presence:UserPresenceStatusProvider, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  goToUltimatum(params){
    if (!params) params = {};
    this.navCtrl.setRoot(UltimatumPage);
  }goToProposer(params){
    if (!params) params = {};
    this.navCtrl.setRoot(ProposerPage);
  }goToRespondant(params){
    if (!params) params = {};
    this.navCtrl.setRoot(RespondantPage);
  }
}
