import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import MapScreen from "../screens/MapScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

import BluetoothScreen from "../screens/BluetoothScreen";
import WifiScreen from "../screens/WifiScreen";

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerStyle={{ width: "50%" }}
    initialRouteName="Welcome Screen"
    edgeWidth={100}
  >
    <Drawer.Screen name="Locations" component={MapScreen} />
    <Drawer.Screen name="Connections" component={ConnectionsNavigator} />
    <Drawer.Screen name="Notifications" component={NotificationsScreen} />
    <Drawer.Screen name="Welcome Screen" component={WelcomeScreen} />
  </Drawer.Navigator>
);

const ConnectionsNavigator = () => (
  <Drawer.Navigator drawerStyle={{ width: "50%" }} edgeWidth={100}>
    <Drawer.Screen name="Bluetooth" component={BluetoothScreen} />
    <Drawer.Screen name="Wifi" component={WifiScreen} />
    <Drawer.Screen name="Back" component={DrawerNavigator} />
  </Drawer.Navigator>
);
export default DrawerNavigator;
