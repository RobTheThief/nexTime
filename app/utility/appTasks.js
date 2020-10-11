import * as BackgroundFetch from "expo-background-fetch";
import BluetoothSerial from "react-native-bluetooth-serial-next";
import * as Location from "expo-location";
import { sendNotificationImmediately } from "./notifications";
import storage from "./storage";
import * as TaskManager from "expo-task-manager";
import bluetooth from './bluetoothScan';

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
          const message =
            "You are entering area for nexTime Reminder: " + marker.title;
          sendNotificationImmediately(message);

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
          //
          console.log(
            "You've entered region:" + "Title: " + marker.title,
            region
          );
        } else if (eventType === Location.GeofencingEventType.Exit) {
          //console.log("You've left region:", region);
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
      
    var serialListUnpaired = await BluetoothSerial.listUnpaired();
    var bTDeviceIDs = [];
    serialListUnpaired.forEach((item) => bTDeviceIDs.push(item.id));
    var present = bTDeviceIDs.some((id) => bTDeviceID == id);
      

    if (present === true) {
      var taskAsyncBTDevices = await storage.get("asyncSerialBTDevices");
      const index = taskAsyncBTDevices.findIndex((taskAsyncBTDevice) => bTDeviceID == taskAsyncBTDevice.id);
      sendNotificationImmediately(`Found ${taskAsyncBTDevices[index].name}`);
      taskAsyncBTDevices.splice(index, 1);
      TaskManager.unregisterTaskAsync(bTDeviceID);
      await storage.store("asyncSerialBTDevices", taskAsyncBTDevices);
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
      
    var btReminders = await storage.get("asyncBLEDevices");
    
    if (btReminders !== null) {
      for (let i = 0; i < btReminders.length; i++) {
        for (let j = 0; j < bluetooth.bTDevicesArray.length; j++) {
          if (btReminders[i].id.includes(bluetooth.bTDevicesArray[j].id)) {
            sendNotificationImmediately(
              bluetooth.bTDevicesArray[j].name
                ? bluetooth.bTDevicesArray[j].name
                : bluetooth.bTDevicesArray[j].localName
                ? bluetooth.bTDevicesArray[j].localName
                : bluetooth.bTDevicesArray[j].id + " Has been found!"
            );
            btReminders.splice(i, 1);
            await storage.store("asyncBLEDevices", btReminders);
            TaskManager.unregisterTaskAsync(bTDeviceID);
            j = 100;
            i = 100;
          }
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

export default {
  refreshAllTasks,
  startCheckLocation,
  startCheckBluetooth,
  startCheckBle,
};
