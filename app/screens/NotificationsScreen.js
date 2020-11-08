import React from "react";
import storage from "../utility/storage";
import { StyleSheet, View, Button } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from 'expo-location';

function NotificationsScreen({ navigation }) {
  const getTasks = async () => {
    const tasks = await TaskManager.getRegisteredTasksAsync();
    console.log("All Tasks", tasks);
  };

  return (
    <>
      <View style={styles.container}>
        <Button
          onPress={() => TaskManager.unregisterAllTasksAsync()}
          title="Clear all tasks"
        />
      </View>
      <View style={styles.container}>
        <Button
          onPress={() => {
            storage.store("asyncMarkers", "");
            storage.store("asyncSerialBTDevices", "");
            storage.store("asyncWifiReminders", "");
          }}
          title="Clear AsyncStorage Data"
        />
      </View>
      <View style={styles.container}>
        <Button onPress={async () => {getTasks(); var thing = await storage.get('startBluetooth');console.log(thing.startBluetooth)}} title="log tasks" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});

export default NotificationsScreen;
TaskManager.unregisterAllTasksAsync();



