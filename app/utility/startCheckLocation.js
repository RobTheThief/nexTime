import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import storage from "./storage";
import { sendNotificationImmediately } from "../utility/notifications";

const refreshAllTasks = async () => {
  var taskAsyncMarkers = await storage.get("asyncMarkers");
  console.log(taskAsyncMarkers);
  if (taskAsyncMarkers !== null) {
    for (let i = 0; i < taskAsyncMarkers.length; i++) {
      console.log(taskAsyncMarkers[i]);
      startCheckLocation(taskAsyncMarkers[i]);
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

          const markerSearch = (task) => {
            return task.markerTaskName.includes(LOCATION_TASK_NAME);
          };
          var taskAsyncMarkers = await storage.get("asyncMarkers");
          var taskMarker = taskAsyncMarkers.findIndex(markerSearch);

          if (marker.repeat === false) {
            taskAsyncMarkers[taskMarker].taskDeleted = true;
            await storage.store("asyncMarkers", taskAsyncMarkers);
            Location.stopGeofencingAsync(LOCATION_TASK_NAME);
          }
          if (marker.delete === true) {
            taskAsyncMarkers.splice(taskMarker, 1);
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

export default {
  refreshAllTasks,
  startCheckLocation,
};
