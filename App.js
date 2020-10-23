import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import * as React from "react";
import * as TaskManager from "expo-task-manager";

import appTasks from "./app/utility/appTasks";
import { askPermissionsNotifications } from "./app/utility/notifications";
import DrawerNavigator from "./app/navigation/DrawerNavigator";
import nexTheme from "./app/config/drawerTheme";
import storage from './app/utility/storage';



TaskManager.defineTask('checkLocation', async ({ data: { locations }, error }) => {
  console.log('Check Location running !!!');

  var taskAsyncBTDevices = await storage.get("asyncSerialBTDevices");
  if(taskAsyncBTDevices && taskAsyncBTDevices[0].id){
    appTasks.startCheckBluetoothAsync( taskAsyncBTDevices );
  }

  if (error){
    console.log(error);
    return;
  }
});

export default function App() {
  const requestPermission = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (!result.granted)
      alert(
        "You will need to enable location permissions to get current location and for the reminders to work."
      );
  };

  const formatStorage = async () => {
    await storage.get("asyncMarkers") == null && await storage.store("asyncMarkers", '');
    await storage.get("asyncSerialBTDevices") == null && await storage.store("asyncSerialBTDevices", '');
    await storage.get("startBluetooth") == null && await storage.store("startBluetooth", {startBluetooth : false});
  }

  React.useEffect(() => {
    formatStorage();
    requestPermission();
    askPermissionsNotifications();
  });

  return (
    <NavigationContainer  theme={nexTheme} >
      <DrawerNavigator />
    </NavigationContainer>
  );
}



Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});
