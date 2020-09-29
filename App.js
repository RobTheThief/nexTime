import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

import DrawerNavigator from "./app/navigation/DrawerNavigator";
import nexTheme from "./app/config/drawerTheme";
import { askPermissionsNotifications } from "./app/utility/notifications";
import appTasks from "./app/utility/startCheckLocation";

export default function App() {
  const requestPermission = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (!result.granted)
      alert(
        "You will need to enable location permissions to get current location and for the reminders to work."
      );
  };

  React.useEffect(() => {
    requestPermission();
    askPermissionsNotifications();
    appTasks.refreshAllTasks();
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
