import { Component } from '@angular/core';

import { Events, NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public _events: Events) {

  }

  click() {
    this._events.publish('clicked:notification');
  }

}
