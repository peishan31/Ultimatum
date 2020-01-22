import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { UltimatumPage } from '../pages/ultimatum/ultimatum';
import {ProposerPage} from '../pages/proposer/proposer';
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
import { AngularFireAuth,AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';


import {PastscoreboardPage} from '../pages/pastscoreboard/pastscoreboard';
import {ViewpastornewPage} from '../pages/viewpastornew/viewpastornew';
import {NextroundsPage} from '../pages/nextrounds/nextrounds';
import { UserPresenceStatusProvider } from '../providers/user-presence-status/user-presence-status';

import { HttpClient,HttpClientModule } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage';
import { ResetPage } from '../pages/reset/reset';

const config= {}

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
    LoadingPage,
    PastscoreboardPage,
    ViewpastornewPage,
    NextroundsPage,
    ResetPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    AngularFirestoreModule,
    AngularFireModule,
    AngularFireModule.initializeApp(firebaseConfig, 'Ultimatum'),
    AngularFireAuthModule,
    IonicStorageModule.forRoot()
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
    LoadingPage,
    PastscoreboardPage,
    ViewpastornewPage,
    NextroundsPage,
    ResetPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFirestore,
    { provide: FirestoreSettingsToken, useValue: {} },
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserPresenceStatusProvider,
    AngularFireAuth,
    AngularFireDatabase,
    Network,
    UserPresenceStatusProvider,
    HttpClient,

  ]
})
export class AppModule {}
