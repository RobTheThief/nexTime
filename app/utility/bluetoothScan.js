import BluetoothSerial from "react-native-bluetooth-serial-next";
import storage from "./storage";

var bTDevicesCache = [];
var bTDevicesArray = [];
var counter = 0;
var firstRun = 0;
var serialListUnpaired = [];
var stopScan = [];

const scanBT = (bluetoothManager) => {
  bluetoothManager.startDeviceScan(null, null, async (error, device) => {
    if (error) {
      if(error.toString() === 'BleError: BluetoothLE is powered off'){
        alert('Bluetooth must be turned on to scan for devices.');
        return;
      }else{
        alert(error.toString());
        return;
      }
    }

    const bTDevicesObject = {
      id: device.id,
      name: device.name,
      localName: device.localName,
      rssi: device.rssi,
    };
    bTDevicesCache.push(bTDevicesObject);

    counter++;
    firstRun < 3 && firstRun++;
    if (counter > 20|| firstRun === 2) {
      bTDevicesArray.splice(0, bTDevicesArray.length);

      console.log('btScan running!!!', stopScan)

      filterUniqueIDs(); // pushes to bTDevicesArray

      bTDevicesArray.sort(namesFirst);

      bTDevicesCache = [];
      counter = 0; 
    }

    if (stopScan[0] === "STOP THE SCAN") {
      const btReminders = await storage.get("asyncBLEDevices");
      const taskAsyncBTDevices = await storage.get("asyncSerialBTDevices");
      var bleRemind = true;
      var serialRemind = true;
      if (btReminders !== null) {
        bleRemind = btReminders.every((reminder) => reminder.taskDeleted === true);
      }
      if (taskAsyncBTDevices !== null) {
        serialRemind = taskAsyncBTDevices.every((reminder) => reminder.taskDeleted === true);
      }
      
      if ( bleRemind && serialRemind) {
        console.log('Stop Scan');
        bluetoothManager.stopDeviceScan();
      }
      stopScan.splice(0, stopScan.length);
    }
  });
};

const subscribeBTScan = (blueToothManager) => {
  const subscription = blueToothManager.onStateChange((state) => {
    if (state === "PoweredOn") {
      scanBT(blueToothManager);
      subscription.remove();
    }else{
      alert('Bluetooth must be turned on to scan for devices.');
    }
  }, true);
};

const filterUniqueIDs = () => {
  var bTDeviceIDs = [];
  bTDevicesCache.forEach((item) => bTDeviceIDs.push(item.id));
  var uniqueIDs = bTDeviceIDs.filter(function (item, pos, self) {
    return self.indexOf(item) == pos;
  });

  for (let i = 0; i < uniqueIDs.length; i++) {
    for (let j = 0; j < bTDevicesCache.length; j++) {
      if (uniqueIDs[i] === bTDevicesCache[j].id) {
        bTDevicesArray.push(bTDevicesCache[j]);
        j = bTDevicesCache.length + 1;
      }
    }
  }
}

function addSerialListToCache(item) {
  bTDevicesCache.push(item);
}

const namesFirst = (a, b) => {
  if (a.name !== null && b.name === null) {
    return -1;
  }
  if (a.name === null && b.name !== null) {
    return 1;
  }
  return 0;
};

const getSerialListUnpairedAsync = async () => {
  serialListUnpaired = await BluetoothSerial.listUnpaired();
  serialListUnpaired.forEach(addSerialListToCache);
}

export default {
  getSerialListUnpairedAsync,
  subscribeBTScan,
  bTDevicesArray,
  serialListUnpaired,
  stopScan,
};
