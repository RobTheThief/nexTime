import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import storage from "./storage";
import { sendNotificationImmediately } from "../utility/notifications";

export default startCheckLocation = async () => {
  const { status } = await Location.requestPermissionsAsync();
  if (status === "granted") {
    const asyncMarkers = await storage.get("asyncMarkers");
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
            marker.title + " " + marker.identifier + " R" + radius;
          sendNotificationImmediately(message);
          /////////////////////////////////////
          var asyncTriggers = await storage.get("triggeredGeofences");
          if (asyncTriggers == null) {
            storage.store("triggeredGeofences", [
              {
                title: marker.title,
                id: marker.identifier + " : " + Date(),
                radius: radius,
              },
            ]);
          } else {
            asyncTriggers.push({
              title: marker.title,
              id: marker.identifier + " : " + Date(),
              radius: radius,
            });
            storage.store("triggeredGeofences", asyncTriggers);
          }
          //////////////////////////////////////////
          console.log(
            "You've entered region:" + "Title: " + marker.title,
            region
          );
        } else if (eventType === Location.GeofencingEventType.Exit) {
          console.log("You've left region:", region);
        }
      }
    );
    const tasks = await TaskManager.getRegisteredTasksAsync();
    console.log(tasks);
  }
};
