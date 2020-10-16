import BluetoothSerial from 'react-native-bluetooth-serial';
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";

import appTasks from "../utility/appTasks/";
import AppText from "../components/AppText";
import colors from "../config/colors";
import storage from "../utility/storage";

var serialBTReminders = [];
var unpairedDevices = [];
var pairedDevices = [];

function BluetoothScreen() {
  const [btDevicesArray, setBtDevicesArray] = useState(
    [{ name: "Pull down to refresh device list", id: "123456789" }, {id:'', name:''}]
  );
  const [btPairedDevicesArray, setBtPairedDevicesArray] = useState(pairedDevices);

  const [btRemindersArray, setBtRemindersArray] = useState(serialBTReminders);

  const [isFetching, setIsFetching] = useState(false);

  const onRefresh = () => {
    setIsFetching(true);
    updateDevices();
  }

  const updateReminderList = async () => {
    const serialBTReminders = await storage.get("asyncSerialBTDevices");
    (serialBTReminders && serialBTReminders.length === 1) && serialBTReminders.push({id:'', name:''});
    setBtRemindersArray(serialBTReminders ? serialBTReminders : [{ name: "Tap on a paired or unpaired\ndevice to set a reminder", id: "123456789" },{id:'', name:''}]);
  }

  const getUnpaired = async () => {
    pairedDevices = await BluetoothSerial.list();
    setBtPairedDevicesArray(pairedDevices);
    updateReminderList();
  } 

  
  useEffect(() => {
    getUnpaired();
    updateReminderList();
  },[]);


  const updateDevices = async () => {
    setBtDevicesArray([{ name: "        Searching... ", id: "123456789" }]);

    pairedDevices = await BluetoothSerial.list();
    setBtPairedDevicesArray(pairedDevices);

    unpairedDevices = await BluetoothSerial.discoverUnpairedDevices();

    setBtDevicesArray(
      unpairedDevices[0] !== undefined
        ? unpairedDevices
        : [{ name: "No new unpaired devices found ", id: "123456789" }]);
        
    setIsFetching(false);
  };
  
  const remindBT = async (id, title) => {
    serialBTReminders = await storage.get("asyncSerialBTDevices");
    if (serialBTReminders && serialBTReminders.some((BTDevice) => id == BTDevice.id)) {
      alert("Reminder already set for this device");
      return;
    }

    appTasks.startCheckBluetooth(id);
    serialBTReminders === null && (serialBTReminders = []);
    serialBTReminders.push({ id: id, name: title, taskDeleted: false, repeat: false, delete: false });
    await storage.store("asyncSerialBTDevices", serialBTReminders);
    updateReminderList();
    alert(`Reminder ${title} set`);
  };

  const Item = ({ title, id }) => (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() => id !== '123456789' && remindBT(id, title)}
      >
        <AppText style={styles.device}>
          {title}
        </AppText>
      </TouchableOpacity>
    </View>
  );

  const ReminderItem = ({ title, id }) => (
    <View style={styles.item}>
      <TouchableOpacity
        //onPress={() => id !== '123456789' && remindBT(id, title)}
      >
        <AppText style={styles.device}>
          {title}
        </AppText>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item
      title={item.name ? item.name : item.id}
      id={item.id}
    />
  );

  const renderReminderItem = ({ item }) => (
    <ReminderItem
      title={item.name ? item.name : item.id}
      id={item.id}
    />
  );

  const seperator = () => (
    <AppText style={styles.seperator} >_____________________________________</AppText>
  );

  return (
    <>
      <View style={styles.btRemindersContainer}>
        <AppText style={styles.devicesHeader} >Reminders</AppText>
        <FlatList
          contentContainerStyle={styles.listItems}
          data={btRemindersArray}
          ItemSeparatorComponent={seperator}
          keyExtractor={(item) => item.id}
          persistentScrollbar = {true}
          renderItem={renderReminderItem}
          />
      </View>
      <View style={styles.pairedContainer}>
        <AppText style={styles.devicesHeader} >Your Paired Devices</AppText>
        <FlatList
          contentContainerStyle={styles.listItems}
          data={btPairedDevicesArray}
          ItemSeparatorComponent={seperator}
          keyExtractor={(item) => item.id}
          persistentScrollbar = {true}
          renderItem={renderItem}
          scrollToOverflowEnabled={true}
          />
      </View>
      <View style={styles.unPairedContainer}>
      <AppText style={styles.devicesHeader} >Unpaired Devices</AppText>
        <FlatList
          contentContainerStyle={styles.listItems}
          data={btDevicesArray}
          ItemSeparatorComponent={seperator}
          keyExtractor={(item) => item.id}
          onRefresh = {() => onRefresh()}
          persistentScrollbar = {true}
          refreshing = {isFetching}
          renderItem={renderItem}
          />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  btRemindersContainer: {
    width: "100%",
    height: "25%",
    color: colors.primary,
    alignItems: 'center',
    marginTop: 10,
  },
  device: {
    fontSize: 15,
    width: '100%',
    alignItems: 'center',
  },
  devicesHeader: {
    fontSize: 22,
    marginBottom: 10,
    width: "100%",
    marginLeft: 5,
  },
  listItems: {
    alignItems: 'flex-start',
    marginRight: 20,
    width: '100%',
  },
  pairedContainer: {
    width: "100%",
    height: "25%",
    color: colors.primary,
    alignItems: 'center',
    marginTop: 10,
  },
  seperator: { 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    color: colors.primaryLight,
  },
  unPairedContainer: {
    width: "100%",
    height: "35%",
    color: colors.primary,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default BluetoothScreen;
