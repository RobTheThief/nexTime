import BluetoothSerial from "react-native-bluetooth-serial";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

import { sendNotificationImmediately } from "./notifications";
import storage from "./storage";

var warned = false;
  
const checkLocationTask = () => {
  Location.startLocationUpdatesAsync('checkLocation', { 
    accuracy: Location.Accuracy.BestForNavigation,
    timeInterval: 60000,
    distanceInterval: 1,
    foregroundService: {
        notificationTitle: 'nexTime',
        notificationBody: 'nexTime Reminders running'
    }
  });
}

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
        }  else {
          return;
      }
    });
    const tasks = await TaskManager.getRegisteredTasksAsync();
    console.log("All Tasks", tasks);
  }
};



const startCheckBluetoothAsync = async ( taskAsyncBTDevices, startBluetooth ) => {
  console.log('BT Task running!!!');

  const wasEnabled = await BluetoothSerial.isEnabled();
  var startBluetooth = await storage.get('startBluetooth');
  startBluetooth = startBluetooth.startBluetooth;
  
  let enable = false;
  if (wasEnabled === false && startBluetooth == true) {enable = await BluetoothSerial.enable();}
  let timer = Date.now() + 2000;
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

      if (!btReminder.repeat) {
        btReminder.taskDeleted = true;
        await storage.store("asyncSerialBTDevices", taskAsyncBTDevices);
      }
      taskAsyncBTDevices = taskAsyncBTDevices.filter((reminder) => !reminder.delete);
      taskAsyncBTDevices.length === 0 ? await storage.store("asyncSerialBTDevices", '') : await storage.store("asyncSerialBTDevices", taskAsyncBTDevices);
    }
  }
};

export default {
  startCheckLocation,
  startCheckBluetoothAsync,
  checkLocationTask,
};
