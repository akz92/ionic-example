import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { Push } from 'ionic-native';

@Injectable()
export class PushService {
  public _push: any;
  public _handleNotification: Function;

  constructor(
    public _platform: Platform,
    public _events: Events
  ) {
    this._handleNotification = (data) => {
      this._events.publish('clicked:notification', data.additionalData);
    };
  }

  init() {
    this._platform.ready().then(() => {
      this._push = Push.init({
        android: {
          senderID: '',
          forceShow: true
        },
        ios: {
          clearBadge: true
        }
      });
    });
  }

  startWatch() {
    this._platform.ready().then(() => {
      this._push.on('notification', this._handleNotification.bind(this));
    });
  }

  stopWatch() {
    this._platform.ready().then(() => {
      this._push.off('notification', this._handleNotification);
    });
  }

}

