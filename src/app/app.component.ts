import { Component, ViewChild } from '@angular/core';
import { Events, Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';

import { PushService } from '../providers/push-service/push-service';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = HomePage;

  constructor(events: Events, platform: Platform, pushService: PushService) {
    pushService.init();
    pushService.startWatch();

    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    events.subscribe('clicked:notification', () => {
      this.nav.push(TabsPage);
    });
  }
}
