import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../config/colors";
import bluetooth from "../utility/bluetoothScan";

import { AntDesign } from "@expo/vector-icons";
import AppText from "../components/AppText";

function BluetoothScreen({ navigation }) {
  const [bTDevicesArray, setBTDevicesArray] = useState(
    bluetooth.bTDevicesArray
  );

  const updateDevices = () => {
    setBTDevicesArray([...bluetooth.bTDevicesArray]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => updateDevices()} style={styles.button}>
        <AntDesign name="leftcircle" color={colors.primary} size={29} />
        <AppText style={styles.iconText}>Update</AppText>
      </TouchableOpacity>
      <AppText>
        {bTDevicesArray[bTDevicesArray.length - 1].name
          ? bTDevicesArray[bTDevicesArray.length - 1].name
          : bTDevicesArray[bTDevicesArray.length - 1].localName
          ? bTDevicesArray[bTDevicesArray.length - 1].localName
          : bTDevicesArray[bTDevicesArray.length - 1].id}
        {" Signal: "}
        {bTDevicesArray[bTDevicesArray.length - 1].rssi}
      </AppText>
      <FlatList></FlatList>
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
