import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import storage from "./storage";
import { sendNotificationImmediately } from "../utility/notifications";

export default startCheckLocation = async () => {
  const { status } = await Location.requestPermissionsAsync();
  if (status === "granted") {
    var asyncMarkers = await storage.get("asyncMarkers");
    var marker = asyncMarkers[asyncMarkers.length - 1];
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
          if (marker.repeat === false) {
            TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME);
            var taskAsyncMarkers = await storage.get("asyncMarkers");

            const markerSearch = (task) => {
              return task.markerTaskName.includes(LOCATION_TASK_NAME);
            };
            var taskMarker = taskAsyncMarkers.findIndex(markerSearch);

            taskAsyncMarkers.splice(taskMarker, 1);
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
        } else if (eventType === Location.GeofencingEventType.Exit) {
          //console.log("You've left region:", region);
        }
      }
    );
    const tasks = await TaskManager.getRegisteredTasksAsync();
    console.log("All Tasks", tasks);
  }
};
