import BluetoothSerial from 'react-native-bluetooth-serial';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from "react";

import AddBtReminderDetailScreen from './AddBtReminderDetailScreen';
import AppHeader from '../components/AppHeader';
import AppText from "../components/AppText";
import colors from "../config/colors";
import helpers from '../utility/helpers';
import storage from "../utility/storage";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import refreshData from '../utility/refreshData';

var lastAsyncReminder;
const btDisabledMessage = 'To refresh Paired and Unpaired devices please enable BLUETOOTH and LOCATION and pull down on the Unpaired devices list.'

function BluetoothScreen({navigation, themeState}) {

  useEffect(() => {
    helpers.ServicesDisabledMessage(BluetoothSerial, btDisabledMessage);
    getPaired();
    updateReminderList();
    refreshData.transferFuncAndVars('BluetoothScreen', lastAsyncReminder, setBtRemindersArray);
  }, []);

  const [btDevicesArray, setBtDevicesArray] = useState(
    [{ name: "Pull down to refresh device list", id: "123456789" , junk: true }]
  );
  const [btPairedDevicesArray, setBtPairedDevicesArray] = useState([]);
  const [btRemindersArray, setBtRemindersArray] = useState([]);

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
    setTimeout(() => {
       finishUnpairedSearch();
    }, 40000);
    updateDevices();
  }

  const updateReminderList = async () => {
    const serialBTReminders = await storage.get("asyncSerialBTDevices");
    serialBTReminders ? setBtRemindersArray(serialBTReminders) : setBtRemindersArray([]);
  }

  const getPaired = async () => {
    const pairedDevices = await BluetoothSerial.list();
    setBtPairedDevicesArray(pairedDevices);
  } 

  const finishUnpairedSearch = () => {
    setBtDevicesArray(
      unpairedDevices[0] !== undefined
        ? unpairedDevices
        : [{ name: "No new unpaired devices found ", id: "123456789" , junk: true}]);
        
    setIsFetching(false);
  }

  var unpairedDevices = [];
  const updateDevices = async () => {

    const isBtOrLocationDisabled = await helpers.ServicesDisabledMessage(BluetoothSerial, btDisabledMessage);
    if (isBtOrLocationDisabled === true){
      finishUnpairedSearch();
      return;
    }

    try {
      setBtDevicesArray([{ name: "Searching... ", id: "123456789" , junk: true}]);
    
      getPaired();

      var unfilteredUnpairedDevices = await BluetoothSerial.discoverUnpairedDevices();
      
      var bTDeviceIDs = [];
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

      finishUnpairedSearch();

    } catch (error) {
      setIsFetching(false);
      Alert.alert('nexTime', error);
    }
    
  };


  const handleDeleteReminder = async (item) => {
    Alert.alert(
      "Delete Reminder",
      `Are you sure you want to delete ${item.name ? item.name : item.id} reminder?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            var taskAsyncBTDevices = await storage.get("asyncSerialBTDevices");
            taskAsyncBTDevices && 
            (taskAsyncBTDevices = taskAsyncBTDevices.filter((reminder) => reminder.id !== item.id));
            taskAsyncBTDevices && 
            (taskAsyncBTDevices.length === 0 ?
            await storage.store("asyncSerialBTDevices", '') :
            await storage.store("asyncSerialBTDevices", taskAsyncBTDevices));
            updateReminderList();
          },
        },
      ],
      { cancelable: false }
    );
  }

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
    <View>
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
    <Swipeable renderRightActions={() => <RenderRightActions item={item} />} style={styles.swipe}>
      <ReminderItem 
        title={item.name ? item.name : item.id}
        id={item.id}
      />
    </Swipeable>
  );

  const RenderRightActions = ({item}) => (
      <View style={styles.deleteSwipe}>
          <TouchableOpacity style={styles.deleteButtonContainer} onPress={()=> handleDeleteReminder(item)}>
            <AppText style={styles.deleteSwipeText}>Delete</AppText>
            <Octicons name="trashcan" size={24} color = { colors.secondary } />
          </TouchableOpacity>
      </View>
  );

  const remindersEmptyList = () => (
    <AppText style={styles.device} >Tap on a paired or unpaired device to set a reminder</AppText>
  )

  return (
    <>
      <AppHeader themeState={themeState} style={{height: '12.8%'}} navigation={navigation} />
      {visible ? (
      <AddBtReminderDetailScreen 
        addBtReminderDetailVisibility={addBtReminderDetail}
        pickedTitle={pickedTitle}
        pickedId={pickedId}
        updateReminderList={updateReminderList}
        btRemindersArray={btRemindersArray}
        themeState={themeState}
      />
      ) : (
        <View style={colors.mode[themeState].main} > 

        <View style={[styles.btRemindersContainer, colors.mode[themeState].container]}>
          <View style={styles.devicesHeader}>
            <MaterialCommunityIcons name="reminder" size={18} color={colors.mode[themeState].headers.color} />
            <AppText style={[styles.devicesHeaderText, colors.mode[themeState].headers]} >REMINDERS</AppText>
          </View>
            <FlatList
              ListEmptyComponent = {remindersEmptyList}
              contentContainerStyle={styles.listItems}
              data={btRemindersArray}
              keyExtractor={(item) => item.id}
              persistentScrollbar = {true}
              renderItem={renderReminderItem}
              />
        </View>
        
        <View style={[styles.pairedContainer, colors.mode[themeState].container]}>
          <View style={styles.devicesHeader}>
            <MaterialCommunityIcons name="lan-connect" size={18} color={colors.mode[themeState].headers.color} />
            <AppText style={[styles.devicesHeaderText, colors.mode[themeState].headers]} >PAIRED DEVICES</AppText>
          </View>
          <FlatList
            contentContainerStyle={styles.listItems}
            data={btPairedDevicesArray}
            keyExtractor={(item) => item.id}
            persistentScrollbar = {true}
            renderItem={renderItem}
            scrollToOverflowEnabled={true}
            />
        </View>
        <View style={[styles.unPairedContainer, colors.mode[themeState].container]}>
          <View style={styles.devicesHeader}>
            <MaterialCommunityIcons name="devices" size={18} color={colors.mode[themeState].headers.color} />
            <AppText style={[styles.devicesHeaderText, colors.mode[themeState].headers]} >UNPAIRED DEVICES</AppText>
          </View>
          <FlatList
            contentContainerStyle={styles.listItems}
            data={btDevicesArray}
            keyExtractor={(item) => item.id}
            onRefresh = {() => onRefresh()}
            persistentScrollbar = {true}
            refreshing = {isFetching}
            renderItem={renderItem}
            />
        </View>
      </View>  
      )}
    </>
  );
}

const styles = StyleSheet.create({
  btRemindersContainer: {
    height: "31%",
    color: colors.primary,
    borderBottomWidth: 1,
    marginHorizontal: 20,
  },
  deleteButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  deleteSwipe: {
    alignItems: 'flex-end',
    width: '100%',
    backgroundColor: colors.primaryLight,
    paddingRight: 30,
  },
  deleteSwipeText :{
    paddingRight: 5,
  },
  device: {
    fontSize: 15,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
  },
  devicesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    marginBottom: 10,
    marginTop: 20,
  },
  devicesHeaderText: {
    fontSize: 17,
    color: colors.primaryLight,
    marginLeft: 5,
  },
  listItems: {
    marginRight: 20,
    width: '100%',
  },
  pairedContainer: {
    height: "31%",
    marginHorizontal: 20,
    borderBottomWidth: 1,
  },
  unPairedContainer: {
    height: "31%",
    color: colors.primary,
    marginHorizontal: 20,
    borderBottomWidth: 1,
  },
});

export default BluetoothScreen;
