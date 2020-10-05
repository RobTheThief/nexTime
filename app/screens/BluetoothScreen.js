import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import AppText from "../components/AppText";
import bluetooth from "../utility/bluetoothScan";
import colors from "../config/colors";
import storage from "../utility/storage";

var BTReminders = [];

function BluetoothScreen() {
  const [bTDevicesArray, setBTDevicesArray] = useState(
    bluetooth.bTDevicesArray
  );

  const updateDevices = () => {
    let count = 0;
    const myInterval = setInterval(() => {
      setBTDevicesArray([...bluetooth.bTDevicesArray]);
      count++;
      count === 20 && stopInterval();
      console.log(count);
    }, 2000);
    const stopInterval = () => clearInterval(myInterval);
  };

  const remindBT = async (id) => {
    BTReminders = await storage.get("asyncBTDevices");
    if (BTReminders && BTReminders.includes(id)) {
      alert("Reminder already set for this device");
      return;
    }
    BTReminders === null && (BTReminders = []);
    BTReminders.push(id);
    await storage.store("asyncBTDevices", BTReminders);
  };

  const Item = ({ title, rssi, id }) => (
    <View style={styles.item}>
      <TouchableOpacity onPress={() => remindBT(id)}>
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
