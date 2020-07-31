import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as Permissions from "expo-permissions";

import DrawerNavigator from "./app/navigation/DrawerNavigator";

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
  });

  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}
