import { sendNotificationImmediately } from "./notifications";
import storage from "./storage";

var bTDevicesCache = "";
var bTDevicesArray = [];
var counter = 0;

const scanBT = (blueToothManager) => {
  blueToothManager.startDeviceScan(null, null, async (error, device) => {
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

    if (!bTDevicesCache.includes(device.id)) {
      bTDevicesArray.push(bTDevicesObject);
      bTDevicesCache = `${bTDevicesCache} ${device.id}`;
    }

    counter++;
    if (counter === 50) {
      var btReminders = await storage.get("asyncBTDevices");
      if (btReminders) {
        for (let i = 0; i < btReminders.length; i++) {
          for (let j = 0; j < bTDevicesArray.length; j++) {
            if (btReminders[i].includes(bTDevicesArray[j].id)) {
              sendNotificationImmediately(btReminders[i] + " Has been found!");
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
    }

    // Check if it is a device you are looking for based on advertisement data
    // or other criteria.
    if (device.name === "TI BLE Sensor Tag" || device.name === "SensorTag") {
      // Stop scanning as it's not necessary if you are scanning for one device.
      blueToothManager.stopDeviceScan();
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
