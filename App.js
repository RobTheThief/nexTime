import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { BleManager } from "react-native-ble-plx";

import DrawerNavigator from "./app/navigation/DrawerNavigator";
import nexTheme from "./app/config/drawerTheme";
import { askPermissionsNotifications } from "./app/utility/notifications";
import appTasks from "./app/utility/appTasks";
import bluetoothScan from "./app/utility/bluetoothScan";

export default function App() {
  const requestPermission = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (!result.granted)
      alert(
        "You will need to enable location permissions to get current location and for the reminders to work."
      );
  };

  const [blueToothManager, setBlueToothManager] = React.useState(
    new BleManager()
  );

  React.useEffect(() => {
    requestPermission();
    askPermissionsNotifications();
    appTasks.refreshAllTasks();
    bluetoothScan.subscribeBTScan(blueToothManager);
  });

  return (
    <NavigationContainer theme={nexTheme}>
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
