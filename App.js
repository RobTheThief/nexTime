import { Alert } from "react-native";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import * as React from "react";
import * as TaskManager from "expo-task-manager";

import appTasks from "./app/utility/appTasks";
import { askPermissionsNotifications } from "./app/utility/notifications";
import colors from "./app/config/colors";
import refreshData from "./app/utility/refreshData";
import storage from './app/utility/storage';
import WelcomeScreen from "./app/screens/WelcomeScreen";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

TaskManager.defineTask('checkLocation', async ({ data: { locations }, error }) => {
  console.log('Tasks running !!!');

  var taskAsyncMarkers = await storage.get('asyncMarkers');
  if(taskAsyncMarkers[0] && taskAsyncMarkers[0].id){
    await appTasks.startCheckLocation(locations, taskAsyncMarkers);
    refreshData.refreshReminders('asyncMarkers');
  }
  
  var taskAsyncWifiNetworks = await storage.get("asyncWifiReminders");
  if(taskAsyncWifiNetworks && taskAsyncWifiNetworks[0].id){
    await appTasks.startCheckWifi( taskAsyncWifiNetworks );
    refreshData.refreshReminders('asyncWifiReminders');
  }
  
  var taskAsyncBTDevices = await storage.get("asyncSerialBTDevices");
  if(taskAsyncBTDevices && taskAsyncBTDevices[0].id){
    await appTasks.startCheckBluetoothAsync( taskAsyncBTDevices );
    refreshData.refreshReminders('asyncSerialBTDevices');
  }

  if (error){
    console.log(error);
    return;
  }
});

export default function App() {
  
  const requestPermission = () => {
    return new Promise( async resolve => {
      const result = await Permissions.askAsync(Permissions.LOCATION);
      if (!result.granted){
        alert(
          "You will need to enable location permissions to get current location and for the reminders to work."
        );
        return;
      }else{
        resolve();
      }
      });
  };

  const permissionMessage = async () => {
    const {status} = await Permissions.getAsync(Permissions.LOCATION);
    setTimeout(() => {
      if(status !== 'granted'){
        Alert.alert(
          "Background Location",
          `To use the map and create reminders, allow nexTime to use your location all the time.\n\nnextTime will use your location in the background to trigger reminders you have set.\n\nLocation information is only stored on your device and is never shared.`,
          [
            {
              text: "OK",
              onPress:  () => {
                requestPermissionAndLoadOptions();
                }
            },
            {
              text: "No thanks"
            }
          ],
          { cancelable: false }
        );
      }else {
        requestPermissionAndLoadOptions();
      }
    }, 2000);
  };

  const [welcome, setWelcome] = React.useState(true);
  const [themeState, setThemeState] = React.useState();
  const [numSystem, setNumSystem] = React.useState();


  const loadOptionsToMemAndSetAsync = async () => {
    
    await stopService();
    await storage.formatStorage();
    await storage.firstPickNumSystem();
    setThemeState(storage.getOptions().color);
    colors.btTabColor = colors.secondary;
    colors.wifiTabColor = colors.primaryLight;
    setTimeout(async () => {
      setWelcome(false);
      appTasks.checkLocationTask();
    }, 2000);
  
  };

  const requestPermissionAndLoadOptions = async () => {
    await requestPermission();
    await loadOptionsToMemAndSetAsync();
  };

  const stopService = () => {
    return new Promise( async resolve => {
      var isRunning = await Location.hasStartedLocationUpdatesAsync('checkLocation');
      isRunning && await Location.stopLocationUpdatesAsync('checkLocation');
      resolve();
    });  
  };

  React.useEffect(() => {
    refreshData.resetRefreshObj();   
    permissionMessage();
    askPermissionsNotifications();
  }, []);
  

  return (
    <WelcomeScreen  setThemeState={setThemeState}
                    themeState={themeState}
                    setNumSystem={setNumSystem} 
                    numSystem={numSystem}
                    welcome={welcome}
    />
  );
}
