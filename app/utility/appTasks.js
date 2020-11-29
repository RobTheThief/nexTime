import BluetoothSerial from "react-native-bluetooth-serial";
import * as Location from "expo-location";
import WifiManager from "react-native-wifi-reborn";

import geoFencing from './geoFencing';
import { sendNotificationImmediately } from "./notifications";
import storage from "./storage";
import helpers from "./helpers";

var warned = false;
var tasksRunning = 0;

const areTasksRunning = () => {
  if (tasksRunning <= 0)
    return false;
    else
    return true;
};

const serviceStatus = (checkInOut) => {
  tasksRunning = tasksRunning + checkInOut;
  return tasksRunning;
};
  
const checkLocationTask = () => {
  return new Promise( async resolve => {

   await Location.startLocationUpdatesAsync('checkLocation', { 
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 30000,
      distanceInterval: 1,
      foregroundService: {
          notificationTitle: 'nexTime Service running...',
          notificationBody: 'To stop the service open the app and go to Settings.'
      }
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
  !running && checkLocationTask();
}

const startCheckLocation = async (locations, taskAsyncMarkers) => {
  tasksRunning = serviceStatus(1);
  const { status } = await Location.requestPermissionsAsync();
  if (status === "granted") {
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
  }
  tasksRunning = serviceStatus(-1);
};

const startCheckBluetoothAsync = async ( taskAsyncBTDevices, startBluetooth ) => {
  tasksRunning = serviceStatus(1);
  
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
  tasksRunning = serviceStatus(-1);
};

var wifiWarned = false;
const startCheckWifi = async (taskAsyncWifiNetworks) => {
  tasksRunning = serviceStatus(1);

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
      sendNotificationImmediately("nexTime Reminders", `Bluetooth reminder: ${wifiReminder.name}`);
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
  tasksRunning = serviceStatus(-1);
};

export default {
  areTasksRunning,
  checkLocationTask,
  isServiceRunning,
  startCheckLocation,
  startCheckBluetoothAsync,
  startCheckWifi,
};
