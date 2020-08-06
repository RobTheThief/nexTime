import React, { useState } from "react";
import {
  Platform,
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";

import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import colors from "../config/colors";
import storage from "../utility/storage";

function AddMarkerDetailsScreen({
  markerDetailVisibility,
  pickedLocation,
  markers,
  id,
  setMarkers,
}) {
  const [title, onChangeTitle] = useState();
  const [description, onChangeDesc] = useState();
  const [radius, onChangeRadius] = useState();

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const onSubmitMarker = () => {
    markerDetailVisibility();
    markers.push({
      identifier: id,
      circleId: id + "c",
      title: title,
      description: description,
      latlng: pickedLocation,
      radius: radius,
      repeat: isEnabled,
    });
    setMarkers(markers.map((marker) => marker));
    storage.store("asyncMarkers", markers);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
      enabled={Platform.OS === "ios" ? true : false}
    >
      <View style={styles.inputBox}>
        <View style={styles.inputText}>
          <AppTextInput
            placeholder={"Title"}
            onChangeText={(text) => onChangeTitle(text)}
          />
          <AppTextInput
            placeholder={"Description"}
            onChangeText={(text) => onChangeDesc(text)}
          />
          <AppTextInput
            keyboardType={"number-pad"}
            placeholder={"Custom Radius"}
            onChangeText={(text) => onChangeRadius(text)}
          />
          <View style={styles.switch}>
            <AppText style={styles.repeatText}>Repeat</AppText>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? colors.primary : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => markerDetailVisibility()}
            style={styles.button}
          >
            <AntDesign name="leftcircleo" color={colors.primary} size={25} />
            <AppText style={styles.iconText}>Go Back</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onSubmitMarker()}
            style={styles.button}
          >
            <FontAwesome5
              name="map-marked-alt"
              size={24}
              color={colors.primary}
            />
            <AppText style={styles.iconText}>Submit</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default AddMarkerDetailsScreen;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 90,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    flex: 1,
    width: "100%",
    position: "relative",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    paddingLeft: 5,
  },
  inputBox: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: colors.secondary,
    padding: 10,
  },
  inputText: {
    width: "90%",
    height: "10%",
    alignItems: "center",
    marginVertical: 15,
  },
  repeatText: {
    paddingRight: 20,
    fontSize: 20,
  },
  switch: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    flexDirection: "row",
  },
});
