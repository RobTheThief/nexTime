import { AntDesign } from "@expo/vector-icons";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

import appTasks from "../utility/appTasks/";
import AppText from "../components/AppText";
import bluetoothScan from "../utility/bluetoothScan";
import colors from "../config/colors";
import storage from "../utility/storage";

var serialBTReminders = [];
var BTReminders = [];
var count = 0;

function BluetoothScreen({bluetoothManager}) {
  const [bTDevicesArray, setBTDevicesArray] = useState(
    bluetoothScan.bTDevicesArray[0] !== undefined
      ? bluetoothScan.bTDevicesArray
      : [{ name: "Press 'Refresh' for list of nearby devices", id: "123456789" }]
  );

  const updateDevices = () => {
    setBTDevicesArray( bluetoothScan.bTDevicesArray[0] !== undefined
      ? bluetoothScan.bTDevicesArray
      : [{ name: "Searching... ", id: "123456789" }]);
    bluetoothScan.subscribeBTScan(bluetoothManager.bluetoothManager.bluetoothManager);
    bluetoothScan.serialListUnpaired.splice(0,bluetoothScan.serialListUnpaired.length)
    bluetoothScan.getSerialListUnpairedAsync();
    if (count === 0) {
      const myInterval = setInterval(() => {
        bluetoothScan.bTDevicesArray !== []
          ? setBTDevicesArray([...bluetoothScan.bTDevicesArray])
          : setBTDevicesArray([{ name: "Searching ", id: "123456789" }]);
        count++;
        count === 10 && bluetoothScan.getSerialListUnpairedAsync();
        count > 20 && stopInterval();
        console.log(count);
      }, 2000);
      const stopInterval = () => {
        clearInterval(myInterval);
        count = 0;
        setBTDevicesArray(
          bluetoothScan.bTDevicesArray[0] !== undefined
            ? bluetoothScan.bTDevicesArray
            : [{ name: "No Bluetooth Devices Found ", id: "123456789" }]
        );
      };
    }
  };
  
  const remindBT = async (id, title, deviceClass) => {
    BTReminders = await storage.get("asyncBLEDevices");
    if (BTReminders && BTReminders.some((BTDevice) => id == BTDevice.id)) {
      alert("Reminder already set for this device");
      return;
    }
    serialBTReminders = await storage.get("asyncSerialBTDevices");
    if (serialBTReminders && serialBTReminders.some((BTDevice) => id == BTDevice.id)) {
      alert("Reminder already set for this device");
      return;
    }

    if(deviceClass !== undefined){
      appTasks.startCheckBluetooth(id);
      serialBTReminders === null && (serialBTReminders = []);
      serialBTReminders.push({id: id, name: title});
      await storage.store("asyncSerialBTDevices", serialBTReminders);
      alert(`Reminder ${title} set`);
    }else{
      appTasks.startCheckBle(id);
      BTReminders === null && (BTReminders = []);
      BTReminders.push({id: id, name: title});
      await storage.store("asyncBLEDevices", BTReminders);
      alert(`Reminder ${title} set`);
      bluetoothScan.subscribeBTScan(bluetoothManager.bluetoothManager.bluetoothManager);
    }
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
