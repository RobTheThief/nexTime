import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MapScreen from "../screens/MapScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

import BluetoothScreen from "../screens/BluetoothScreen";
import WifiScreen from "../screens/WifiScreen";

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerStyle={{ width: "50%" }}
      initialRouteName="Locations"
      edgeWidth={100}
    >
      <Drawer.Screen name="Locations" component={MapScreen} />
      <Drawer.Screen name="Connections" component={ConnectionsNavigator} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="Welcome Screen" component={WelcomeScreen} />
    </Drawer.Navigator>
  );
};
// fuck it make a tab navigator for connections
const Tab = createBottomTabNavigator();
const ConnectionsNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Bluetooth" component={BluetoothScreen} />
      <Tab.Screen name="Wifi" component={WifiScreen} />
    </Tab.Navigator>
  );
};
export default DrawerNavigator;
