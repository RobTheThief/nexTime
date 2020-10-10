import { sendNotificationImmediately } from "./notifications";
import storage from "./storage";
import BluetoothSerial from "react-native-bluetooth-serial-next";

var bTDevicesCache = [];
var bTDevicesArray = [];
var counter = 0;
var firstRun = 0;
var serialListUnpaired = [];

/* **************************************************
GIVES ERROR - EXCESSIVE NUMBER OF PENDING CALLBACKS listUnpaired()
Please remove loop of insanity.
 *************************************************** */

const scanBT = (bluetoothManager) => {
  bluetoothManager.startDeviceScan(null, null, async (error, device) => {
    if (error) {
      alert(error.toString());
      return;
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
    if (counter > 7 || firstRun === 2) {
      bTDevicesArray.splice(0, bTDevicesArray.length);

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

      bTDevicesArray.sort(namesFirst);

      var btReminders = await storage.get("asyncBTDevices");
      if (btReminders !== null) {
        for (let i = 0; i < btReminders.length; i++) {
          for (let j = 0; j < bTDevicesArray.length; j++) {
            if (btReminders[i].id.includes(bTDevicesArray[j].id)) {
              sendNotificationImmediately(
                bTDevicesArray[j].name
                  ? bTDevicesArray[j].name
                  : bTDevicesArray[j].localName
                  ? bTDevicesArray[j].localName
                  : bTDevicesArray[j].id + " Has been found!"
              );
              btReminders.splice(i, 1);
              await storage.store("asyncBTDevices", btReminders);
              j = 100;
              i = 100;
            }
          }
        }
      }
      bTDevicesCache = [];
      counter = 0;

      serialListUnpaired.forEach(addSerialList);
    }

    // Check if it is a device you are looking for based on advertisement data
    // or other criteria.
    if (device.name === "TI BLE Sensor Tag" || device.name === "SensorTag") {
      // Stop scanning as it's not necessary if you are scanning for one device.
      bluetoothManager.stopDeviceScan();
    }
  });
};

const subscribeBTScan = (blueToothManager) => {
  const subscription = blueToothManager.onStateChange((state) => {
    if (state === "PoweredOn") {
      scanBT(blueToothManager);
      subscription.remove();
    }
  }, true);
};

function addSerialList(item) {
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
}

export default {
  getSerialListUnpairedAsync,
  subscribeBTScan,
  bTDevicesArray,
  serialListUnpaired,
};
