import { Alert } from 'react-native';
import storage from './storage';

const arraysEqual = (a, b) => {
    if (a == null || b == null) return 'nothing to compare';
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i].timeStamp != b[i].timeStamp) return false;
    }
    return true;
  }

class Interval {
  constructor(fn, time) {
    var timer = false;
    this.start = function () {
      if (!this.isRunning())
        timer = setInterval(fn, time);
    };
    this.stop = function () {
      clearInterval(timer);
      timer = false;
    };
    this.isRunning = function () {
      return timer !== false;
    };
  }
}

const loadReminderInterval = ( asyncIndex, lastAsyncReminder, setReminder, intervalClass) => {
  
  const myIntervalFunc = async () => {
    const asyncReminders = await storage.get(asyncIndex);
    const compareResult = arraysEqual(asyncReminders, lastAsyncReminder);
    if(!compareResult || (compareResult === 'nothing to compare' && lastAsyncReminder !== null)) {
      setReminder(asyncReminders);
    }
    lastAsyncReminder = asyncReminders;
  }

  if (intervalClass === undefined) {
    intervalClass = new Interval(myIntervalFunc, 3000);
  }

  if (intervalClass !== 'once is enough thanks' && intervalClass !== undefined) {
    if(!intervalClass.isRunning()){
      intervalClass.start();
    }
  }
  
}

const enableBluetooth = (wasEnabled, startBluetooth, BluetoothSerial) => {
    return new Promise( async resolve => {
    if (wasEnabled === false && startBluetooth == true) {
      resolve( await BluetoothSerial.enable() );
    }
    resolve(false);
  })
};

const waitForBtEnabled = (BluetoothSerial) => {
  return new Promise( async resolve => {
    let count = 0;
    while ( await BluetoothSerial.isEnabled() === false && count < 2000){
      count++;
    }
    if (count < 2000){
      resolve(true);
    }
    resolve(false);
  });
};

const ConnectivityDisabledMessage = (ConnectionManager, message) => {
  return new Promise( async resolve => {
    if (!await ConnectionManager.isEnabled()) {
      Alert.alert('nexTime', message);
      resolve(true);
    }
    resolve(false);
   })
};

  export default {
    arraysEqual,
    ConnectivityDisabledMessage,
    enableBluetooth,
    loadReminderInterval,
    waitForBtEnabled,
  }



  