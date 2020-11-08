import React, { useState } from "react";
import { Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import WifiManager from "react-native-wifi-reborn";

import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import colors from "../config/colors";

function WifiScreen({navigation}) {
  const [wifiDevicesArray, setWifiDevicesArray] = useState(
    [{ SSID: "Pull down to refresh network list", BSSID: "123456789" , junk: true }]
  );

  const [isFetching, setIsFetching] = useState(false);

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

  const RenderRightActions = ({item}) => (
    <View style={styles.deleteSwipe}>
        <TouchableOpacity style={styles.deleteButtonContainer} onPress={()=> handleDeleteReminder(item)}>
          <AppText style={styles.deleteSwipeText}>Delete</AppText>
          <Octicons name="trashcan" size={24} color = { colors.secondary } />
        </TouchableOpacity>
    </View>
);

  return (
    <>
      <AppHeader style={{height: '11.5%'}} navigation={ navigation } />
      <View>
        <View style={styles.availableNetworksContainer}>
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
    color: colors.secondary
  },
  listItems: {
    marginRight: 20,
    width: '100%',
  },
  network: {
    fontSize: 15,
    width: '100%',
    alignItems: 'center',
    color: colors.secondary,
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
});

export default WifiScreen;
