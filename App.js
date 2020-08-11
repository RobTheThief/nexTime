import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as Permissions from "expo-permissions";

import DrawerNavigator from "./app/navigation/DrawerNavigator";
import nexTheme from "./app/config/drawerTheme";

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
    <NavigationContainer theme={nexTheme}>
      <DrawerNavigator />
    </NavigationContainer>
  );
}

/*


import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

import startCheckLocation from "./app/utility/taskManager";

export default function App() {
  return (
    <TouchableOpacity style={styles.button} onPress={startCheckLocation}>
      <Text>Enable background location</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
});

*/
