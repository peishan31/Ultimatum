import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import * as Crypto from "crypto-browserify";

const TOKEN_KEY = 'auth-token';
const TOKEN_KEY_DATE_TIME = 'auth-token-datetime';

/*
  Generated class for the AuthenticationAuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationAuthenticationProvider {

  authenticationState = new BehaviorSubject(false);
  token = "";
  constructor(
    public http: HttpClient,
    private storage: Storage,
    private plt: Platform
  ) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
    console.log('Hello AuthenticationAuthenticationProvider Provider');
  }

  checkToken() { // Once the user has logged in with valid credentials, 2 sessions and cookies will be created

    this.storage.get("userLoggedIn").then(resLoggedIn => {

      if (resLoggedIn) {

        this.storage.get(TOKEN_KEY).then(res => {

          if (res) {

            //alert("Session: " + res);
            this.storage.get(TOKEN_KEY_DATE_TIME).then(ress => {

              var tokenDateTime = Date.parse(ress);
              var currentDateTime = Date.parse(new Date().toISOString());
              var difference = currentDateTime - tokenDateTime; // based on milliseconds
              //alert("Difference: " + difference);
              if (difference < 86400000) // 1 day = 60000 86,400,000
              {

                var x = this.getCookie(TOKEN_KEY);
                if (x == res) {
                  this.authenticationState.next(true);
                }
                else {
                  this.authenticationState.next(false);
                }
              }
              else // expired
              {
                return this.storage.remove(TOKEN_KEY).then(() => {
                  this.storage.remove(TOKEN_KEY_DATE_TIME).then(() => {
                    this.authenticationState.next(false);
                  })
                });
              }
            })
          }
        })
      }
    })
  }

  login(username) {

    this.token = this.uuidv4();

    return this.storage.set("userLoggedIn", username).then(() => {

      this.storage.set(TOKEN_KEY, this.token).then(() => { // set other token key // **** set expiry date

        this.storage.set(TOKEN_KEY_DATE_TIME, new Date().toISOString()).then(() => {

          this.setCookie(TOKEN_KEY, this.token, 1);

          this.authenticationState.next(true);
        });
      });
    })
  }

  logout() {

    return this.storage.remove("userLoggedIn").then(() => {

      this.storage.remove(TOKEN_KEY).then(() => {
        this.storage.remove(TOKEN_KEY_DATE_TIME).then(() => {
          this.eraseCookie(TOKEN_KEY);
          this.authenticationState.next(false);
        })
      });
    })
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  uuidv4() {

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  setCookie(name, value, days) {
    var d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toUTCString();
  }

  getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
  }

  eraseCookie(name) {
    this.setCookie(name, '', -1);
  }

}
