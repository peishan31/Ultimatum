import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { UltimatumPage } from '../pages/ultimatum/ultimatum';
import { ProposerPage } from '../pages/proposer/proposer';
import { RespondantPage } from '../pages/respondant/respondant';
import { ProfessorHomePage } from '../pages/professor-home/professor-home';
import { ScoreboardPage } from '../pages/scoreboard/scoreboard';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {GamecodePage} from '../pages/gamecode/gamecode';
import {ProfessorloginPage} from '../pages/professorlogin/professorlogin';
import {ResultPage} from '../pages/result/result';
import {LoadingPage} from '../pages/loading/loading';
//firebase
//import { AngularFirestore } from '@angular/fire/firestore'
import * as firebase from 'firebase';
import {firebaseConfig} from '../environments/environment';
import { AngularFirestore, AngularFirestoreModule,FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
firebase.initializeApp(firebaseConfig);

import { Network } from '@ionic-native/network';
import { FormsModule } from '@angular/forms';

import {CountDown} from "ng4-date-countdown-timer";
import { PresenceProvider } from '../providers/presence/presence';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

@NgModule({
  declarations: [
    MyApp,
    UltimatumPage,
    ProposerPage,
    RespondantPage,
    ProfessorHomePage,
    ScoreboardPage,
    GamecodePage,
    ProfessorloginPage,
    CountDown,
    ResultPage,
    LoadingPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    AngularFirestoreModule,
    AngularFireModule,
    AngularFireModule.initializeApp(firebaseConfig, 'Ultimatum')
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    UltimatumPage,
    ProposerPage,
    RespondantPage,
    ProfessorHomePage,
    ScoreboardPage,
    GamecodePage,
    ProfessorloginPage,
    ResultPage,
    LoadingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFirestore,
    { provide: FirestoreSettingsToken, useValue: {} },
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PresenceProvider,
    AngularFireAuth,
    AngularFireDatabase,
    Network
  ]
})
export class AppModule {}
