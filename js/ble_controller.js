class BleController extends EventTarget {

  static CONTROLLER_SERVICE = 'ecceef7c-2d85-4b1a-889b-5dd536de1d38';
  static TOUCH_CHARACTERISTIC = 'ce8ec8f3-b582-4928-9db0-f6626f8b87c9';

  constructor() {
    super();
    this.utf8decoder = new TextDecoder(); // default 'utf-8' or 'utf8'
  }

  connect() {
    log("Connecting to controller ...");
    return new Promise((resolve, reject) => { navigator.bluetooth.requestDevice({
        filters: [
          {services: [
              // All accessible services need to be added
              BleController.CONTROLLER_SERVICE
            ]
          }
        ]
      })
      .then(dev => {
        this.device = dev;
        log('Connecting to GATT Server ...');
        return this.device.gatt.connect();
      })
      .then(server => {
        log('Connected to GATT server');
        this.subscribe_to_touch_characteristic();
        resolve(null)
      }).catch((error) => {
        log(error)
        reject("Failed to connect to BLE controller")
      })
    });
  }

  ///////////////// internal methods //////////////////////
  subscribe_to_touch_characteristic() {
    if (this.device) {
      log('Getting Controller Service ...');
      this.device.gatt.getPrimaryService(BleController.CONTROLLER_SERVICE)
      .then(service => {
        log('Getting Touch Characteristic ...');
        return service.getCharacteristic(BleController.TOUCH_CHARACTERISTIC);
      })
      .then(characteristic => {
        return characteristic.startNotifications().then(_ => {
          log('Subscribed to Touch notifications');
          characteristic.addEventListener('characteristicvaluechanged', (e) => this.handleTouchEvent(e));
        });
      })
      .catch(error => {
        log('ERROR ' + error);
      });
    }
  }

  handleTouchEvent(event) {
    console.log("Handling touch");
    let touchEvent = new Event('touch');
    touchEvent.touchedKey = this.utf8decoder.decode(event.target.value);
    this.dispatchEvent(touchEvent);
  }
}