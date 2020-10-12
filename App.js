import { BleManager } from "react-native-ble-plx";
import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import * as React from "react";

import appTasks from "./app/utility/appTasks";
import { askPermissionsNotifications } from "./app/utility/notifications";
import bluetoothScan from "./app/utility/bluetoothScan";
import DrawerNavigator from "./app/navigation/DrawerNavigator";
import nexTheme from "./app/config/drawerTheme";
import storage from './app/utility/storage';

export default function App() {
  const requestPermission = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (!result.granted)
      alert(
        "You will need to enable location permissions to get current location and for the reminders to work."
      );
  };

  const [bluetoothManager, setBluetoothManager] = React.useState(
    new BleManager()
  );
  
  const checkRunBleScan = async () => {
    const BLEDeviceReminders = await storage.get("asyncBLEDevices");
    BLEDeviceReminders !== null && bluetoothScan.subscribeBTScan(bluetoothManager);
    console.log('checkRunBleScan');
  }

  React.useEffect(() => {
    requestPermission();
    askPermissionsNotifications();
    appTasks.refreshAllTasks();
    appTasks.terminateNoTaskBle();
    //appTasks.isBtEnabled();
    checkRunBleScan();
  });

  return (
    <NavigationContainer  theme={nexTheme} >
      <DrawerNavigator bluetoothManager={bluetoothManager} />
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
