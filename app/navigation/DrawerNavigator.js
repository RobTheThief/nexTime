import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as React from "react";
import AppText from "../components/AppText";
import { StyleSheet} from 'react-native';

import BluetoothScreen from "../screens/BluetoothScreen";
import MapScreen from "../screens/MapScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import WifiScreen from "../screens/WifiScreen";
import colors from "../config/colors";
import SettingsScreen from "../screens/SettingsScreen";

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  
  return (
    <Drawer.Navigator
      drawerStyle={{ width: "50%" }}
      initialRouteName="Welcome Screen"
      edgeWidth={40}
      lazy={true}
    >
      <Drawer.Screen name="Locations" component={MapScreen} />
      <Drawer.Screen name='Connections' component={ConnectionsNavigator} />
      <Drawer.Screen name='Settings' component={SettingsScreen} />
      <Drawer.Screen name="Welcome Screen" component={WelcomeScreen} />
    </Drawer.Navigator>
  );
};

const Tab = createBottomTabNavigator();
const ConnectionsNavigator = () => {
  return (
    <Tab.Navigator tabStyle={{ fontSize: 12 }} lazy={true} >
      <Tab.Screen listeners ={{
                    tabPress: () => {
                      colors.btTabColor = colors.secondary;
                      colors.wifiTabColor = colors.primaryLight;
                    },
                  }} 
                  options={{title: () => {return <AppText style = {[styles.btTabLable, {color: colors.btTabColor,}]} >BLUETOOTH</AppText>}}}  name="Bluetooth" component={BluetoothScreen} />
      <Tab.Screen listeners ={{
                    tabPress: () => {
                      colors.btTabColor = colors.primaryLight;
                      colors.wifiTabColor = colors.secondary;
                    },
                  }} 
                  options={{title: () => {return <AppText style = {[styles.wifiTabLable, {color: colors.wifiTabColor,}]} >WIFI</AppText>}}} name="Wifi" component={WifiScreen} />
    </Tab.Navigator>
  );
};


const styles = StyleSheet.create({
  btTabLable: {
      fontSize: 15,
    },
    wifiTabLable: {
      fontSize: 15,
    },
})


export default DrawerNavigator;




