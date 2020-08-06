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
import Slider from "@react-native-community/slider";

import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import measurementSys from "../config/measurementSys";
import colors from "../config/colors";
import storage from "../utility/storage";
import { color } from "react-native-reanimated";

function AddMarkerDetailsScreen({
  markerDetailVisibility,
  pickedLocation,
  markers,
  id,
  setMarkers,
}) {
  const [title, onChangeTitle] = useState();
  const [description, onChangeDesc] = useState();
  const [radius, onChangeRadius] = useState(100);
  const [notes, onChangeNotes] = useState();

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
      notes: notes,
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
            placeholder={"Notes eg. Shopping list..."}
            multiline={true}
            textAlignVertical={"top"}
            spellCheck={true}
            style={styles.notes}
            onChangeText={(text) => onChangeNotes(text)}
          />
          <AppText>
            {radius < measurementSys.unitDivider
              ? radius + measurementSys.mOrFt
              : radius / measurementSys.unitDivider + measurementSys.kmOrMiles}
          </AppText>
          <Slider
            style={styles.slider}
            minimumValue={100}
            maximumValue={2000}
            step={100}
            minimumTrackTintColor="#ffa183"
            maximumTrackTintColor="#000000"
            thumbTintColor="#ffa183"
            value={radius}
            onValueChange={(value) => {
              onChangeRadius(value);
            }}
          />
          <View style={styles.radiusInput}>
            <AppTextInput
              style={{ width: "100%" }}
              keyboardType={"number-pad"}
              value={parseInt(radius, 10).toString()}
              onChangeText={(value) => {
                isNaN(parseInt(value)) && (value = 0);
                onChangeRadius(value);
              }}
            />
            <AppText style={styles.measureText}>{measurementSys.mOrFt}</AppText>
          </View>

          <View style={styles.switchContainer}>
            <AppText style={styles.repeatText}>Repeat</AppText>
            <Switch
              style={styles.switch}
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
    marginTop: 400,
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
  measureText: {
    position: "relative",
    right: 50,
  },
  notes: {
    borderColor: colors.primary,
    borderWidth: 2,
    height: 200,
    paddingLeft: 5,
    paddingTop: 5,
  },
  repeatText: {
    paddingRight: 20,
    fontSize: 20,
  },
  radiusInput: {
    width: "100%",
    flexDirection: "row",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  switch: {
    position: "relative",
    top: 2,
  },
  switchContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    flexDirection: "row",
  },
});
