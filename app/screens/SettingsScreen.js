import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, View } from 'react-native';
import { Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';

import colors from '../config/colors';
import AppText from '../components/AppText';
import AppHeader from '../components/AppHeader';
import storage from '../utility/storage';

function SettingsScreen({navigation}) {

  var options = storage.getOptions();

  const [measurementSys, setMeasurementSys] = useState(options.measurementSys);

  const toggleMeasurementSys = () => {
    const mySetting = measurementSys == 'metric' ? 'imperial' : 'metric';
    options.measurementSys = mySetting;
    storage.store('options', options);
    setMeasurementSys(mySetting);
  }

  const [color, setColor] = useState(options.color);

  const toggleColor = () => {
    const mySetting = color == 'bright' ? 'dark' : 'bright';
    options.color = mySetting;
    storage.store('options', options);
    setColor(mySetting);
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

    return (
    <>
        <AppHeader style={{height: '11.5%'}} navigation={navigation} />

        <View style={styles.settingContainer}>
          <View style={styles.settingsHeader}>
            <MaterialCommunityIcons name="tape-measure" size={18} color={colors.primaryLight} />
            <AppText style={styles.settingsHeaderText} >Measurement System</AppText>
          </View>
          <View style={styles.switchContainer}>
            <AppText >Imperial</AppText>
            <Switch
                style={styles.switch}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={measurementSys == 'metric' ? colors.primary : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleMeasurementSys}
                value={measurementSys == 'metric'}
            />
            <AppText >Metric</AppText>
          </View>
        </View>

        <View style={styles.settingContainer}>
          <View style={styles.settingsHeader}>
            <MaterialCommunityIcons name="invert-colors" size={18} color={colors.primaryLight} />
            <AppText style={styles.settingsHeaderText} >Colour Scheme</AppText>
          </View>
          <View style={styles.switchContainer}>
            <AppText >Bright</AppText>
            <Switch
                style={styles.switch}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={color == 'bright' ? colors.primary : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleColor}
                value={color == 'bright'}
            />
            <AppText >Dark Mode</AppText>
          </View>
        </View>

        <View style={styles.settingContainer}>
          <View style={styles.settingsHeader}>
            <Fontisto name="bluetooth-b" size={18} color={colors.primaryLight} />
            <AppText style={styles.settingsHeaderText} >Bluetooth Start</AppText>
          </View>
          <View style={styles.switchContainer}>
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
    </>
    );
}

const styles = StyleSheet.create({
    settingsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        marginBottom: 10,
        marginTop: 20,
        color: colors.primaryLight,
      },
    settingsHeaderText: {
        fontSize: 17,
        color: colors.primaryLight,
        marginLeft: 5,
      },
    settingContainer: {
        color: colors.primary,
        borderBottomWidth: 1,
        marginHorizontal: 20,
      },
    switchContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: 10,
      },
})

export default SettingsScreen;