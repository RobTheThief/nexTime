var bTDevices = "";
var counter = 0;

const scanBT = (blueToothManager) => {
  blueToothManager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      // Handle error (scanning will be stopped automatically)
      console.log(error);
      return;
    }

    if (!bTDevices.includes(device.id)) {
      console.log(device.id, ":", device.name, device.localName, device.rssi);
      bTDevices = `${bTDevices} ${device.id}`;
    }

    counter++;
    if (counter === 50) {
      bTDevices = "";
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
};
