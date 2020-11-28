import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import * as React from "react";
import SplashScreen from 'react-native-splash-screen';
import * as TaskManager from "expo-task-manager";

import appTasks from "./app/utility/appTasks";
import { askPermissionsNotifications } from "./app/utility/notifications";
import colors from "./app/config/colors";
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
  
  const requestPermission = () => {
    return new Promise( async resolve => {
      const result = await Permissions.askAsync(Permissions.LOCATION);
      if (!result.granted)
        alert(
          "You will need to enable location permissions to get current location and for the reminders to work."
        );
      resolve();
      });
  };

  const [welcome, setWelcome] = React.useState(true);
  const [themeState, setThemeState] = React.useState();
  const [numSystem, setNumSystem] = React.useState();


  const loadOptionsToMemAndSetAsync = async () => {
     
      await storage.formatStorage();
      console.log('after format storage');
      await storage.firstPickNumSystem();
      console.log('after pick num system');
      setThemeState(storage.getOptions().color);
      colors.btTabColor = colors.secondary;
      colors.wifiTabColor = colors.primaryLight;
      setTimeout(() => {
        setWelcome(false);
      }, 2000);
  
  };

  const requestPermissionAndLoadOptions = () => {
    return new Promise( async resolve => {
      SplashScreen.show();
      await requestPermission();
      await loadOptionsToMemAndSetAsync();
      SplashScreen.hide();
      resolve();
    });
  };

  React.useEffect(() => {    
    requestPermissionAndLoadOptions();
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
