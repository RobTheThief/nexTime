import * as BackgroundFetch from "expo-background-fetch";
import BluetoothSerial from "react-native-bluetooth-serial";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

import { sendNotificationImmediately } from "./notifications";
import storage from "./storage";

var warned = false;
  
const refreshAllTasks = async () => {
  var taskAsyncMarkers = await storage.get("asyncMarkers");
  if (taskAsyncMarkers !== null) {
    for (let i = 0; i < taskAsyncMarkers.length; i++) {
      !taskAsyncMarkers[i].taskDeleted &&
        (await startCheckLocation(taskAsyncMarkers[i]));
    }
  }
};

const startCheckLocation = async (marker) => {
  const { status } = await Location.requestPermissionsAsync();
  if (status === "granted") {
    var latLng = marker.latLng;
    var radius = marker.radius;
    var LOCATION_TASK_NAME = marker.markerTaskName;
    await Location.startGeofencingAsync(LOCATION_TASK_NAME, [
      {
        ...latLng,
        radius,
      },
    ]);
    TaskManager.defineTask(
      LOCATION_TASK_NAME,
      async ({ data: { eventType, region }, error }) => {
        if (error) {
          console.log(error.message);
          return;
        }
        if (eventType === Location.GeofencingEventType.Enter) {
          sendNotificationImmediately("nexTime Reminders", "nexTime Location Reminder: " + marker.title);

          var taskAsyncMarkers = await storage.get("asyncMarkers");
          var taskMarkerIndex = taskAsyncMarkers.findIndex((task) => task.markerTaskName.includes(LOCATION_TASK_NAME));

          if (marker.repeat === false) {
            taskAsyncMarkers[taskMarkerIndex].taskDeleted = true;
            await storage.store("asyncMarkers", taskAsyncMarkers);
            Location.stopGeofencingAsync(LOCATION_TASK_NAME);
          }
          if (marker.delete === true) {
            taskAsyncMarkers.splice(taskMarkerIndex, 1);
            for (let i = 0; i < taskAsyncMarkers.length; i++) {
              taskAsyncMarkers[i].markerIndex = i + 1;
              taskAsyncMarkers[i].circleId = i + 1 + "c";
            }
            await storage.store("asyncMarkers", taskAsyncMarkers);
          }
          console.log(
            "You've entered region:" + "Title: " + marker.title,
            region
          );
        } 
      }
    );
    const tasks = await TaskManager.getRegisteredTasksAsync();
    console.log("All Tasks", tasks);
  }
};

const startCheckBluetooth = (bTDeviceID) => {
  TaskManager.defineTask(bTDeviceID, async () => {
    console.log('Task running!!!');

    var taskAsyncBTDevices = await storage.get("asyncSerialBTDevices");
    var index = taskAsyncBTDevices.findIndex((taskAsyncBTDevice) => bTDeviceID == taskAsyncBTDevice.id);
    const btReminder = taskAsyncBTDevices[index];

    let enable = false;
    const wasEnabled = await BluetoothSerial.isEnabled();
    if (wasEnabled === false && btReminder.startBluetooth == true) {enable = await BluetoothSerial.enable();}
    let timer = Date.now() + 2000;
    if (enable === true || wasEnabled === true){
      while (Date.now() < timer){
        let life = 'go by..'; 
      };
    }
   
    wasEnabled && (warned = false);
    if (!wasEnabled && !warned && !btReminder.startBluetooth) {
      warned = true;
      return sendNotificationImmediately("nexTime Reminders", "Bluetooth must be on for your reminders to work");
    } else if (!wasEnabled && warned === true) {
      return;
    }

    var serialListUnpaired = await BluetoothSerial.discoverUnpairedDevices();
    var bTDeviceIDs = [];
    serialListUnpaired.forEach((item) => bTDeviceIDs.push(item.id));
    var present = bTDeviceIDs.some((id) => bTDeviceID == id);

    !wasEnabled && BluetoothSerial.disable();

    if (present === true) {
      sendNotificationImmediately("nexTime Reminders", `Bluetooth reminder: ${btReminder.name}`);

      if (!btReminder.repeat) {
        TaskManager.unregisterTaskAsync(bTDeviceID);
        btReminder.taskDeleted = true;
        await storage.store("asyncSerialBTDevices", taskAsyncBTDevices);
      }

      if (btReminder.delete) {
        taskAsyncBTDevices.splice(index, 1);
        await storage.store("asyncSerialBTDevices", taskAsyncBTDevices);
      }
    }
  });

  try {
    BackgroundFetch.registerTaskAsync(bTDeviceID, {
      minimumInterval: 5, // seconds,
      stopOnTerminate: true,
      startOnBoot: false,
    });
    console.log("Task registered");
  } catch (err) {
    console.log("Task Register failed:", err);
  }
};


export default {
  refreshAllTasks,
  startCheckLocation,
  startCheckBluetooth,
};
