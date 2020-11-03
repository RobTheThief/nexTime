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

var option = {};
const loadBluetoothOption = async () => {
 option = await get('startBluetooth');
}

const getbtStartOption = () => {
  return option;
};

const formatStorage = async () => {
  await get("startBluetooth") == null && await store("startBluetooth", {startBluetooth : false});
  loadBluetoothOption();
  await get("asyncMarkers") == null && await store("asyncMarkers", '');
  await get("asyncSerialBTDevices") == null && await store("asyncSerialBTDevices", '');
}

export default {
  store,
  get,
  getbtStartOption,
  formatStorage,
};
