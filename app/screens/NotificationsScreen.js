import React from "react";
import { StyleSheet, View, Button } from "react-native";
import * as TaskManager from "expo-task-manager";
import storage from "../utility/storage";

function NotificationsScreen({ navigation }) {
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
          onPress={() => storage.store("asyncMarkers", "")}
          title="Clear AsyncStorage Data"
        />
      </View>
      <View style={styles.container}>
        <Button onPress={() => navigation.goBack()} title="Go back" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});

export default NotificationsScreen;
TaskManager.unregisterAllTasksAsync();
