import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

function BluetoothScreen({ navigation }) {
  useEffect(() => {
    navigation.openDrawer();
  });

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {},
});

export default BluetoothScreen;
