import { Alert } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";

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

var options = {};
const loadOptionsToMem = async () => {
 options = await get('options');
}

const getOptions = () => {
  return options;
};

const firstPickNumSystem = () => {
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
                resolve();
              }
          },
          {
            text: "Imperial",
            onPress: () => {
                store("options", {startBluetooth : false, measurementSys: 'imperial', color: 'light', });
                loadOptionsToMem();
                resolve();
              }
          },
        ],
        { cancelable: false }
      );
    }) 
  }
};

const formatStorage = async () => {
  await get("options") == null && await store("options", {startBluetooth : false, measurementSys: 'not set yet', color: 'light', });
  await loadOptionsToMem();
  await get("asyncMarkers") == null && await store("asyncMarkers", '');
  await get("asyncSerialBTDevices") == null && await store("asyncSerialBTDevices", '');
  await get("asyncWifiReminders") == null && await store("asyncWifiReminders", '');
}

export default {
  store,
  get,
  getOptions,
  loadOptionsToMem,
  firstPickNumSystem,
  formatStorage,
};
