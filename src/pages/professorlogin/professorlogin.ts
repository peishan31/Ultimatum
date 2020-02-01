import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UltimatumPage } from '../ultimatum/ultimatum';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProfessorHomePage } from '../professor-home/professor-home';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as Crypto from "crypto-browserify";
import { ViewpastornewPage } from '../viewpastornew/viewpastornew';
import { Injectable } from '@angular/core';
import { AuthenticationAuthenticationProvider } from '../../providers/authentication-authentication/authentication-authentication';
 /*
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-professorlogin',
  templateUrl: 'professorlogin.html',
})
export class ProfessorloginPage {
  Username = '';
  UserPassword = '';
  submitted:any;
  itemDoc:any;
  item:any;
  validations_form: FormGroup;
  errorMessage = '';
  subscription:any;
  constructor(public navCtrl: NavController,
    public afs: AngularFirestore,
    private _FB: FormBuilder,
    public navParams: NavParams,
    public auth: AuthenticationAuthenticationProvider
    ) {
      this.validations_form = this._FB.group({
        'email'        : ['', Validators.required],
        'password'     : ['', Validators.required]
     });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfessorloginPage');
  }

  Next() {

    // retrieve salt value from database
    // Hash user's password and salt value = hashed password
    // compare the hashed password from db
    this.itemDoc = this.afs.collection<any>('ProfessorAccount');
    this.item = this.itemDoc.valueChanges();

    this.subscription = this.item.subscribe(res=>{
      console.log(res);
      for (let p=0;p<res.length;p++){
        if (res[p]==undefined || res[p]==null){
          console.log("BYE");
        }
        else{
          // there should be only currenty one account, hence 1 passwordHash & passwordSalt
          let userpwd=this.validations_form.get('password').value;
          var userAttemptPasswordHash = this.hashing(userpwd + res[p].PasswordSalt);

          if (userAttemptPasswordHash == res[p].PasswordHash && this.Username == res[p].Username) {
            console.log("User has entered the correct password!");
            this.auth.login();
            this.navCtrl.setRoot(ViewpastornewPage);
          }
          else {
            this.errorMessage = "Wrong password or username";
            console.log("User has entered the wrong password or username!");
          }
        }

      }

    })
  }

  canActivate(): boolean {
    return this.auth.isAuthenticated();
  }

  back(){
    this.navCtrl.setRoot(UltimatumPage);
  }

  hashing = function(length){
    return Crypto.createHash('sha256').update(length).digest('base64');
  };

  ngOnDestroy(){

    if (this.subscription) this.subscription.unsubscribe();
  }
}
