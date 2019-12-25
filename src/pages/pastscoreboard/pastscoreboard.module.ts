import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PastscoreboardPage } from './pastscoreboard';

@NgModule({
  declarations: [
    PastscoreboardPage,
  ],
  imports: [
    IonicPageModule.forChild(PastscoreboardPage),
  ],
})
export class PastscoreboardPageModule {}
