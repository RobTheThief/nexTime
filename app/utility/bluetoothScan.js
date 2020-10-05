import { sendNotificationImmediately } from "./notifications";
import storage from "./storage";
import BluetoothSerial from "react-native-bluetooth-serial-next";

var bTDevicesCache = "";
var bTDevicesArray = [];
var serialListUnpairedCount = 0;
var counter = 0;

function addSerialList(item) {
  if (!bTDevicesArray.includes(item.id.toString())) {
    bTDevicesArray.push(item);
  }
  console.log(item);
}

const asyncFunct = async () => {
  var serialListUnpaired = await BluetoothSerial.listUnpaired();
  serialListUnpaired.forEach(addSerialList);

  serialListUnpairedCount = 0;
  serialListUnpaired = [];
};

const scanBT = (bluetoothManager) => {
  bluetoothManager.startDeviceScan(null, null, async (error, device) => {
    const bTDevicesObject = {
      id: device.id,
      name: device.name,
      localName: device.localName,
      rssi: device.rssi,
    };
    if (error) {
      alert(error.toString());
      return;
    }

    if (
      !bTDevicesCache.includes(device.id) &&
      !bTDevicesArray.includes(device.id)
    ) {
      bTDevicesArray.push(bTDevicesObject);
      bTDevicesCache = `${bTDevicesCache} ${device.id}`;
    }

    if (serialListUnpairedCount === 0) {
      serialListUnpairedCount = 1;
      asyncFunct();
    }

    counter++;
    if (counter === 50) {
      var btReminders = await storage.get("asyncBTDevices");
      if (btReminders) {
        for (let i = 0; i < btReminders.length; i++) {
          for (let j = 0; j < bTDevicesArray.length; j++) {
            if (btReminders[i].includes(bTDevicesArray[j].id)) {
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
      bTDevicesCache = "";
      bTDevicesArray.splice(0, bTDevicesArray.length);
      counter = 0;
      console.log("cleared array!!!!");
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

export default {
  subscribeBTScan,
  bTDevicesArray,
};
