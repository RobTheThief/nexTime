import * as BackgroundFetch from "expo-background-fetch";
import BluetoothSerial from "react-native-bluetooth-serial-next";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

import { sendNotificationImmediately } from "./notifications";
import storage from "./storage";
import bluetoothScan from './bluetoothScan';

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
          var taskMarkerIndex = taskAsyncMarkers.findIndex(markerSearch);
          const markerSearch = (task) => {
            return task.markerTaskName.includes(LOCATION_TASK_NAME);
          };

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
      
    const isEnabled = await BluetoothSerial.isEnabled();
    isEnabled && (warned = false);
    if (!isEnabled && warned === false) {
      warned = true;
      return sendNotificationImmediately("nexTime Reminders", "Bluetooth must be on for your reminders to work");
    } else if (!isEnabled && warned === true) {
      return;
    }

    var serialListUnpaired = await BluetoothSerial.listUnpaired();
    var bTDeviceIDs = [];
    serialListUnpaired.forEach((item) => bTDeviceIDs.push(item.id));
    var present = bTDeviceIDs.some((id) => bTDeviceID == id);

    if (present === true) {
      var taskAsyncBTDevices = await storage.get("asyncSerialBTDevices");
      const index = taskAsyncBTDevices.findIndex((taskAsyncBTDevice) => bTDeviceID == taskAsyncBTDevice.id);
      const btReminder = taskAsyncBTDevices[index];
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

const startCheckBle = (bTDeviceID) => {
  TaskManager.defineTask(bTDeviceID, async () => {
    console.log('Task running!!!');

    const isEnabled = await BluetoothSerial.isEnabled();
    isEnabled && (warned = false);
    if (!isEnabled && warned === false) {
      warned = true;
      return sendNotificationImmediately("nexTime Reminders", "Bluetooth must be on for your reminders to work");
    } else if (!isEnabled && warned === true) {
      return;
    }

    var btReminders = await storage.get("asyncBLEDevices");
    
    for (let i = 0; i < btReminders.length; i++) {
      for (let j = 0; j < bluetoothScan.bTDevicesArray.length; j++) {
        if (btReminders[i].id.includes(bluetoothScan.bTDevicesArray[j].id)) {
          sendNotificationImmediately("nexTime Reminders",
            `Bluetooth reminder: ${bluetoothScan.bTDevicesArray[j].name
              ? bluetoothScan.bTDevicesArray[j].name
              : bluetoothScan.bTDevicesArray[j].localName
              ? bluetoothScan.bTDevicesArray[j].localName
              : bluetoothScan.bTDevicesArray[j].id}`
          );

          if (!btReminders[i].repeat) {
            TaskManager.unregisterTaskAsync(bTDeviceID);
            console.log('initial state taskDeleted : ', btReminders[i].taskDeleted);
            btReminders[i].taskDeleted = true;
            await storage.store("asyncBLEDevices", btReminders);
          }
          if (btReminders[i].delete) {
            btReminders.splice(i, 1);
            (btReminders.length === 0) ? await storage.store("asyncBLEDevices", '') : await storage.store("asyncBLEDevices", btReminders);
          }

          j = 100;
          i = 100;
        }
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

const terminateNoTaskBle = () => {
  TaskManager.defineTask('terminateNoTaskBle',  () => {
    console.log('terminateNoTaskBle running!!!');
      
    bluetoothScan.stopScan.splice(0, bluetoothScan.stopScan.length);
    bluetoothScan.stopScan.unshift('STOP THE SCAN');
  });

  try {
    BackgroundFetch.registerTaskAsync('terminateNoTaskBle', {
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
  startCheckBle,
  terminateNoTaskBle,
};
