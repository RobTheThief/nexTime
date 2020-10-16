import { AntDesign } from "@expo/vector-icons";
import BluetoothSerial from 'react-native-bluetooth-serial';
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

import appTasks from "../utility/appTasks/";
import AppText from "../components/AppText";
import colors from "../config/colors";
import storage from "../utility/storage";

var serialBTReminders = [];
var unpairedDevices = [];
var pairedDevices = [];

function BluetoothScreen() {
  const [bTDevicesArray, setBTDevicesArray] = useState(
    [{ name: "Press 'Refresh' for list of nearby devices", id: "123456789" }]
  );

  const updateDevices = async () => {
    setBTDevicesArray([{ name: "Searching... ", id: "123456789" }]);

    pairedDevices = BluetoothSerial.list();
    unpairedDevices = await BluetoothSerial.discoverUnpairedDevices();

    setBTDevicesArray(
      unpairedDevices[0] !== undefined
        ? unpairedDevices
        : [{ name: "No Bluetooth Devices Found ", id: "123456789" }]);
  };
  
  const remindBT = async (id, title, deviceClass) => {
    serialBTReminders = await storage.get("asyncSerialBTDevices");
    if (serialBTReminders && serialBTReminders.some((BTDevice) => id == BTDevice.id)) {
      alert("Reminder already set for this device");
      return;
    }

    appTasks.startCheckBluetooth(id);
    serialBTReminders === null && (serialBTReminders = []);
    serialBTReminders.push({ id: id, name: title, taskDeleted: false, repeat: false, delete: false });
    await storage.store("asyncSerialBTDevices", serialBTReminders);
    alert(`Reminder ${title} set`);
  };

  const Item = ({ title, rssi, id, deviceClass }) => (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() => id !== '123456789' && remindBT(id, title, deviceClass)}
      >
        <AppText style={styles.title}>
          {title + (rssi ? " Signal: " + rssi : "")}
        </AppText>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item
      title={item.name ? item.name : item.localName ? item.localName : item.id}
      rssi={item.rssi}
      id={item.id}
      deviceClass={item.class}
    />
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => updateDevices()} style={styles.button}>
        <AntDesign name="leftcircle" color={colors.primary} size={29} />
        <AppText style={styles.iconText}>Update</AppText>
      </TouchableOpacity>
      <FlatList
        data={bTDevicesArray}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    color: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: { paddingLeft: 5 },
});

export default BluetoothScreen;
