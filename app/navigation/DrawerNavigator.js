import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as React from "react";
import AppText from "../components/AppText";
import { StyleSheet} from 'react-native';

import BluetoothScreen from "../screens/BluetoothScreen";
import MapScreen from "../screens/MapScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import WifiScreen from "../screens/WifiScreen";
import colors from "../config/colors";

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {


  return (
    <Drawer.Navigator
      drawerStyle={{ width: "50%" }}
      initialRouteName="Locations"
      edgeWidth={100}
    >
      <Drawer.Screen name="Locations" component={MapScreen} />
      <Drawer.Screen name='Connections' component={ConnectionsNavigator} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="Welcome Screen" component={WelcomeScreen} />
    </Drawer.Navigator>
  );
};

const Tab = createBottomTabNavigator();
const ConnectionsNavigator = () => {
  return (
    <Tab.Navigator tabStyle={{ fontSize: 12 }}>
      <Tab.Screen options={{title: () => {return <AppText style = {styles.tabLable} >Bluetooth</AppText>}}}  name="Bluetooth" component={BluetoothScreen} />
      <Tab.Screen options={{title: () => {return <AppText style = {styles.tabLable} >Wifi</AppText>}}} name="Wifi" component={WifiScreen} />
    </Tab.Navigator>
  );
};


const styles = StyleSheet.create({
  tabLable: {
      fontSize: 15,
      color: colors.secondary,
    },
})


export default DrawerNavigator;




