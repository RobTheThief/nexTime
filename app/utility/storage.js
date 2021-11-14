import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

var options = {};

const store = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

const get = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    const item = JSON.parse(value);

    if (!item) return null;

    return item;
  } catch (error) {
    console.log(error);
  }
};

const loadOptionsToMem = async () => {
 options = await get('options');
}

const getOptions = () => {
  return options;
};

const firstPickNumSystem = () => {
  const firstUseTutorialMsg = () => {
    Alert.alert('nexTime', 'NOTE: Reminders will be checked in the background as frequently as possible.\n\nHowever due to Android background location handling, they cannot be expected to run any more frequently than every 15 minutes.');
  };
  if (options.measurementSys == 'not set yet'){
    return new Promise( resolve => { 
      Alert.alert(
        "Choose measurement system",
        `Please choose a system of measurement for your location reminders.`,
        [
          {
            text: "Metric",
            onPress:  () => {
                store("options", {startBluetooth : false, measurementSys: 'metric', color: 'light', });
                loadOptionsToMem();
                firstUseTutorialMsg();
                setTimeout(() => {
                  resolve();
                }, 5000);
              }
          },
          {
            text: "Imperial",
            onPress: () => {
                store("options", {startBluetooth : false, measurementSys: 'imperial', color: 'light', });
                loadOptionsToMem();
                firstUseTutorialMsg();
                setTimeout(() => {
                  resolve();
                }, 5000);
              }
          },
        ],
        { cancelable: false }
      );
    }) 
  }
};

const formatStorage = () => {
  return new Promise( async resolve => {
    await get("gpsReminded") == null && store('gpsReminded', true);
    await get("asyncTime") == null && await store("asyncTime", {time : Date.now()});
    await get("options") == null && await store("options", {startBluetooth : false, measurementSys: 'not set yet', color: 'light', });
    await loadOptionsToMem();
    await get("asyncMarkers") == null && await store("asyncMarkers", []);
    await get("asyncSerialBTDevices") == null && await store("asyncSerialBTDevices", '');
    await get("asyncWifiReminders") == null && await store("asyncWifiReminders", '');
    resolve();
  });
}

export default {
  firstPickNumSystem,
  formatStorage,
  get,
  getOptions,
  loadOptionsToMem,
  store,
};
