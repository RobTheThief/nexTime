import { Alert } from 'react-native';

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
    ConnectivityDisabledMessage,
    enableBluetooth,
    waitForBtEnabled,
  }



  