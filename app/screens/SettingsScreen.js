import { Alert, StyleSheet, Switch, View } from 'react-native';
import * as Location from "expo-location";
import { Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';

import AppHeader from '../components/AppHeader';
import appTasks from '../utility/appTasks';
import AppText from '../components/AppText';
import colors from '../config/colors';
import refreshData from '../utility/refreshData';
import storage from '../utility/storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import nexTimeService from '../../nexTimeService';

function SettingsScreen({navigation, setThemeState, themeState, numSystem, setNumSystem }) {

  useEffect(()=> {
    setNumSystem(storage.getOptions().measurementSys);
  }, [])

  var options = storage.getOptions();

  const toggleMeasurementSys = () => {
    
    Alert.alert(
      "Switch measurement system",
      `All current location reminders will be deleted. Are you sure you want to Switch to ${numSystem == 'metric' ? 'imperial' : 'metric'} system?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            const mySetting = numSystem == 'metric' ? 'imperial' : 'metric';
            options.measurementSys = mySetting;
            storage.store('options', options);
            setNumSystem(mySetting);
            storage.store('asyncMarkers', []);
            refreshData.refreshReminders('asyncMarkers');
          },
        },
      ],
      { cancelable: false }
    );
  }

  const toggleColor = () => {
    const mySetting = themeState == 'light' ? 'dark' : 'light';
    options.color = mySetting;
    storage.store('options', options);
    setThemeState(mySetting);
    
  }

  const [btStart, setBtStart] = useState(options.startBluetooth);

  const toggleBtStart = () => {
    const mySetting = (btStart ? false : true);
    options.startBluetooth = mySetting;
    storage.store('options', options);
    setBtStart(mySetting);
    mySetting && Alert.alert('nexTime',
      'Allows the app to automatically enable bluetooth while scanning. Bluetooth is disabled again when finished to save power.')
  }

  const handleToggleService = () => {
    return new Promise( async resolve => {
    var isRunning = await Location.hasStartedLocationUpdatesAsync('checkLocation');
    if(isRunning) {
      await Location.stopLocationUpdatesAsync('checkLocation')
      nexTimeService.stopService();
    }else {
      await appTasks.isServiceRunning();
    }
    isRunning = await Location.hasStartedLocationUpdatesAsync('checkLocation');
    Alert.alert('nexTime', `Reminder service ${isRunning ? 'Started' : 'Stopped'}`);
    resolve();
    });
  }

    return (
    <>
        <AppHeader themeState={themeState} style={{height: '11.5%'}} navigation={navigation} />
        <View style={[styles.main, colors.mode[themeState].main]} >
          <View style={[ styles.settingContainer, colors.mode[themeState].container, colors.mode[themeState].elevation ]}>
            <View style={styles.settingsHeader}>
              <MaterialCommunityIcons name="tape-measure" size={18} color={colors.mode[themeState].headers.color} />
              <AppText style={[styles.settingsHeaderText, colors.mode[themeState].headers]} >Measurement System</AppText>
            </View>
            <View style={styles.controlContainer}>
              <AppText >Imperial</AppText>
              <Switch
                  style={styles.switch}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={numSystem == 'metric' ? colors.primary : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleMeasurementSys}
                  value={numSystem == 'metric'}
              />
              <AppText >Metric</AppText>
            </View>
          </View>

          <View style={[styles.settingContainer, colors.mode[themeState].container, colors.mode[themeState].elevation ]}>
            <View style={styles.settingsHeader}>
              <MaterialCommunityIcons name="invert-colors" size={18} color={colors.mode[themeState].headers.color} />
              <AppText style={[styles.settingsHeaderText, colors.mode[themeState].headers]} >Colour Scheme</AppText>
            </View>
            <View style={styles.controlContainer}>
              <AppText >Dark Mode</AppText>
              <Switch
                  style={styles.switch}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={themeState == 'light' ? colors.primary : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleColor}
                  value={themeState == 'light'}
              />
              <AppText >Light Mode</AppText>
            </View>
          </View>

          <View style={[styles.settingContainer, colors.mode[themeState].container, colors.mode[themeState].elevation ]}>
            <View style={styles.settingsHeader}>
              <Fontisto name="bluetooth-b" size={18} color={colors.mode[themeState].headers.color} />
              <AppText style={[styles.settingsHeaderText, colors.mode[themeState].headers]} >Bluetooth Start</AppText>
            </View>
            <View style={styles.controlContainer}>
              <AppText >OFF</AppText>
              <Switch
                  style={styles.switch}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={btStart ? colors.primary : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleBtStart}
                  value={btStart}
              />
              <AppText >ON</AppText>
            </View>
          </View>

          <View style={[styles.settingContainer, colors.mode[themeState].container, colors.mode[themeState].elevation ]}>
            <View style={styles.settingsHeader}>
              <MaterialCommunityIcons name="restart" size={18} color={colors.mode[themeState].headers.color} />
              <AppText style={[styles.settingsHeaderText, colors.mode[themeState].headers]} >Start / Stop Reminder Service</AppText>
            </View>
              <View style={styles.controlContainer}>
                <TouchableOpacity style={[styles.startStopButton, colors.mode[themeState].startStopButton, colors.mode[themeState].elevation]} onPress={ () => handleToggleService() }>
                <AppText>Start / Stop</AppText>
                </TouchableOpacity>
              </View>
          </View>
        </View>
    </>
    );
}

const styles = StyleSheet.create({
    main: {
      flex: 1,
      paddingTop: 15,
    },
    settingsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        marginVertical:15,
        marginLeft: 15,
        color: colors.primaryLight,
      },
    settingsHeaderText: {
        fontSize: 17,
        marginLeft: 5,
      },
    settingContainer: {
        color: colors.primary,
        borderWidth: 1,
        borderRadius: 25,
        marginHorizontal: 20,
        marginVertical: 10,
      },
      startStopButton: {
        backgroundColor: colors.primary,
        padding: 7,
        borderWidth: 1,
        borderRadius: 20,
      },
    controlContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: 10,
        marginLeft: 15,
      },
})

export default SettingsScreen;