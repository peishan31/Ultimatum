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

//firebase
//import { AngularFirestore } from '@angular/fire/firestore'
import * as firebase from 'firebase';
import {firebaseConfig} from '../environments/environment';
import { AngularFirestore, AngularFirestoreModule,FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    UltimatumPage,
    ProposerPage,
    RespondantPage,
    ProfessorHomePage,
    ScoreboardPage
  ],
  imports: [
    BrowserModule,
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
    ScoreboardPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFirestore,
    { provide: FirestoreSettingsToken, useValue: {} },
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
