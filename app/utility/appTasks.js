import BluetoothSerial from "react-native-bluetooth-serial";
import * as Location from "expo-location";
import WifiManager from "react-native-wifi-reborn";

import geoFencing from './geoFencing';
import { sendNotificationImmediately } from "./notifications";
import storage from "./storage";
import helpers from "./helpers";
import nexTimeService from "../../nexTimeService";

var warned = false;
  
const checkLocationTask = () => {
  return new Promise( async resolve => {

   await Location.startLocationUpdatesAsync('checkLocation', { 
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 60000,
      distanceInterval: 1,
      showsBackgroundLocationIndicator: true,
    });
    resolve();
  });
}

const toKeep = (reminder) => {
  if (!reminder.delete){
    return true;
  }
  if(!reminder.taskDeleted){
    return true;
  }
  return false;
}

const isServiceRunning = async () => {
  const running = await Location.hasStartedLocationUpdatesAsync('checkLocation');
  if(!running){
    checkLocationTask();
    nexTimeService.startService();
  }
}

const startCheckLocation = (locations, taskAsyncMarkers) => {
  return new Promise( async resolve => {
      var cleanupTrigger = false;

      for (let index = 0; index < taskAsyncMarkers.length; index++) {
        const marker = taskAsyncMarkers[index];
        if (!marker.taskDeleted) {
          const adjustedDistance = geoFencing.getRelativeDistance(locations, marker);
          
          if (adjustedDistance <= marker.radius) {
            sendNotificationImmediately("nexTime Reminders", "nexTime Location Reminder: " + marker.title);
            cleanupTrigger = true;
            if (marker.repeat === false) {
              taskAsyncMarkers[index].taskDeleted = true;
              await storage.store("asyncMarkers", taskAsyncMarkers);
            }
          }
        }     
      }
      if(cleanupTrigger){
        taskAsyncMarkers = taskAsyncMarkers.filter((marker) => toKeep(marker));
        for (let i = 0; i < taskAsyncMarkers.length; i++) {
          taskAsyncMarkers[i].id = i + 1;
          taskAsyncMarkers[i].circleId = i + 1 + "c";
        }
        taskAsyncMarkers.length === 0 ? 
        await storage.store("asyncMarkers", []) :
        await storage.store("asyncMarkers", taskAsyncMarkers);
        var cleanupTrigger = false;
      }
    resolve();
  });
};

const startCheckBluetoothAsync = ( taskAsyncBTDevices, startBluetooth ) => {
  return new Promise( async resolve => {
    var cleanupTrigger = false;

    const wasEnabled = await BluetoothSerial.isEnabled();
    var options = await storage.get('options');
    startBluetooth = options.startBluetooth;
    
    var enable = false;
    enable = await helpers.enableBluetooth(wasEnabled, startBluetooth, BluetoothSerial);

    wasEnabled && (warned = false);
    if (!wasEnabled && !warned && !startBluetooth) {
      warned = true;
      return sendNotificationImmediately("nexTime Reminders", "Bluetooth must be on for your reminders to work");
    } else if (!wasEnabled && warned === true) {
      return;
    }
    
    const isEnabled = await helpers.waitForBtEnabled(BluetoothSerial);
    
    var serialListUnpaired = [];
    if (isEnabled){
      serialListUnpaired = await BluetoothSerial.discoverUnpairedDevices();
    }else{
      !wasEnabled && BluetoothSerial.disable();
      return;
    }
    
    var bTDeviceIDs = [];
    serialListUnpaired.forEach((item) => bTDeviceIDs.push(item.id));

    !wasEnabled && BluetoothSerial.disable();

    for (let index = 0; index < taskAsyncBTDevices.length; index++)  {
      const btReminder = taskAsyncBTDevices[index];
      var present = bTDeviceIDs.some((id) => btReminder.id == id);
      if (present && !btReminder.taskDeleted) {
        sendNotificationImmediately("nexTime Reminders", `Bluetooth reminder: ${btReminder.name}`);
        cleanupTrigger = true;
        if (!btReminder.repeat) {
          btReminder.taskDeleted = true;
          await storage.store("asyncSerialBTDevices", taskAsyncBTDevices);
        }
      }
    }
    if(cleanupTrigger) {
      taskAsyncBTDevices = taskAsyncBTDevices.filter((reminder) => toKeep(reminder));
      taskAsyncBTDevices.length === 0 ?
      await storage.store("asyncSerialBTDevices", '') :
      await storage.store("asyncSerialBTDevices", taskAsyncBTDevices);
      cleanupTrigger = false;
    }
    resolve();
  });
};

var wifiWarned = false;
const startCheckWifi = (taskAsyncWifiNetworks) => {
  return new Promise( async resolve => {
    var cleanupTrigger = false;

    const isEnabled = await WifiManager.isEnabled();
    isEnabled && (wifiWarned = false);

    if (!isEnabled && !wifiWarned) {
      wifiWarned = true;
      return sendNotificationImmediately("nexTime Reminders", "WIFI must be on for your WIFI reminders to work");
    } else if (!isEnabled && wifiWarned === true) {
      return;
    }

    var networkList = await WifiManager.loadWifiList();
    var BSSIDs = [];
    networkList.forEach((item) => BSSIDs.push(item.BSSID));

    for (let index = 0; index < taskAsyncWifiNetworks.length; index++)  {
      const wifiReminder = taskAsyncWifiNetworks[index];
      var present = BSSIDs.some((id) => wifiReminder.id == id);
      if (present && !wifiReminder.taskDeleted) {
        sendNotificationImmediately("nexTime Reminders", `WIFI reminder: ${wifiReminder.name}`);
        cleanupTrigger = true;
        if (!wifiReminder.repeat) {
          wifiReminder.taskDeleted = true;
          await storage.store("asyncWifiReminders", taskAsyncWifiNetworks);
        }
      }
    }
    if(cleanupTrigger) {
      taskAsyncWifiNetworks = taskAsyncWifiNetworks.filter((reminder) => toKeep(reminder));
      taskAsyncWifiNetworks.length === 0 ?
      await storage.store("asyncWifiReminders", '') :
      await storage.store("asyncWifiReminders", taskAsyncWifiNetworks);
      cleanupTrigger = false;
    }
    resolve();
  });
};

export default {
  checkLocationTask,
  isServiceRunning,
  startCheckLocation,
  startCheckBluetoothAsync,
  startCheckWifi,
};
