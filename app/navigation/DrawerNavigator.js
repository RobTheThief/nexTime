import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as React from "react";
import AppText from "../components/AppText";
import { StyleSheet} from 'react-native';

import BluetoothScreen from "../screens/BluetoothScreen";
import MapScreen from "../screens/MapScreen";
import WifiScreen from "../screens/WifiScreen";
import colors from "../config/colors";
import SettingsScreen from "../screens/SettingsScreen";

const Drawer = createDrawerNavigator();
const DrawerNavigator = ({setThemeState, themeState, numSystem, setNumSystem}) => {
  return (
    <Drawer.Navigator
      drawerStyle={ [{width: "50%", borderRightColor: colors.secondary, borderRightWidth: 2},
                    themeState && colors.mode[themeState].drawerThemeStyles
                  ]}
      initialRouteName="Locations"
      edgeWidth={30}
      lazy={true}
    >
      <Drawer.Screen name="Locations" >
        {(props) => <MapScreen  {...props} themeState={themeState} numSystem={numSystem} setNumSystem={setNumSystem} />}
      </Drawer.Screen>

      <Drawer.Screen name='Connections' >
        {(props) => <ConnectionsNavigator  {...props} themeState={themeState} />}
      </Drawer.Screen>

      <Drawer.Screen name='Settings'>
        {(props) => <SettingsScreen {...props}
                                    setThemeState={setThemeState}
                                    themeState={themeState} 
                                    setNumSystem={setNumSystem} 
                                    numSystem={numSystem} />}
      </Drawer.Screen> 
    </Drawer.Navigator>
  );
};

const Tab = createBottomTabNavigator();
const ConnectionsNavigator = ({ themeState}) => {
  return (
    <Tab.Navigator tabBarOptions= {{
                          style: colors.mode[themeState].tabBar
                      }}
                   tabStyle={{ fontSize: 12 }}
                   lazy={true}
                    >
      <Tab.Screen listeners ={{
                    tabPress: () => {
                      colors.btTabColor = colors.secondary;
                      colors.wifiTabColor = colors.primaryLight;
                    },
                  }} 
                  options={{title: () => {return <AppText style = {[styles.btTabLable, {color: colors.btTabColor,}]} >BLUETOOTH</AppText>}}}  name="Bluetooth" >
                  {(props) => <BluetoothScreen  {...props} themeState={themeState} />}
      </Tab.Screen>
      <Tab.Screen listeners ={{
                    tabPress: () => {
                      colors.btTabColor = colors.primaryLight;
                      colors.wifiTabColor = colors.secondary;
                    },
                  }} 
                  options={{title: () => {return <AppText style = {[styles.wifiTabLable, {color: colors.wifiTabColor,}]} >WIFI</AppText>}}} name="Wifi" >
                  {(props) => <WifiScreen  {...props} themeState={themeState} />}
      </Tab.Screen>
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




