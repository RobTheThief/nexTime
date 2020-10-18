import BluetoothSerial from 'react-native-bluetooth-serial';
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from "react";

import appTasks from "../utility/appTasks/";
import AppText from "../components/AppText";
import colors from "../config/colors";
import storage from "../utility/storage";
import AppHeader from '../components/AppHeader';
import AddBtReminderDetailScreen from './AddBtReminderDetailScreen';

var serialBTReminders = [];
var unfilteredUnpairedDevices = [];
var pairedDevices = [];

function BluetoothScreen({navigation}) {
  const [btDevicesArray, setBtDevicesArray] = useState(
    [{ name: "Pull down to refresh device list", id: "123456789" }, {id:'', name:''}]
  );
  const [btPairedDevicesArray, setBtPairedDevicesArray] = useState(pairedDevices);

  const [btRemindersArray, setBtRemindersArray] = useState(serialBTReminders);

  const [isFetching, setIsFetching] = useState(false);

  const [visible, setVisible] = useState(false);
  const [pickedId, setPickedId] = useState();
  const [pickedTitle, setPickedTitle] = useState();
  const addBtReminderDetail = (id, title) => {
    if (id !== '123456789' && id !== '') {
      id && setPickedId(id);
      title && setPickedTitle(title);
      visible ? setVisible(false) : setVisible(true);
    }
  }

  const onRefresh = () => {
    setIsFetching(true);
    updateDevices();
  }

  const updateReminderList = async () => {
    const serialBTReminders = await storage.get("asyncSerialBTDevices");
    (serialBTReminders && serialBTReminders.length === 1) && serialBTReminders.push({id:'', name:''});
    setBtRemindersArray(serialBTReminders ? serialBTReminders : [{ name: "Tap on a paired or unpaired device to set\na reminder", id: "123456789" },{id:'', name:''}]);
  }

  const getPaired = async () => {
    pairedDevices = await BluetoothSerial.list();
    setBtPairedDevicesArray(pairedDevices);
    updateReminderList();
  } 

  
  useEffect(() => {
    getPaired();
    updateReminderList();
  },[]);


  const updateDevices = async () => {
    setBtDevicesArray([{ name: "        Searching... ", id: "123456789" }]);

    getPaired();

    unfilteredUnpairedDevices = await BluetoothSerial.discoverUnpairedDevices();

    var bTDeviceIDs = [];
    var unpairedDevices = [];
    unfilteredUnpairedDevices.forEach((item) => bTDeviceIDs.push(item.id));
    var uniqueIDs = bTDeviceIDs.filter(function (item, pos, self) {
      return self.indexOf(item) == pos;
    });
  
    for (let i = 0; i < uniqueIDs.length; i++) {
      for (let j = 0; j < unfilteredUnpairedDevices.length; j++) {
        if (uniqueIDs[i] === unfilteredUnpairedDevices[j].id) {
          unpairedDevices.push(unfilteredUnpairedDevices[j]);
          j = unfilteredUnpairedDevices.length + 1;
        }
      }
    }

    setBtDevicesArray(
      unpairedDevices[0] !== undefined
        ? unpairedDevices
        : [{ name: "No new unpaired devices found ", id: "123456789" }]);
        
    setIsFetching(false);
  };

  const Item = ({ title, id }) => (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() => addBtReminderDetail(id, title)}
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
        onPress={() => addBtReminderDetail(id, title)}
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
      <AppHeader navigation={navigation} />
      {visible ? (
      <AddBtReminderDetailScreen 
        addBtReminderDetailVisibility={addBtReminderDetail}
        pickedTitle={pickedTitle}
        pickedId={pickedId}
        updateReminderList={updateReminderList}
        btRemindersArray={btRemindersArray}
      />
      ) : (
      <>  
        <View style={styles.btRemindersContainer}>
          <View style={styles.devicesHeader}>
            <MaterialCommunityIcons name="reminder" size={18} color={colors.primaryLight} />
            <AppText style={styles.devicesHeaderText} >REMINDERS</AppText>
          </View>
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
          <View style={styles.devicesHeader}>
            <MaterialCommunityIcons name="lan-connect" size={18} color={colors.primaryLight} />
            <AppText style={styles.devicesHeaderText} >PAIRED DEVICES</AppText>
          </View>
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
          <View style={styles.devicesHeader}>
            <MaterialCommunityIcons name="devices" size={18} color={colors.primaryLight} />
            <AppText style={styles.devicesHeaderText} >UNPAIRED DEVICES</AppText>
          </View>
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
      )}
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
    color: colors.secondary,
  },
  devicesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    marginBottom: 10,
    marginLeft: 30,
    marginTop: 20,
    color: colors.primaryLight,
  },
  devicesHeaderText: {
    fontSize: 17,
    color: colors.primaryLight,
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
    alignItems: 'center',
    marginTop: 10,
  },
  seperator: { 
    borderTopWidth: 1,
    borderTopColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    color: colors.light,
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
