import { Component } from '@angular/core';

/**
 * Generated class for the UserStatusComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'user-status',
  templateUrl: 'user-status.html'
})
export class UserStatusComponent {

  text: string;

  constructor() {
    console.log('Hello UserStatusComponent Component');
    this.text = 'Hello World';
  }

}
