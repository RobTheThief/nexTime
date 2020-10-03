var bTDevicesCache = "";
var bTDevicesArray = [];
var counter = 0;

const scanBT = (blueToothManager) => {
  blueToothManager.startDeviceScan(null, null, (error, device) => {
    const bTDevicesObject = {
      id: device.id,
      name: device.name,
      localName: device.localName,
      rssi: device.rssi,
    };
    if (error) {
      // Handle error (scanning will be stopped automatically)
      console.log(error);
      return;
    }

    if (!bTDevicesCache.includes(device.id)) {
      bTDevicesArray.push(bTDevicesObject);
      console.log(bTDevicesArray);
      bTDevicesCache = `${bTDevicesCache} ${device.id}`;
    }

    counter++;
    if (counter === 50) {
      bTDevicesCache = "";
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
