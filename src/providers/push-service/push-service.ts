import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { Push } from 'ionic-native';

@Injectable()
export class PushService {
  public _registrationId: string;
  public _push: any;

  constructor(
    public _platform: Platform,
    public _events: Events
  ) {}

  init() {
    this._platform.ready().then(() => {
      this._push = Push.init({
        android: {
          senderID: '259235386740',
          icon: 'ic_stat_brlive',
          iconColor: '#4bbf6b',
          sound: 'default',
          forceShow: true
        },
        ios: {
          clearBadge: true
        }
      });

      this._push.on('registration', data => {
        this._registrationId = data.registrationId;
        console.log(data);
      });
    });
  }

  registrationData(): Object {
    let data;

    if (this._platform.is('ios'))
      data = { apns_id: this._registrationId };
    else
      data = { fcm_id: this._registrationId };

    return data;
  }

  startWatch() {
    setTimeout(() => {
      this._events.publish('clicked:notification');
    }, 5000);
    this._platform.ready().then(() => {
      // this._push.on('notification', this._handleNotification.bind(this));
      this._push.on('notification', () => {
        this._events.publish('clicked:notification');
      });

      this._push.on('notificationShowVersionsCallback', data => {
        this._events.publish('clicked:notification:show-versions', data.additionalData);
      });

      this._push.on('notificationShowEnrollmentCallback', data => {
        this._events.publish('clicked:notification:show-enrollment', data.additionalData);
      });

      this._push.on('notificationShowResultCallback', data => {
        this._events.publish('clicked:notification:show-result', data.additionalData);
      });
    });
  }

  stopWatch() {
    this._platform.ready().then(() => {
      this._push.off('notification', this._handleNotification);
    });
  }

  public _handleNotification(data) {
    let notificationWasClicked = !data.additionalData.foreground && !data.additionalData.coldstart;

    console.log('notf');
    if (notificationWasClicked) {
      this._events.publish('refresh:content');
      console.log('clicked');

      switch(data.additionalData.kind) {
        case 'transfer_request_accepted':
          this._events.publish('clicked:notification:transfer-request-accepted', data.additionalData);
          break;
        default:
          console.log('clicked:notf');
          this._events.publish('clicked:notification', data.additionalData);
          break;
      }
    } else {
      switch(data.additionalData.kind) {
        case 'change_request_accepted':
        case 'change_request_rejected':
          this._notifyChangeRequestResponded(data);
          break;
        case 'transfer_request_accepted':
          this._events.publish('accepted:transfer-request', data.additionalData);
          break;
      }
    }
  }

  public _notifyChangeRequestResponded(data) {
    this._events.publish('refresh:user');

    if (data.additionalData.foreground)
      this._events.publish('changed:enrollment');
    else
      this._events.publish('refresh:enrollment');
  }
}

