import BluetoothSerial from "react-native-bluetooth-serial";
import * as Location from "expo-location";

import geoFencing from './geoFencing';
import { sendNotificationImmediately } from "./notifications";
import storage from "./storage";

var warned = false;
  
const checkLocationTask = () => {
  Location.startLocationUpdatesAsync('checkLocation', { 
    accuracy: Location.Accuracy.BestForNavigation,
    timeInterval: 30000,
    distanceInterval: 1,
    foregroundService: {
        notificationTitle: 'nexTime',
        notificationBody: 'nexTime Reminders running'
    }
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

const areTasksRunning = async () => {
  const running = await Location.hasStartedLocationUpdatesAsync('checkLocation');
  !running && checkLocationTask();
}

const startCheckLocation = async (locations, taskAsyncMarkers) => {
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
      await storage.store("asyncMarkers", '') :
      await storage.store("asyncMarkers", taskAsyncMarkers);
      var cleanupTrigger = false;
    }
  }
};

const startCheckBluetoothAsync = async ( taskAsyncBTDevices, startBluetooth ) => {
  var cleanupTrigger = false;

  const wasEnabled = await BluetoothSerial.isEnabled();
  var startBluetooth = await storage.get('startBluetooth');
  startBluetooth = startBluetooth.startBluetooth;
  
  let enable = false;
  if (wasEnabled === false && startBluetooth == true) {enable = await BluetoothSerial.enable();}
  let timer = Date.now() + 1500;
  if (enable === true || wasEnabled === true){
    while (Date.now() < timer){
      let life = 'go by..'; 
    };
  }

  wasEnabled && (warned = false);
  if (!wasEnabled && !warned && !startBluetooth) {
    warned = true;
    return sendNotificationImmediately("nexTime Reminders", "Bluetooth must be on for your reminders to work");
  } else if (!wasEnabled && warned === true) {
    return;
  }

  var serialListUnpaired = await BluetoothSerial.discoverUnpairedDevices();
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
};

export default {
  areTasksRunning,
  checkLocationTask,
  startCheckLocation,
  startCheckBluetoothAsync,
};
