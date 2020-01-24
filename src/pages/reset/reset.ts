import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as Crypto from "crypto-browserify";
//import { AES256 } from '@ionic-native/aes-256';
import { ViewpastornewPage } from '../viewpastornew/viewpastornew';

/**
 * Generated class for the ResetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset',
  templateUrl: 'reset.html',
})
export class ResetPage {

  itemDoc: any;
  validations_form: FormGroup;
  currentPasswordType: string = 'password';
  currentPasswordIcon: string = 'eye-off';
  private secureKey: string;
  private secureIV: string;
  newPasswordType: string = 'password';
  newPasswordIcon: string = 'eye-off';
  confirmPasswordType: string = 'password';
  confirmPasswordIcon: string = 'eye-off';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afs: AngularFirestore,
    private _FB: FormBuilder,) {

    this.validations_form = this._FB.group({
      'email'        : ['', Validators.required],
      'currentPassword'     : ['', Validators.required],
      'newPassword'     : ['', Validators.required],
      'confirmPassword'     : ['', Validators.required],
   });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPage');
    var userNewPasswordId = document.getElementById("userNewPasswordId");
    userNewPasswordId.style.display = "none";
  }

  changepassword() {
    /*
    - store hashing(pwd + passwordSalt)
    - store passwordSalt
    - Google search passwordSalt
    */
    this.itemDoc = this.afs.collection<any>('ProfessorAccount').ref
      .where('Username', '==', "Professor123");
      this.itemDoc.get().then(res=>{

        if (res.docs.length != 0) {

          res.forEach(ProfessorAccountDoc =>{

            let userCurrentPassword=this.validations_form.get('currentPassword').value;
            var userAttemptPasswordHash = this.hashing(userCurrentPassword + ProfessorAccountDoc.data().PasswordSalt);

            if (userAttemptPasswordHash == ProfessorAccountDoc.data().PasswordHash) { // correct password

              var userCurrentPasswordId = document.getElementById("userCurrentPasswordId");
              userCurrentPasswordId.style.display = "none";

              var userNewPasswordId = document.getElementById("userNewPasswordId");
              userNewPasswordId.style.display = "block";
              // 1. Allow user to enter a new password
              // 2. Check if new password and confirm password matches
              let userNewPassword=this.validations_form.get('newPassword').value;
              let userConfirmPassword=this.validations_form.get('confirmPassword').value;

              if (userNewPassword != null && userNewPassword != "") {
                if ((userNewPassword == userConfirmPassword) && (userNewPassword!=null) && (userNewPassword!="")) {

                  // Generate new salt;
                  const saltValue = Crypto.randomBytes(30).toString('hex');
                  // Hashing
                  var userAttemptNewPasswordHash = this.hashing(userNewPassword + saltValue);

                  // Storing in db
                  new Promise<any>((resolve, reject) => {
                    var id = "ProfessorAccount1"
                    this.afs.collection('ProfessorAccount').doc(id).set({
                      PasswordHash: userAttemptNewPasswordHash,
                      PasswordSalt: saltValue,
                      Username: "Professor123"
                    })
                    .then(
                      res => resolve(res),
                      err => reject(err)
                    );
                  })
                  alert("Password changed!");
                  this.navCtrl.setRoot(ViewpastornewPage);
                }
                else {
                  alert("Password do not match! Please try again!");
                }
              }
            }
            else {
              //this.errorMessage = "Wrong password or username";
              alert("Ooops, you have entered the wrong password! Please try again!");
            }
          })
        }
      })
  }

  hashing = function(length){
    return Crypto.createHash('sha256').update(length).digest('base64');
  };

  hideShowCurrentPassword() {

    this.currentPasswordType = this.currentPasswordType === 'text' ? 'password' : 'text';
    this.currentPasswordIcon = this.currentPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  hideShowNewPassword() {

    this.newPasswordType = this.newPasswordType === 'text' ? 'password' : 'text';
    this.newPasswordIcon = this.newPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  hideShowConfirmPassword() {

    this.confirmPasswordType = this.confirmPasswordType === 'text' ? 'password' : 'text';
    this.confirmPasswordIcon = this.confirmPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

}
