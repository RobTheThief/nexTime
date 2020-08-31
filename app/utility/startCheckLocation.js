import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import storage from "./storage";
import { sendNotificationImmediately } from "../utility/notifications";

export default startCheckLocation = async () => {
  const { status } = await Location.requestPermissionsAsync();
  if (status === "granted") {
    var asyncMarkers = await storage.get("asyncMarkers");
    const marker = asyncMarkers[asyncMarkers.length - 1];
    const latLng = marker.latLng;
    const radius = marker.radius;
    const LOCATION_TASK_NAME = marker.title + marker.identifier;
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
            asyncMarkers.splice(marker.id - 1, 1);
            storage.store("asyncMarkers", asyncMarkers);
            asyncMarkers = await storage.get("asyncMarkers");
          }

          console.log(
            "You've entered region:" + "Title: " + marker.title,
            region
          );
        } else if (eventType === Location.GeofencingEventType.Exit) {
          const message =
            "You are leaving area for nexTime Reminder: " + marker.title;
          sendNotificationImmediately(message);
          console.log("You've left region:", region);
        }
      }
    );
    const tasks = await TaskManager.getRegisteredTasksAsync();
    console.log(tasks);
  }
};
