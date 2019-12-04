import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GamecodePage } from './gamecode';

@NgModule({
  declarations: [
    GamecodePage,
  ],
  imports: [
    IonicPageModule.forChild(GamecodePage),
  ],
})
export class GamecodePageModule {}
