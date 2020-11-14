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
import colors from "./app/config/colors";
import measurementSys from "./app/config/measurementSys";

TaskManager.defineTask('checkLocation', async ({ data: { locations }, error }) => {
  console.log('Tasks running !!!');

  var taskAsyncMarkers = await storage.get('asyncMarkers');
  if(taskAsyncMarkers && taskAsyncMarkers[0].id){
    appTasks.startCheckLocation(locations, taskAsyncMarkers);
  }

  var taskAsyncBTDevices = await storage.get("asyncSerialBTDevices");
  if(taskAsyncBTDevices && taskAsyncBTDevices[0].id){
    appTasks.startCheckBluetoothAsync( taskAsyncBTDevices );
  }

  var taskAsyncWifiNetworks = await storage.get("asyncWifiReminders");
  if(taskAsyncWifiNetworks && taskAsyncWifiNetworks[0].id){
    appTasks.startCheckWifi( taskAsyncWifiNetworks );
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

  const [themeState, setThemeState] = React.useState();

  const loadOptionsToMemAndSetAsync = async () => {
    await storage.formatStorage();
    setThemeState(storage.getOptions().color);
    colors.btTabColor = colors.secondary;
    colors.wifiTabColor = colors.primaryLight;
    measurementSys.unitDivider = measurementSys.oneThousand;
    measurementSys.kmOrMiles = measurementSys.km;
    measurementSys.mOrFt = measurementSys.meters;
  };

  React.useEffect(() => {
    loadOptionsToMemAndSetAsync();
    requestPermission();
    askPermissionsNotifications();
  }, []);
  

  return (
    <NavigationContainer  theme={nexTheme} >
      <DrawerNavigator setThemeState={setThemeState} themeState={themeState}/>
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
