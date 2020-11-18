import React, { useEffect, useState } from "react";
import { Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import WifiManager from "react-native-wifi-reborn";

import AddWifiReminderDetailScreen from "./AddWifiReminderDetailScreen";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import colors from "../config/colors";
import helpers from '../utility/helpers';
import storage from "../utility/storage";
import Swipeable from "react-native-gesture-handler/Swipeable";

var lastAsyncReminder;

function WifiScreen({navigation, themeState}) {

  useEffect(() => {
    updateReminderList();
    helpers.loadReminderInterval("asyncWifiReminders", lastAsyncReminder, setWifiRemindersArray);
  }, []);

  const [wifiDevicesArray, setWifiDevicesArray] = useState(
    [{ SSID: "Pull down to refresh network list", BSSID: "123456789" , junk: true }]
  );

  const [wifiRemindersArray, setWifiRemindersArray] = useState([]);
  const updateReminderList = async () => {
    const wifiReminders = await storage.get("asyncWifiReminders");
    wifiReminders ? setWifiRemindersArray(wifiReminders) : setWifiRemindersArray([]);
  }
  const [isFetching, setIsFetching] = useState(false);

  const [visible, setVisible] = useState(false);
  const [pickedId, setPickedId] = useState();
  const [pickedTitle, setPickedTitle] = useState();

  const onRefresh = () => {
    setIsFetching(true);
    updateDevices();
  }

  const updateDevices = async () => {
    setWifiDevicesArray([{ SSID: "Searching... ", BSSID: "123456789" , junk: true}]);

    var unfilteredNetworks = await WifiManager.loadWifiList();
    var SSIDs = [];
    var filteredNetworks = [];

    unfilteredNetworks.forEach((item) => SSIDs.push(item.SSID));

    var uniqueSSIDs = SSIDs.filter(function (item, pos, self) {
      return self.indexOf(item) == pos;
    });
  
    for (let i = 0; i < uniqueSSIDs.length; i++) {
      for (let j = 0; j < unfilteredNetworks.length; j++) {
        if (uniqueSSIDs[i] === unfilteredNetworks[j].SSID) {
          filteredNetworks.push(unfilteredNetworks[j]);
          j = unfilteredNetworks.length + 1;
        }
      }
    }

    setWifiDevicesArray(
      filteredNetworks[0] !== undefined
        ? filteredNetworks
        : [{ SSID: "No networks in range ", BSSID: "123456789" , junk: true}]);
        
    setIsFetching(false);
  };

  const addWifiReminderDetail = (id, title) => {
    if (id !== '123456789' && id !== '') {
      id && setPickedId(id);
      title && setPickedTitle(title);
      visible ? setVisible(false) : setVisible(true);
    }
  }

  const handleDeleteReminder = async (item) => {
    Alert.alert(
      "Delete Reminder",
      `Are you sure you want to delete ${item.SSID} reminder?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            var taskAsyncWifiReminders = await storage.get("asyncWifiReminders");
            taskAsyncWifiReminders = taskAsyncWifiReminders.filter((reminder) => reminder.id !== item.id);
            taskAsyncWifiReminders.length === 0 ?
            await storage.store("asyncWifiReminders", '') :
            await storage.store("asyncWifiReminders", taskAsyncWifiReminders);
            updateReminderList();
          },
        },
      ],
      { cancelable: false }
    );
  }

  const Item = ({ title, id }) => (
    <View>
      <TouchableOpacity 
        onPress={() => addWifiReminderDetail(id, title)}
      >
        <AppText style={styles.network}>
          {title}
        </AppText>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item
      title={item.SSID}
      id={item.BSSID}
    />
  );

  const ReminderItem = ({ title, id }) => (
    <View>
      <TouchableOpacity
        onPress={() => addWifiReminderDetail(id, title)}
      >
        <AppText style={styles.network}>
          {title}
        </AppText>
      </TouchableOpacity>
    </View>
  );  

  const renderReminderItem = ({ item }) => (
    <Swipeable renderRightActions={() => <RenderRightActions item={item} />} style={styles.swipe}>
      <ReminderItem 
        title={item.name}
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
  <AppText style={styles.network} >Tap on an available network below to set a reminder</AppText>
)

  return (
    <>
      <AppHeader themeState={themeState} style={{height: '11.5%'}} navigation={ navigation } />
      {visible ? (
        <AddWifiReminderDetailScreen
        addWifiReminderDetailVisibility={addWifiReminderDetail}
        pickedTitle={pickedTitle}
        pickedId={pickedId}
        updateReminderList={updateReminderList}
        wifiRemindersArray={wifiRemindersArray}
        themeState = {themeState}
      />) : (
      <View style={colors.mode[themeState].main}>
        <View style={[styles.networkRemindersContainer, colors.mode[themeState].container]}>
          <View style={styles.networksHeader}>
            <MaterialCommunityIcons name="reminder" size={18} color={colors.primaryLight} />
            <AppText style={styles.networksHeaderText} >WIFI REMINDERS</AppText>
          </View>
          <FlatList
            ListEmptyComponent = {remindersEmptyList}
            contentContainerStyle={styles.listItems}
            data={wifiRemindersArray}
            keyExtractor={(item) => item.id}
            persistentScrollbar = {true}
            renderItem={renderReminderItem}
            />
        </View>
        <View style={[styles.availableNetworksContainer, colors.mode[themeState].container]}>
          <View style={styles.networksHeader}>
            <MaterialCommunityIcons name="devices" size={18} color={colors.primaryLight} />
            <AppText style={styles.networksHeaderText} >AVAILABLE NETWORKS</AppText>
          </View>
          <FlatList
            contentContainerStyle={styles.listItems}
            data={wifiDevicesArray}
            keyExtractor={(item) => item.BSSID}
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
  availableNetworksContainer: {
    height: "49%",
    color: colors.primary,
    marginHorizontal: 20,
    borderBottomWidth: 1,
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
  listItems: {
    marginRight: 20,
    width: '100%',
  },
  network: {
    fontSize: 15,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
  },
  networksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    marginBottom: 10,
    marginTop: 20,
    color: colors.primaryLight,
  },
  networksHeaderText: {
    fontSize: 17,
    color: colors.primaryLight,
    marginLeft: 5,
  },
  networkRemindersContainer: {
    height: "49%",
    color: colors.primary,
    marginHorizontal: 20,
    borderBottomWidth: 1,
  },
});

export default WifiScreen;
