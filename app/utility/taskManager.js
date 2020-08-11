import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import storage from "./storage";

const LOCATION_TASK_NAME = "locationUpdates";

export default startCheckLocation = async () => {
  const { status } = await Location.requestPermissionsAsync();
  if (status === "granted") {
    const asyncMarkers = await storage.get("asyncMarkers");
    const latLng = asyncMarkers[asyncMarkers.length - 1].latLng;
    const radius = asyncMarkers[asyncMarkers.length - 1].radius;
    await Location.startGeofencingAsync(LOCATION_TASK_NAME, [
      {
        ...latLng,
        radius,
      },
    ]);
  }
};

TaskManager.defineTask(
  LOCATION_TASK_NAME,
  ({ data: { eventType, region }, error }) => {
    if (error) {
      console.log(error.message);
      return;
    }
    if (eventType === Location.GeofencingEventType.Enter) {
      console.log("You've entered region:", region);
    } else if (eventType === Location.GeofencingEventType.Exit) {
      console.log("You've left region:", region);
    }
  }
);
