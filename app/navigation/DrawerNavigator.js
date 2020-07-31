import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import MapScreen from "../screens/MapScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="Welcome Screen">
    <Drawer.Screen name="Map" component={MapScreen} />
    <Drawer.Screen name="Notifications" component={NotificationsScreen} />
    <Drawer.Screen name="Welcome Screen" component={WelcomeScreen} />
  </Drawer.Navigator>
);

export default DrawerNavigator;
